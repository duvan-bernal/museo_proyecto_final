Museo - Sistema de Gestión Museográfica (Proyecto Integrador)

Descripción general

Museo - Proyecto Integrador es una aplicación web desarrollada como sistema de gestión integral para museos, exposiciones, catálogos de obras y control de visitantes.

El sistema permite consultar, visualizar, registrar y administrar información relacionada con museos, obras de arte, artistas, categorías, salas de exposición, recorridos guiados y visitas. La aplicación cuenta con una interfaz web desarrollada en HTML5, CSS3 y JavaScript, respaldada por un backend en Java con el framework Quarkus y conexión a base de datos relacional, permitiendo que todos los cambios realizados desde las vistas se almacenen y actualicen de forma persistente.

Objetivo del proyecto

El objetivo principal del proyecto es construir una plataforma web que permita centralizar y organizar la información administrativa y cultural de un museo, facilitando la gestión de su inventario artístico, la distribución de sus espacios físicos y el seguimiento de recorridos y visitantes.

El sistema busca ofrecer una herramienta funcional donde los datos puedan ser consultados, registrados y administrados de manera visual, organizada y estructurada.

Funcionalidades principales

Inicio (index.html)
La vista principal funciona como panel central de navegación, permitiendo el acceso directo a cada uno de los módulos administrativos del sistema.

Museos (museos.html)
La sección de museos permite consultar y administrar la información institucional de los museos registrados en el sistema, incluyendo:
- Nombre del museo.
- Ubicación / dirección.
- Información general y descripción institucional.

Obras (obras.html)
La sección de obras permite gestionar el catálogo artístico del museo, incluyendo:
- Registro y consulta de obras.
- Asociación con artistas, categorías y salas.
- Carga y gestión de archivos o imágenes (almacenados en la carpeta uploads/).

Artistas (artistas.html)
La sección de artistas permite administrar los creadores vinculados a las obras del museo, permitiendo registrar, consultar y actualizar su información básica y trayectoria.

Categorías (categorias.html)
La sección de categorías permite clasificar las obras del museo según su corriente artística, técnica, época o temática.

Salas (salas.html)
La sección de salas permite visualizar y administrar los espacios físicos de exposición dentro del museo, organizando la distribución de las obras.

Recorridos (recorridos.html)
La sección de recorridos permite diseñar y gestionar las rutas o itinerarios temáticos disponibles dentro del museo.

Visitas (visitas.html)
La sección de visitas permite registrar, consultar y hacer seguimiento a las visitas realizadas a los museos y recorridos.

Los cambios realizados desde cada vista se comunican con los controladores del backend en Quarkus y se reflejan directamente en la base de datos.

Tecnologías utilizadas
| Tecnología | Uso |
| :--- | :--- |
| Java | Lenguaje principal del backend del proyecto |
| Quarkus | Framework principal para servicios REST, inyección de dependencias y persistencia |
| HTML5 / CSS3 / JavaScript | Desarrollo de la interfaz web, estilos y lógica del cliente |
| SQL (MySQL / PostgreSQL) | Creación, consulta y manipulación de datos |
| Maven | Gestión del proyecto, compilación y dependencias (pom.xml) |
| Docker | Contenedorización y despliegue (src/main/docker) |
| Visual Studio Code | Editor de código utilizado (con Quarkus Tools) |
| GitHub | Publicación y control de versiones |


Librerías y dependencias principales

El proyecto utiliza Maven (y el wrapper incluido mvnw / mvnw.cmd) para administrar las dependencias necesarias[cite: 1]:
- Quarkus REST / RESTEasy (exposición de endpoints en controller)[cite: 1]
- Quarkus Hibernate ORM / Panache (gestión de entidades en model y repository)[cite: 1]
- Driver JDBC de base de datos (MySQL / PostgreSQL)
- Quarkus Maven Plugin[cite: 1]

Estas dependencias se encuentran configuradas en el archivo:
```text
pom.xml
```
Motor de base de datos
El proyecto utiliza una base de datos relacional configurada mediante Quarkus.

Nombre recomendado de la base de datos:
museo_db

