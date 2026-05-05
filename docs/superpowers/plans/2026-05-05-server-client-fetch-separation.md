# Server/Client Fetch Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar el fetch duplicado de `genres` en el cliente pasándolo como parámetro a `useMovies`, de modo que genres solo se fetchee una vez en el server component.

**Architecture:** `page.tsx` (server component) ya fetchea `genres` y lo pasa a `MovieSection` como prop. `MovieSection` se lo pasa a `useMovies(genres)`. El hook elimina su propio `useEffect` de fetchGenres y usa el valor recibido directamente. Los fetches de `movies` permanecen en el cliente porque dependen de filtros interactivos.

**Tech Stack:** Next.js App Router, React hooks, TypeScript

---

### Task 1: Modificar `useMovies` para recibir genres como parámetro

**Files:**
- Modify: `src/hooks/useMovies.ts`

**Contexto:** Actualmente `useMovies` hace `fetchGenres()` dentro de un `useEffect` (líneas 29-35) y mantiene un estado `genres` interno. Esto duplica el fetch que ya hizo el server component. Vamos a eliminar eso y recibir genres como parámetro.

- [ ] **Step 1: Cambiar la firma del hook para aceptar genres**

Reemplazar la línea 6:
```ts
export default function useMovies() {
```
por:
```ts
export default function useMovies(genres: Record<number, string>) {
```

- [ ] **Step 2: Eliminar el estado interno de genres**

Eliminar la línea 16:
```ts
const [genres, setGenres] = useState<Record<number, string>>({});
```

- [ ] **Step 3: Eliminar el useEffect que fetchea genres**

Eliminar estas líneas (29-35):
```ts
useEffect(() => {
  fetchGenres()
    .then(g => {
      setGenres(g);
    })
    .catch(err => setError(err.message));
}, [currentPage, genreFilter, yearFilter, searchQuery]);
```

- [ ] **Step 4: Verificar que genres sigue en el return del hook**

El hook ya retorna `genres` en su objeto de retorno (línea 103 aprox). Ahora `genres` viene del parámetro en vez del estado. No hay que cambiar el return — `genres` sigue disponible con el mismo nombre.

- [ ] **Step 5: Eliminar el import de fetchGenres si quedó sin usar**

En la línea 2, `fetchGenres` ya no se usa en el hook. Cambiar:
```ts
import { fetchMovies, fetchGenres } from '../movieService';
```
por:
```ts
import { fetchMovies } from '../movieService';
```

- [ ] **Step 6: Verificar que TypeScript no tiene errores**

```bash
cd /home/jimena-cardozo/documents/NextTraining/movie-list-app
npx tsc --noEmit
```
Expected: sin errores (o solo errores pre-existentes).

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useMovies.ts
git commit -m "refactor: useMovies recibe genres como parámetro en vez de fetchearlos"
```

---

### Task 2: Actualizar `MovieSection` para pasar genres al hook

**Files:**
- Modify: `src/components/MovieSection.tsx`

**Contexto:** `MovieSection` ya recibe `genres` como prop desde `page.tsx`. Solo hay que pasárselo a `useMovies`.

- [ ] **Step 1: Pasar genres al hook**

En [MovieSection.tsx:12](src/components/MovieSection.tsx#L12), cambiar:
```ts
const { movies, error, currentPage, totalPages, genreFilter, yearFilter,
        searchInput, handleGenreChange, handleYearChange,
        setSearchQueryDebounced, setCurrentPage } = useMovies();
```
por:
```ts
const { movies, error, currentPage, totalPages, genreFilter, yearFilter,
        searchInput, handleGenreChange, handleYearChange,
        setSearchQueryDebounced, setCurrentPage } = useMovies(genres);
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```
Expected: sin errores.

- [ ] **Step 3: Verificar en el browser que la app funciona igual**

Correr el dev server:
```bash
npm run dev
```
Verificar:
- Los géneros aparecen en el filtro de `Filters`
- Filtrar por género muestra las películas correctas
- Filtrar por año funciona
- La búsqueda por texto funciona
- La paginación funciona
- No hay errores en la consola del browser

- [ ] **Step 4: Commit**

```bash
git add src/components/MovieSection.tsx
git commit -m "refactor: pasar genres como prop a useMovies, eliminando fetch duplicado del cliente"
```

---

## Resultado final

Después de estos dos tasks:

- `genres` se fetchea **una sola vez**, en el servidor, antes de que la página llegue al browser.
- `useMovies` es responsable **solo** de los datos que dependen de interacción del usuario (movies con filtros).
- No hay cambios en `page.tsx`, `Filters`, `ContentGrid`, `Hero` ni `movieService`.
- El comportamiento visible para el usuario es **idéntico** — solo mejoró la arquitectura.
