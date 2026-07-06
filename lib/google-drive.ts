'use server'

import { google } from 'googleapis'

interface GoogleDriveConfig {
  projectId: string
  email: string
  privateKey: string
  folderId: string
}

/**
 * Normaliza la private key sin importar cómo fue almacenada en la variable de entorno.
 * Reconstruye el PEM desde cero: tolera comillas envolventes, \n literales,
 * saltos de línea perdidos, e incluso que se haya pegado el JSON completo
 * de la cuenta de servicio.
 */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim()

  // Si pegaron el JSON completo de la cuenta de servicio, extraer private_key
  if (key.startsWith('{')) {
    try {
      const parsed = JSON.parse(key)
      if (parsed.private_key) key = parsed.private_key
    } catch {
      // no era JSON válido, seguir con el valor crudo
    }
  }

  // Quitar comillas envolventes y normalizar saltos de línea escapados
  key = key
    .replace(/^["']+|["']+$/g, '')
    .replace(/\\r/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '')
    .trim()

  // Detectar el tipo de header si existe (PRIVATE KEY = PKCS#8, el formato de Google)
  const match = key.match(/-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/)
  const label = match ? match[1] : 'PRIVATE KEY'
  const body = match ? match[2] : key

  // Reconstruir el PEM: solo base64, en líneas de 64 caracteres
  const base64 = body.replace(/[^A-Za-z0-9+/=]/g, '')
  const lines = base64.match(/.{1,64}/g) || []
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`
}

function getGoogleDriveConfig(): GoogleDriveConfig {
  const projectId = process.env.GOOGLE_DRIVE_PROJECT_ID
  const email = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!projectId || !email || !privateKey || !folderId) {
    const missing = [
      !projectId && 'GOOGLE_DRIVE_PROJECT_ID',
      !email && 'GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL',
      !privateKey && 'GOOGLE_DRIVE_PRIVATE_KEY',
      !folderId && 'GOOGLE_DRIVE_FOLDER_ID',
    ].filter(Boolean)
    throw new Error(`Credenciales de Google Drive no configuradas (faltan: ${missing.join(', ')})`)
  }

  return { projectId, email, privateKey: normalizePrivateKey(privateKey), folderId }
}

async function getGoogleDriveClient() {
  const config = getGoogleDriveConfig()

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: config.projectId,
        private_key: config.privateKey,
        client_email: config.email,
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/documents',
      ],
    })

    return {
      drive: google.drive({ version: 'v3', auth }),
      docs: google.docs({ version: 'v1', auth }),
    }
  } catch (error: any) {
    console.error('[v0] Error initializing Google Auth:', error.message)
    throw new Error(`Error inicializando autenticación de Google: ${error.message}`)
  }
}

/** Convierte el HTML del post a texto plano para el Doc */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/**
 * Inserta las imágenes al final del documento en batchUpdates separados.
 * Si una imagen falla (URL no accesible públicamente, formato no soportado),
 * no rompe la sincronización del texto.
 */
async function appendImages(
  docs: ReturnType<typeof google.docs>,
  docId: string,
  images: string[],
) {
  for (const imageUrl of images) {
    if (!imageUrl || !/^https?:\/\//.test(imageUrl)) continue
    try {
      // Obtener el índice final actual del documento antes de cada inserción
      const doc = await docs.documents.get({ documentId: docId })
      const content = doc.data.body?.content
      const endIndex = content?.[content.length - 1]?.endIndex || 2
      // La inserción máxima válida es endIndex - 1 (antes del salto de línea final)
      const insertIndex = Math.max(1, endIndex - 1)

      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            { insertText: { text: '\n', location: { index: insertIndex } } },
            { insertInlineImage: { location: { index: insertIndex + 1 }, uri: imageUrl } },
          ],
        },
      })
    } catch (error: any) {
      // No bloquear la sincronización por una imagen que Google no pudo descargar
      console.error('[v0] Could not insert image into doc:', imageUrl, error.message)
    }
  }
}

interface CreateDocumentParams {
  title: string
  content: string
  images: string[]
  blogUrl: string
}

/** Crea un Google Doc con contenido e imágenes */
export async function createGoogleDoc(params: CreateDocumentParams) {
  try {
    console.log('[v0] Creating Google Doc:', params.title)
    const config = getGoogleDriveConfig()
    const { drive, docs } = await getGoogleDriveClient()

    // 1. Crear el documento directamente dentro de la carpeta del blog
    //    (evita el paso de "mover desde root", que falla si la carpeta no está compartida)
    console.log('[v0] Creating document in folder:', config.folderId)
    let docId: string
    try {
      const fileResponse = await drive.files.create({
        requestBody: {
          name: params.title,
          mimeType: 'application/vnd.google-apps.document',
          parents: [config.folderId],
        },
        fields: 'id',
        supportsAllDrives: true,
      })
      docId = fileResponse.data.id || ''
    } catch (error: any) {
      const reason = error?.errors?.[0]?.reason || ''
      const googleMessage = error?.errors?.[0]?.message || error?.message || ''
      console.error('[v0] Drive create error detail:', {
        code: error?.code,
        status: error?.status,
        reason,
        googleMessage,
        errors: JSON.stringify(error?.errors),
      })

      if (reason === 'storageQuotaExceeded' || /storage quota/i.test(googleMessage)) {
        throw new Error(
          'Google ya no permite que las cuentas de servicio creen archivos en Mi Unidad (no tienen cuota de almacenamiento). Hay que usar OAuth con tu propia cuenta de Google.',
        )
      }
      if (error?.code === 404 || error?.status === 404) {
        throw new Error(
          `La carpeta de Drive (${config.folderId}) no existe o no está compartida con la cuenta de servicio ${config.email}. Compartí la carpeta con ese email como Editor.`,
        )
      }
      if (error?.code === 403 || error?.status === 403) {
        throw new Error(
          `Google rechazó la creación del documento (403). Razón: ${reason || 'desconocida'} — ${googleMessage}`,
        )
      }
      throw error
    }
    if (!docId) throw new Error('No document ID returned')
    console.log('[v0] Document created with ID:', docId)

    // 2. Insertar contenido (título y contenido)
    const plainContent = stripHtml(params.content)
    const bodyText = `\n\n${plainContent}\n\n---\nURL: ${params.blogUrl}`

    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              text: params.title + bodyText,
              location: { index: 1 },
            },
          },
          {
            updateTextStyle: {
              range: { startIndex: 1, endIndex: params.title.length + 1 },
              textStyle: {
                fontSize: { magnitude: 24, unit: 'pt' },
                bold: true,
              },
              fields: 'fontSize,bold',
            },
          },
        ],
      },
    })

    // 3. Insertar imágenes al final (sin bloquear si alguna falla)
    console.log('[v0] Adding', params.images.length, 'images to document')
    await appendImages(docs, docId, params.images)

    // 4. Obtener URL del documento
    const docUrl = `https://docs.google.com/document/d/${docId}/edit?usp=sharing`
    console.log('[v0] Document created successfully:', docUrl)

    return {
      success: true,
      docId,
      docUrl,
    }
  } catch (error: any) {
    console.error('[v0] Error creating Google Doc:', {
      message: error.message,
      code: error.code,
      status: error.status,
      errors: error.errors,
    })
    throw error
  }
}