La base de datos contiene información relacionada con:
```text
Museos.
Obras.
Artistas.
Categorías.
Salas.
Recorridos.
Visitas.
```
El script SQL de inicialización de datos se encuentra en:
```text
src/main/resources/import.sql
```

Al iniciar la aplicación en modo desarrollo (quarkus:dev), Quarkus ejecuta automáticamente el contenido de import.sql para cargar la estructura y los datos iniciales de prueba.

Estructura del proyecto
```text
PROYECTO-INTEGRADOR-MUSEO/
├── .github/
├── .vscode/
└── proyecto_museo/
    ├── .mvn/
    ├── src/
    │   └── main/
    │       ├── docker/
    │       │   ├── Dockerfile.jvm
    │       │   ├── Dockerfile.legacy-jar
    │       │   ├── Dockerfile.native
    │       │   └── Dockerfile.native-micro
    │       ├── java/
    │       │   └── museo/
    │       │       ├── controller/
    │       │       ├── model/
    │       │       └── repository/
    │       └── resources/
    │           ├── META-INF/
    │           │   └── resources/
    │           │       ├── css/
    │           │       ├── js/
    │           │       ├── templates/
    │           │       ├── artistas.html
    │           │       ├── categorias.html
    │           │       ├── index.html
    │           │       ├── museos.html
    │           │       ├── obras.html
    │           │       ├── recorridos.html
    │           │       ├── salas.html
    │           │       └── visitas.html
    │           ├── application.properties
    │           └── import.sql
    ├── target/
    ├── uploads/
    ├── vistas/
    ├── .dockerignore
    ├── .gitignore
    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    └── README.md
```

Capturas del proyecto
<img width="1600" height="769" alt="WhatsApp Image 2026-11-18 at 12 40 34 (6)" src="https://github.com/user-attachments/assets/4eff7158-99d9-4101-8bc5-db35a266d22b" />

<img width="1600" height="769" alt="WhatsApp Image 2026-11-18 at 12 40 34 (5)" src="https://github.com/user-attachments/assets/28020a7a-8019-4328-95c0-27fc11be26cd" />

<img width="926" height="751" alt="WhatsApp Image 2026-11-18 at 12 40 34 (4)" src="https://github.com/user-attachments/assets/18aa785b-021b-41c9-8f4e-769de877d408" />

<img width="1600" height="775" alt="WhatsApp Image 2026-11-18 at 12 40 34 (3)" src="https://github.com/user-attachments/assets/f76c6092-2cbc-47c0-b141-b557be8e7355" />

<img width="798" height="687" alt="WhatsApp Image 2026-11-18 at 12 40 34 (2)" src="https://github.com/user-attachments/assets/a6540d84-3537-4fcb-9897-4a61a3e54ee4" />

<img width="1600" height="765" alt="WhatsApp Image 2026-11-18 at 12 40 34 (1)" src="https://github.com/user-attachments/assets/365e5d5b-4ac8-4aae-bc37-f6f74432b2a8" />

<img width="1600" height="720" alt="WhatsApp Image 2026-11-18 at 12 40 33" src="https://github.com/user-attachments/assets/70167066-c817-4d7c-875a-068f391ade4a" />

<img width="1600" height="775" alt="WhatsApp Image 2026-11-18 at 12 40 33 (7)" src="https://github.com/user-attachments/assets/a2967076-64f6-47a5-888d-7b0b0432bed4" />

<img width="811" height="481" alt="WhatsApp Image 2026-11-18 at 12 40 33 (6)" src="https://github.com/user-attachments/assets/10e78c6c-7dfd-4826-bfa4-7f53581f40a1" />

<img width="1600" height="776" alt="WhatsApp Image 2026-11-18 at 12 40 33 (5)" src="https://github.com/user-attachments/assets/80bc16a9-66ae-4510-91f9-59d28c32431b" />

<img width="815" height="590" alt="WhatsApp Image 2026-11-18 at 12 40 33 (4)" src="https://github.com/user-attachments/assets/21fbf7eb-bd92-461c-a131-1380114406f3" />

<img width="1600" height="769" alt="WhatsApp Image 2026-11-18 at 12 40 33 (3)" src="https://github.com/user-attachments/assets/58e3b351-34e6-4862-a9c1-fa8add391cce" />

