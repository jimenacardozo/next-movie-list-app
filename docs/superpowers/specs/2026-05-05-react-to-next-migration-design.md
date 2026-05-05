# Diseño: Migración de React a Next.js (App Router)

**Fecha:** 2026-05-05  
**Proyecto:** movie-list-app  
**Objetivo:** Completar la migración desde Vite + React SPA hacia Next.js App Router, aprendiendo los conceptos clave de Next.js en el proceso.

---

## Contexto

El proyecto `react-app` es una SPA con Vite + React. Todo el fetching, estado y navegación sucede en el cliente. El proyecto `movie-list-app` es la versión Next.js, ya parcialmente migrada, pero con varios bugs y piezas incompletas.

### Estado actual del movie-list-app

**Ya migrado:**
- Estructura de archivos App Router (`src/app/`, `src/components/`)
- `page.tsx` como Server Component async con fetches directos
- `MovieSection.tsx` como límite `'use client'` que contiene `useMovies`
- `movieService.ts` adaptado (sin `.js` extensions, sin `import.meta.env`)
- `config.ts` usando `process.env`
- Componentes: Header, Hero, Footer, MovieCard, ContentGrid, Filters, Pagination

**Pendiente / con bugs:**
- `layout.tsx` duplica Header y Footer con `page.tsx`
- `next/image` sin props requeridas en Hero y MovieCard
- `next.config.ts` vacío (falta `remotePatterns` para TMDB)
- Variable de entorno con prefijo incorrecto para uso client-side
- `useMovies` usa `window.history.pushState` y `window.location` en vez del router de Next.js
- Hooks `useTrendingMovie` y `useMovieDetails` ya no se usan (reemplazados por fetching server-side)

---

## Arquitectura objetivo

```
layout.tsx (Server Component)
  └── Header (Server Component)
  └── {children}  ← page.tsx
  └── Footer (Server Component)

page.tsx (async Server Component)
  ├── fetch trending movie        ← sin useEffect, sin loading state
  ├── fetch genres                ← datos disponibles antes del primer render
  ├── fetch movie details
  └── renders:
      ├── Hero (datos como props)
      └── MovieSection (Client Component boundary)
              ├── useMovies hook  ← estado interactivo, URL sync
              ├── Filters
              ├── ContentGrid
              └── Pagination
```

**Regla central:** si un componente responde a interacción del usuario o necesita estado → `'use client'`. Si solo muestra datos → Server Component (default).

---

## Pasos de migración

### Paso 1 — `layout.tsx` y el patrón de layouts

**Concepto Next.js:** `layout.tsx` es el wrapper compartido entre páginas. Se renderiza una vez y persiste entre navegaciones (no se re-monta).

**Qué hacer:**
- `layout.tsx` debe tener Header y Footer, y renderizar `{children}` en el medio
- `page.tsx` debe contener solo el contenido propio de la página (Hero + MovieSection), sin Header ni Footer
- El `<main>` wrapper puede vivir en layout o en page, pero no en ambos

**Por qué importa:** en React SPA todos los componentes se montan/desmontan con cada render. En Next.js, el layout persiste — ideal para navegación, estado global, y evitar re-fetching innecesario.

---

### Paso 2 — `next.config.ts` y `remotePatterns`

**Concepto Next.js:** Next.js restringe de qué dominios puede cargar imágenes `next/image` para prevenir abuso del servidor de optimización.

**Qué hacer:**
- En `next.config.ts`, agregar `images.remotePatterns` con el hostname `image.tmdb.org`
- Protocolo: `https`, pathname: `/**`

**Por qué importa:** sin esto, cualquier `<Image src="https://image.tmdb.org/...">` tira error en runtime. Es la configuración mínima para usar imágenes externas.

---

### Paso 3 — `next/image` en Hero y MovieCard

**Concepto Next.js:** `next/image` optimiza automáticamente imágenes (lazy load, WebP, redimensionado), pero necesita saber las dimensiones para reservar el espacio y evitar layout shift.

**Qué hacer en `MovieCard.tsx`:**
- Usar `width` y `height` con las dimensiones del poster TMDB (w342 → 342×513)
- O usar `fill` con un contenedor `relative` de altura fija

