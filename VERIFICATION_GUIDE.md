# Guía de Verificación del Sistema CMS

## Configuración (Admin Settings)

### Test 1: Actualizar Título del Sitio
1. Ir a `/admin/settings`
2. Cambiar "site_title" a "Test Libro 2024"
3. Hacer click en "Guardar Configuración"
4. Esperar confirmación ✓
5. Recargar página
6. Verificar que el título cambió en la BD
7. Ir a `/` y verificar que el título en navegación se actualizó

### Test 2: Actualizar Menús de Navegación
1. En `/admin/settings`
2. Cambiar "nav_libro" a "Mi Novela"
3. Guardar
4. Ir a `/` y verificar que el menú dice "Mi Novela"
5. Navegar a otras páginas y verificar que se actualiza

## Información del Libro

### Test 3: Actualizar Descripción del Libro
1. Ir a `/admin/book`
2. Cambiar la descripción
3. Guardar
4. Ir a `/libro`
5. Verificar que la descripción se actualizó

### Test 4: Agregar Portada
1. En `/admin/book`
2. Pegue URL de una imagen
3. Guardar
4. Verificar preview inmediato
5. Ir a `/libro` y verificar que aparece la portada

## Fragmentos del Libro

### Test 5: Editar Fragmentos
1. Ir a `/admin/fragments-edit`
2. Cambiar título de un fragmento
3. Agregar contenido
4. Guardar
5. Ir a `/libro` y verificar que los fragmentos se actualizaron

### Test 6: Eliminar Fragmento
1. En `/admin/fragments-edit`
2. Hacer click en el icono de papelera
3. Confirmar
4. Verificar que desapareció de la lista
5. Ir a `/libro` y verificar que desapareció

## Persistencia de Datos

### Test 7: Verificar que Cambios Persisten
1. Cambiar algo en admin
2. Guardar
3. Recargar página
4. Los cambios deberían estar ahí
5. Navegar a otra sección y volver
6. Los cambios siguen ahí

### Test 8: Verificar Caché Clearing
1. Cambiar título del sitio
2. Guardare
3. Abrir `/` en nueva pestaña
4. Debería ver el título actualizado (no caché viejo)

## Operaciones CRUD

### Test 9: Create (Crear fragmentos)
1. Ir a `/admin/fragments/new`
2. Crear nuevo fragmento
3. Guardar
4. Verificar que aparece en `/libro`

### Test 10: Update (Actualizar)
- Completado en Tests 3-6

### Test 11: Delete (Eliminar)
- Completado en Test 6

### Test 12: Read (Leer)
1. Ir a cualquier página pública
2. Los datos deberían cargarse correctamente desde BD

## Verificación de Base de Datos

### Revisar Supabase Directamente
1. Abrir dashboard de Supabase
2. Ir a tabla `site_settings`
3. Verificar que los cambios están guardados
4. Revisar `book_info`
5. Revisar `book_fragments`

## Checks Finales

- [ ] Los cambios en admin se guardan en BD
- [ ] Los cambios persisten después de recargar
- [ ] Las páginas públicas leen datos dinámicamente
- [ ] No hay datos hardcodeados en componentes
- [ ] Los mensajes de éxito/error aparecen
- [ ] La navegación se actualiza sin recargar
- [ ] Los fragmentos se muestran/ocultan correctamente
- [ ] Las imágenes se cargan desde URLs
