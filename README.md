# Modyn E-commerce API


## Clonar el repositorio
>git clone  https://github.com/1ASI0726-20233-Modyn/Modyn-web.git

> cd Modyn-ecommerce


## Instalar dependencias
> npm install


## Levantar el proyecto con Docker

### Construir y levantar los contenedores
> docker-compose up --build -d

### Ver contenedores corriendo
> docker ps

### Detener los contenedores
> docker-compose down


## Desarrollo local (sin Docker)

### 1. Levantar solo la base de datos
> docker start modyn_db

### 2. Correr el servidor
> npm start

### o con nodemon
> npm run dev

---

## Solución de errores

### Puerto 3000 ocupado
> netstat -ano | findstr :3000
> taskkill /IM node.exe /F

### Matar todos los procesos Node
> taskkill /IM node.exe /F

### Detener contenedor de la app para desarrollar local
> docker stop modyn_webapp

---

## Contenedores

| Nombre | Descripción | Puerto |
|---|---|---|
| modyn_webapp | App Express | 5000 |
| modyn_db | MongoDB | 27018 |