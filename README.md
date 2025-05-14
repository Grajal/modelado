# RutasVerdes Castilla y León 🌿

Aplicación web interactiva que permite explorar rutas de senderismo señalizadas dentro de Castilla y León utilizando datos abiertos geográficos.

## 🌐 Funcionalidad

- Visualización de rutas en un mapa interactivo (Leaflet)
- Filtros por nombre, dificultad y distancia
- Información detallada de cada ruta (nombre, longitud, dificultad, duración)
- Capas informativas con nombres geográficos relevantes
- Compatible con ubicación del usuario (botón "Mi ubicación")

## 🗂️ Datos Utilizados

- `senda.json`: Rutas georreferenciadas proporcionadas por la Junta de Castilla y León
- `lugares_cyl.json`: Nombres geográficos del IGN (ríos, montañas, poblaciones...)

## ⚙️ Tecnologías

- React + TypeScript
- Vite
- Leaflet / react-leaflet
- Tailwind CSS
- Radix UI
- Context API para gestión de estado

## ▶️ Uso local

```bash
pnpm install
pnpm dev
```

## 🔗 Enlace al prototipo

[RutasVerdes Castilla y León](https://rutasverdes.vercel.app/)
