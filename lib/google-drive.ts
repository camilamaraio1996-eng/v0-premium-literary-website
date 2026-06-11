'use server'

import { google } from 'googleapis'
import type { JWT } from 'google-auth-library'

interface GoogleDriveConfig {
  projectId: string
  email: string
  privateKey: string
  folderId: string
}

function getGoogleDriveConfig(): GoogleDriveConfig {
  const projectId = process.env.GOOGLE_DRIVE_PROJECT_ID
  const email = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!projectId || !email || !privateKey || !folderId) {
    throw new Error('Credenciales de Google Drive no configuradas')
  }

  return { projectId, email, privateKey, folderId }
}

async function getGoogleDriveClient() {
  const config = getGoogleDriveConfig()

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: config.projectId,
        private_key_id: 'key-id',
        private_key: config.privateKey.replace(/\\n/g, '\n'),
        client_email: config.email,
        client_id: '1',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
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

    // 1. Crear documento en blanco
    console.log('[v0] Creating blank document...')
    const docResponse = await docs.documents.create({
      requestBody: {
        title: params.title,
      },
    })

    const docId = docResponse.data.documentId
    if (!docId) throw new Error('No document ID returned')
    console.log('[v0] Document created with ID:', docId)

    // 2. Mover documento a la carpeta de blog
    console.log('[v0] Moving document to folder:', config.folderId)
    await drive.files.update({
      fileId: docId,
      addParents: config.folderId,
      removeParents: 'root',
      fields: 'id, parents',
    })

    // 3. Insertar contenido (título y contenido)
    const plainContent = params.content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')

    const requests: any[] = [
      {
        insertText: {
          text: params.title,
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
      {
        insertText: {
          text: `\n\n${plainContent}\n\n---\nURL: ${params.blogUrl}`,
          location: { index: params.title.length + 1 },
        },
      },
    ]

    // 4. Insertar imágenes (embedidas en el documento)
    console.log('[v0] Adding', params.images.length, 'images to document')
    let insertIndex = params.title.length + plainContent.length + params.blogUrl.length + 15
    for (const imageUrl of params.images) {
      requests.push({
        insertInlineImage: {
          location: { index: insertIndex },
          uri: imageUrl,
        },
      })
      requests.push({
        insertText: {
          text: '\n',
          location: { index: insertIndex + 1 },
        },
      })
      insertIndex += 2
    }

    // 5. Aplicar cambios al documento
    console.log('[v0] Applying batch updates to document')
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests },
    })

    // 6. Obtener URL pública del documento
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
    const { docs, auth } = await getGoogleDriveClient()

    // 1. Obtener contenido actual del documento
    const doc = await docs.documents.get({
      documentId: params.docId,
    })

    if (!doc.data.body?.content) {
      throw new Error('No content found in document')
    }

    // 2. Limpiar contenido actual (eliminar todo excepto el último párrafo que es obligatorio)
    const endIndex = doc.data.body.content[doc.data.body.content.length - 1]?.endIndex || 1
    const deleteIndex = 1

    const requests = [
      {
        deleteContentRange: {
          range: { startIndex: deleteIndex, endIndex: endIndex - 1 },
        },
      },
    ]

    // 3. Insertar nuevo contenido
    requests.push({
      insertText: {
        text: `${params.title}\n\n${params.content}\n\n---\nURL: ${params.blogUrl}`,
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

    // 5. Insertar imágenes
    let insertIndex = params.title.length + params.content.length + 3
    for (const imageUrl of params.images) {
      requests.push({
        insertInlineImage: {
          location: { index: insertIndex },
          uri: imageUrl,
        },
      })
      requests.push({
        insertText: {
          text: '\n',
          location: { index: insertIndex + 1 },
        },
      })
      insertIndex += 2
    }

    // 6. Aplicar cambios
    await docs.documents.batchUpdate({
      documentId: params.docId,
      requestBody: { requests },
    })

    return { success: true }
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