<img width="812" height="705" alt="WhatsApp Image 2026-11-18 at 12 40 33 (2)" src="https://github.com/user-attachments/assets/9451689a-ccad-473b-bf3e-ad5cc8b5d196" />

<img width="1600" height="718" alt="WhatsApp Image 2026-11-18 at 12 40 33 (1)" src="https://github.com/user-attachments/assets/e3e6b90e-6ee7-44e1-b33d-07809ee5264c" />

<img width="818" height="885" alt="WhatsApp Image 2026-11-18 at 12 40 34" src="https://github.com/user-attachments/assets/42422b75-428f-4c00-ab25-602d30a6d7b9" />





Requisitos previos
```
Antes de ejecutar el proyecto, se recomienda tener instalado:
Java JDK (17 o superior).
Maven (o utilizar el Maven Wrapper incluido ./mvnw / mvnw.cmd).
Motor de Base de Datos (MySQL o PostgreSQL activo).
Visual Studio Code (con la extensión Quarkus Tools for Visual Studio Code) o un IDE compatible con Java.
(Opcional) Docker para ejecutar contenedores.
```

Cómo ejecutar el proyecto
```
Descargar o clonar el repositorio
Clona el repositorio desde GitHub ejecutando:
git clone https://github.com/duvan-bernal/museo_proyecto_final.git
Luego entra a la carpeta del proyecto:
cd museo_proyecto_final/PROYECTO-INTEGRADOR-MUSEO/proyecto_museo
También se puede descargar el repositorio como archivo .zip desde GitHub y descomprimirlo.
```

Crear la base de datos
```
Abre tu gestor de base de datos (MySQL Workbench, phpMyAdmin, pgAdmin o consola SQL) y crea la base de datos:
CREATE DATABASE museo_db;
```

Configurar la conexión a la base de datos
Abre el archivo:
src/main/resources/application.properties
Verifica y ajusta los parámetros de conexión según tu motor local (tipo de base de datos, URL JDBC, usuario y contraseña), por ejemplo:
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=tu_contraseña
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/museo_db
quarkus.hibernate-orm.database.generation=drop-and-create

Ejecutar el proyecto
```
Desde la terminal ubicada en la carpeta proyecto_museo, ejecuta el modo de desarrollo de Quarkus:
En Windows (CMD / PowerShell):
.\mvnw.cmd quarkus:dev
En Linux / macOS:
./mvnw quarkus:dev
También se puede ejecutar directamente desde Visual Studio Code utilizando la extensión Quarkus Tools.
```

Abrir la aplicación en el navegador
Una vez iniciado el servidor, accede desde tu navegador web a:
```
http://localhost:8080/index.html
```

Notas importantes
```
El servidor de base de datos debe estar activo antes de iniciar Quarkus.
La base de datos configurada en application.properties debe existir previamente.
El archivo src/main/resources/import.sql carga los datos iniciales automáticamente al arrancar en modo desarrollo.
Los archivos o imágenes subidos desde la aplicación se almacenan en la carpeta uploads/.
Si la aplicación no inicia correctamente, revisa las credenciales y el puerto configurado en src/main/resources/application.properties.
```

Posibles errores comunes
```
Error de conexión a la base de datos
Verificar:
Que el servicio del motor de base de datos (MySQL / PostgreSQL) esté iniciado.
Que el nombre de la base de datos en application.properties coincida con el creado en el servidor.
Que el usuario, contraseña y puerto (3306 para MySQL o 5432 para PostgreSQL) sean correctos.
```

El puerto 8080 ya está en uso
Verificar:
Que no haya otra instancia de Quarkus u otro servidor ejecutándose en el puerto 8080, o cambiar el puerto agregando quarkus.http.port=8081 en application.properties.

Maven no se reconoce como comando
Utilizar el wrapper incluido en la raíz de proyecto_museo 
```
(.\mvnw.cmd en Windows o ./mvnw en Linux/macOS) en lugar de mvn.
```
Estado del proyecto
Proyecto académico (Proyecto Integrador).
La interfaz web y los servicios REST en Quarkus se encuentran conectados a la base de datos, permitiendo consultar, registrar, actualizar y eliminar información relacionada con museos, obras, artistas, categorías, salas, recorridos y visitas.