interface UpdateDocumentParams {
  docId: string
  title: string
  content: string
  images: string[]
  blogUrl: string
}

/** Actualiza un Google Doc existente */
export async function updateGoogleDoc(params: UpdateDocumentParams) {
  try {
    const { docs } = await getGoogleDriveClient()

    // 1. Obtener contenido actual del documento
    const doc = await docs.documents.get({
      documentId: params.docId,
    })

    if (!doc.data.body?.content) {
      throw new Error('No content found in document')
    }

    // 2. Limpiar contenido actual (el último salto de línea es obligatorio y no se puede borrar)
    const endIndex = doc.data.body.content[doc.data.body.content.length - 1]?.endIndex || 1
    const requests: any[] = []
    if (endIndex - 1 > 1) {
      requests.push({
        deleteContentRange: {
          range: { startIndex: 1, endIndex: endIndex - 1 },
        },
      })
    }

    // 3. Insertar nuevo contenido (texto plano, sin etiquetas HTML)
    const plainContent = stripHtml(params.content)
    requests.push({
      insertText: {
        text: `${params.title}\n\n${plainContent}\n\n---\nURL: ${params.blogUrl}`,
        location: { index: 1 },
      },
    })

    // 4. Formatear título
    requests.push({
      updateTextStyle: {
        range: { startIndex: 1, endIndex: params.title.length + 1 },
        textStyle: {
          fontSize: { magnitude: 24, unit: 'pt' },
          bold: true,
        },
        fields: 'fontSize,bold',
      },
    })

    // 5. Aplicar cambios de texto
    await docs.documents.batchUpdate({
      documentId: params.docId,
      requestBody: { requests },
    })

    // 6. Insertar imágenes al final (sin bloquear si alguna falla)
    await appendImages(docs, params.docId, params.images)

    return {
      success: true,
      docId: params.docId,
      docUrl: `https://docs.google.com/document/d/${params.docId}/edit?usp=sharing`,
    }
  } catch (error: any) {
    console.error('[v0] Error updating Google Doc:', error.message)
    throw error
  }
}

/** Elimina un Google Doc */
export async function deleteGoogleDoc(docId: string) {
  try {
    const { drive } = await getGoogleDriveClient()
    await drive.files.delete({
      fileId: docId,
    })
    return { success: true }
  } catch (error: any) {
    console.error('[v0] Error deleting Google Doc:', error.message)
    throw error
  }
}
