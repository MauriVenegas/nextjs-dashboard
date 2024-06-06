## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

### Contenido

Tutorial https://www.youtube.com/watch?v=jMy4pVZMyLM&t=338s

#### 🎨 Módulos en CSS

- [./app/ui/home.module.css](./app/ui/home.module.css)
- [./app/page.tsx](./app/page.tsx)

#### 🖋️ Importar y cargar fuentes

- [./app/ui/fonts.ts](./app/ui/fonts.ts)
- [./app/layout.tsx](./app/layout.tsx)

#### 🖼️ Optimizar la carga de imágenes \<Image\>

- [./app/page.tsx](./app/page.tsx)

#### 🗂️ Enrutado de archivos

Se crean carpetas y sub carpetas con la misma distribución de la ruta.

Ej: en la ruta http://localhost:3000/dashboard/customers dentro de la capeta App existe la capeta **dashboard** y dentro de esta la carpeta **customers**.

Cada carpeta debe contener un archivo **page.tsx** el cual posee la información de la página y si desea cargar mas de una página se pude cargar desde el archivo **layout.tsx**.

- [./app/dashboard/layout.tsx](./app/dashboard/layout.tsx)
- [./app/dashboard/page.tsx](./app/dashboard/page.tsx)

#### 📑 SPA (single page aplication)

Se utiliza la etiquete **\<Link\>** para optimizar la recarga y no volver a cargar de nuevo los recursos.

- [./app/ui/dashboard/nav-links.tsx](./app/ui/dashboard/nav-links.tsx)

#### 👨‍💻 "use client"

Por defecto Next.js renderiza todo en el servidor, por lo cual debemos escribir "use client" cuando necesitamos que lo haga también en el cliente.

Ej: cuando usamos **usePathname** para conocer la ruta actual se debe renderizar en el cliente ya que en el servidor no se trabaja con rutas.

- [./app/ui/dashboard/nav-links.tsx](./app/ui/dashboard/nav-links.tsx)

#### 💾 Conexión a la base de datos

1. Crear la bd **custumer-invoices** de Postgres en [aquí](https://vercel.com/mauricios-projects-2e094972/~/stores).
2. Instalar dependencia `npm install @vercel/postgres`.
3. Copiar las credenciales de la bd creada para pegarlas en **.env**.
4. Agregar el script **"seed": "node -r dotenv/config ./scripts/seed.js"** al archivo **package.json** y ejecutar el comando `npm run seed` para consultar el archivo **.env** para conectarse a la bd y ejecutar el seed con los datos de prueba.

#### 📊 Carga de componentes y datos

En el archivo [./app/dashboard/page.tsx](./app/dashboard/page.tsx) se cargan componentes de gráficos y cards asi como también los datos para rellenar estos.

#### 🔄 Loading

Si se crea un archivo **loading.tsx** este se mostrara por defecto mientras se carga la página.

Pero el archivo de loading se cargara a todas las sub carpetas en este caso **invoices** y **customers**, para solucionar esto se debe crear una la carpeta **(overview)** y mover los archivos **loading.tsx** y **page.tsx** dentro.

[./app/dashboard/(overview)/loading.tsx](<./app/dashboard/(overview)/loading.tsx>)

##### Streaming de componentes

El problema del archivo loading es que espera que se carguen todos los componentes para mostrar la pagina, por lo cual se recomienda el uso del componente de React **\<Suspense\>** el cual permite mostrar un esqueleto para cada componente mientra este se carga.

#### 🔍 busqueda y paginación

A medida que se escribe la factura (invoice) a buscar esta se agrega a la URL de la pagina, se esa forma se puede compartir esta URL con la busqueda realizada.

El componente donde se realiza esto es:
[./app/dashboard/invoices/page.tsx](./app/dashboard/invoices/page.tsx)

#### ⚡️ Server actions

Las acciones de React server permiten ejecutar codigo asincrono en el servidor y se pueden invocar desde el cliente o componente del servidor.

Debvemo escribir **'use server'** para ejecutar coodigo en el servidor:
[./app/lib/actions.ts](./app/lib/actions.ts)

#### 😨 Manejo de errores

El archivo **error.tsx** nos permite capturar los errores y mostrarselos al usuario.

Los errores se ecuentran en: [./app/lib/actions.ts](./app/lib/actions.ts)

Y son capturados en: [./app/dashboard/invoices/error.tsx](./app/dashboard/invoices/error.tsx)

El archivo **not-fund.tsx** lo utilizamos cuando no encontrmao la pagina y se llama con **notFound()**

Ver archivo: [./app/dashboard/invoices/[id]/edit/page.tsx](./app/dashboard/invoices/[id]/edit/page.tsx)
