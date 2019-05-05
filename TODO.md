# Tareas por hacer
- Conexión con una base de datos / redis configurable.

- Configuración de la aplicación (render, systray, etc).

- La carpeta de assets debería ser única entre styles y resources.
---
### Abstracción de la programación de cada elemento en una carpeta más visible.

Mover los ficheros del framework a una carpeta vendor y dejar la carpeta src
para los ficheros del programador donde tendrán:
app ( ficheros precompilados )
dist ( ficheros compilados para su distribución final de producción )
node_modules ( módulos de vendor necesarios para la compilación )
src ( el programador solamente necesitará modificar los ficheros de esta carpeta para crear la lógica de negocio )
	views ( contendrá los typescripts de ejecución en el render y plantillas )
		scripts ( contendrá los scripts del render, será ts )
		styles ( sass )
		templates ( ejs )
	models ( contendrá modelos de acceso a datos en base de datos, ws o ficheros )
	controllers ( contendrá la lógica de negocio mediante los modelos y redirigirá a la vista )
resources ( recursos en general, imagenes, js, etc que no se borrarán a diferencia de app )
	images
	icons
core
	app (bootstrap)
	kernel
	components
		menu
		systray
		config
config
	...
.env