**Qué hacer en `Hero.tsx`:**
- El poster del hero es más grande (`w500` → 500×750)
- Usar `width`/`height` explícitos o `fill` según el diseño del contenedor

**Fallback:** el `fallbackPoster` importado desde `/public` es una imagen local — Next.js lo maneja distinto a las externas, no necesita `remotePatterns`.

---

### Paso 4 — Variables de entorno

**Concepto Next.js:** Next.js tiene dos tipos de env vars:
- `TMDB_TOKEN` — solo disponible en el servidor (Node.js runtime). No llega al bundle del cliente.
- `NEXT_PUBLIC_TMDB_TOKEN` — se incrusta en el bundle del cliente en build time. Visible en el browser.

**Situación actual:** `movieService.ts` es usado tanto desde `page.tsx` (servidor) como desde `useMovies` dentro de `MovieSection` (cliente). Esto significa que la API key necesita ser accesible en el cliente → necesita prefijo `NEXT_PUBLIC_`.

**Qué hacer:**
- Renombrar la variable en `.env.local` a `NEXT_PUBLIC_TMDB_TOKEN`
- Actualizar `config.ts` para usar `process.env.NEXT_PUBLIC_TMDB_TOKEN`
- Entender el tradeoff: la key queda expuesta en el browser (igual que en la app React con Vite)

---

### Paso 5 — `useMovies`: migrar URL navigation a Next.js

**Concepto Next.js:** `window.history.pushState` y `window.location` funcionan, pero bypassean el router de Next.js — las navegaciones no quedan en el historial del router, y hay problemas con SSR/hidratación.

**Hooks de Next.js a usar (todos de `next/navigation`):**
- `useSearchParams()` — lee los query params actuales (equivalente a `new URLSearchParams(window.location.search)`)
- `useRouter()` — para navegar. `router.push(url)` reemplaza `window.history.pushState`
- `usePathname()` — si necesitás la ruta actual sin los params

**Qué cambiar en `useMovies.ts`:**
- `readParamsFromURL()` → reemplazar con `useSearchParams()`
- `window.history.pushState(...)` → reemplazar con `router.push(...)`
- El listener `popstate` → ya no necesario, `useSearchParams` reactivamente refleja los cambios de URL
- Los valores iniciales de estado deben venir de `useSearchParams`, no de `window.location`

**Nota importante:** `useSearchParams` en Next.js requiere que el componente esté envuelto en `<Suspense>` si se usa en un Server Component padre. Como `MovieSection` ya es `'use client'`, esto se maneja automáticamente.

---

### Paso 6 — Limpieza de hooks obsoletos

**Concepto Next.js:** lo que antes hacías con `useEffect` + fetch en el cliente, ahora lo hace un Server Component con `async/await` directo. Los hooks `useTrendingMovie` y `useMovieDetails` existían para manejar ese ciclo de vida.

**Qué hacer:**
- Borrar `src/hooks/useTrendingMovie.ts` — reemplazado por `fetchTrendingMovies()` directo en `page.tsx`
- Borrar `src/hooks/useMovieDetails.ts` — reemplazado por `fetchMovieDetails()` directo en `page.tsx`
- Verificar que `page.tsx` hace correctamente: `fetchTrendingMovies()` → toma el primero → `fetchMovieDetails(id)`

**Por qué importa:** estos hooks son el patrón React de client-side data fetching. Entender que ya no son necesarios es clave para internalizar el modelo mental de Server Components.

---

## Qué NO cambia

- `useMovies.ts` se mantiene (filtros y paginación son interacción del cliente)
- `MovieSection.tsx` se mantiene como Client Component boundary
- `movieService.ts` se mantiene sin cambios estructurales
- Los componentes `Filters`, `ContentGrid`, `Pagination` no necesitan cambios de Next.js (son presentacionales)

---

## Criterio de éxito

La app corre con `npm run dev` sin errores de compilación ni warnings de Next.js, y:
- Hero muestra la película trending con poster cargado via `next/image`
- Los filtros y búsqueda actualizan la URL correctamente
- El botón atrás del browser restaura los filtros
- No hay doble Header ni doble Footer
