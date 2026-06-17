# Mini Product Store

A single-page product store where users browse products, search and filter, log in, and manage a personal, per-user favorites list. Built as a frontend take-home — the focus is production-quality structure, type safety, and state separation rather than feature count.

## Running locally

```bash
npm install
npm run dev
```

No environment variables are required — the app talks to the public DummyJSON API directly.

Run the tests with:

```bash
npm test
```

Test credentials — `username: emilys` / `password: emilyspass`

## Stack

React 18 + Vite, TypeScript (strict), Tailwind CSS, React Router v6, Axios, TanStack Query, Zustand, React Hook Form + Zod, React Hot Toast. All of the preferred stack — nothing swapped out. Tests use Vitest + React Testing Library.

## Architecture: how state is split (the key decision)

The core rule is a strict separation between **server state** and **client state**:

- **TanStack Query** owns everything that comes from the API — products, categories, search results, product detail, profile. It handles caching, loading/error states, and retries.
- **Zustand** owns the three things with no server equivalent — the auth session (tokens), favorites, and theme. Stores stay small and never duplicate server data.
- **Axios** is a single configured instance (`api/client.ts`) with request/response interceptors. Components never call axios directly — everything goes through `api/*.api.ts`.

This keeps logout clean: clearing the query cache on logout guarantees one user's cached data never leaks into the next session on the same device.

## Auth & 401 handling

On load the app reads the persisted access token, calls `/auth/me` to verify and restore the session, and only then marks itself initialized (so guards don't flash). Only the tokens are persisted — the user object is re-fetched.

The Axios response interceptor handles `401` with a **silent refresh**: it calls `/auth/refresh` once, swaps in the new token, and replays the original request. If refresh also fails (or the failing call was the auth flow itself), it logs out, clears the cache, shows a toast, and redirects to `/login` via the exported router singleton (not a hook, so it works outside React).

The one exception is the background session-restore call: it's flagged (`_skipAuthRedirect`) so that an expired token on load fails quietly and the auth store cleans up — a returning user with a stale token is *not* bounced off a public page or shown a toast. Interactive 401s still redirect normally.

## Favorites

Stored as `Record<userId, productId[]>`, persisted to localStorage, so they survive reloads and stay scoped per user — user A's favorites never show for user B on the same device. Toggle from both the product list (heart on each card) and the detail page. Logout clears the current user's favorites (per the brief's cleanup requirement).

## Theming

Light/dark toggle driven entirely by CSS variable tokens (`index.css`) under a `dark` class on `<html>`. No colors are hardcoded in components — they all reference tokens, so both themes (and accent contrast) are config-driven. The choice is persisted and applied in `main.tsx` before first render to avoid a flash.

## Automated tests

`npm test` runs the suite (Vitest + React Testing Library, jsdom). It covers the three highest-value targets called out in the brief:

| Suite | What it verifies |
|-------|------------------|
| `src/store/auth.store.test.ts` | `login` stores tokens + user; `logout` clears auth, the user's favorites, and the query cache; `restoreSession` for the no-token / valid-token / bad-token paths |
| `src/router/guards.test.tsx` | `ProtectedRoute` redirects guests to `/login`, renders content when authed, and renders nothing pre-init (no flash); `GuestRoute` redirects authed users away from `/login` |
| `src/api/client.test.ts` | the 401 interceptor — logout + redirect when there's no refresh token, **silent refresh + replay** of the original request, logout when refresh also fails, and no retry loop |

14 tests in total. Test files live next to the code they cover (`*.test.ts(x)`).

## Testing the empty & error states (manually)

Every data-fetching view renders three states — loading, error (with retry), and empty. The empty and error states can be triggered manually without any tooling:

**Empty state** (`EmptyState`, shown on the product list / favorites when a query returns no results):

- Search for gibberish in the navbar, e.g. `zzzzzzzz`, or open `/?search=zzzzzzzz` directly. DummyJSON returns an empty array → "Nothing here yet."

**Error state** (`ErrorState`, shown on the product list, product detail, categories, and profile pages):

- **Invalid product (real 404):** open `/product/999999` — DummyJSON responds 404, so the detail page shows the error with a working "Try again" button. `/product/abc` shows it too (id is `NaN`, the query is disabled and no product resolves).
- **Network failure (any page):** in DevTools → Network, set throttling to **Offline**, then reload or refetch. The request fails and the error state appears. Switch back to **No throttling** and click **Try again** to confirm recovery. Note: TanStack Query retries a failed query 3× before flipping to `isError`, so the error takes a moment to show while offline.
- **Profile page:** log in first (the profile query is gated on auth), then go offline and reload `/profile`.

---

## Self-Assessment & Completed Work

### Core requirements

- [x] Public + protected routes
- [x] Redirect to login when not authenticated
- [x] Redirect back to the originally requested page after login
- [x] Logged-in user redirected away from `/login`
- [x] Login + inline validation + error on bad credentials
- [x] Session persists across refresh (restored via token + `/auth/me`)
- [x] Working logout with state cleanup (auth + favorites + query cache)
- [x] Single configured HTTP client with auto token injection
- [x] 401 response handling (clear session → cleanup → redirect to login)
- [x] Product list with debounced search (400ms)
- [x] Category filter
- [x] Pagination (limit/skip)
- [x] Product detail page
- [x] Add/remove favorites (from list + detail)
- [x] Favorites persist and are scoped per user
- [x] Dark / light mode toggle via config (not hardcoded), persisted
- [x] Loading / error / empty states everywhere data is fetched

### Bonus items attempted

| Bonus item | Done | Where / how to test |
|------------|------|---------------------|
| Silent token refresh | Yes | `src/api/client.ts` — 401 interceptor calls `/auth/refresh` once and replays the request before falling back to logout |
| URL-synced state | Yes | `src/pages/ProductsPage.tsx` + `Navbar` — `?search=&category=&page=` in the URL; e.g. open `/?search=phone&page=2` and reload |
| Toasts / notifications | Yes | `src/App.tsx` (themed `Toaster`) + calls in `FavoriteButton`, `LoginPage`, and `client.ts` (added to favorites, login failed, session expired) |
| Error Boundary | Yes | Top-level `src/components/common/ErrorBoundary.tsx` (wraps the app in `App.tsx`) **and** a route-level `errorElement` (`src/router/RouteErrorBoundary.tsx`) — both render the shared themed `ErrorFallback`. Test: comment out an import in any page to throw |
| Form quality (schema validation) | Yes | `src/pages/LoginPage.tsx` — React Hook Form + Zod, inline errors, disabled-while-submitting, button loading state |
| Session expiry UX | Partial | On 401 the user gets a toast ("session expired") before the redirect, rather than a silent bounce |
| Accessibility touches | Partial | `aria-label`/`aria-pressed` on favorite + icon buttons, `role="status"` on the spinner, `aria-current` on breadcrumb/active links |
| Tests (Vitest + RTL) | Yes | `npm test` — 14 tests across 3 suites: the auth store (`src/store/auth.store.test.ts`), the route guards (`src/router/guards.test.tsx`), and the 401 interceptor incl. silent refresh (`src/api/client.test.ts`) |

**Not attempted:** cart, optimistic UI, code-splitting/virtualization, request cancellation (AbortController), skeleton loaders, `prefers-color-scheme` default.

### Extra (not in the spec)

- Dynamic per-page document titles (`Blostem | …`) via a `useDocumentTitle` hook.
- Branded favicon + `theme-color`.
- Reusable `Breadcrumb`, `StarRating`, and `CustomerReviews` components.
- Dark-mode contrast tuning so accent/secondary text stays legible (tokens brightened in the `.dark` block).

---

## Project structure

```
src/
├── api/                  # Axios instance + interceptors, auth.api, product.api
├── components/
│   ├── common/           # Button, Input, Spinner, ErrorState, EmptyState, ErrorBoundary,
│   │                     #   ErrorFallback, Breadcrumb, StarRating, Pagination, ThemeToggle
│   ├── layout/           # Navbar, MainLayout, Footer
│   └── product/          # ProductCard, FavoriteButton, CustomerReviews
├── pages/                # Login, Products, ProductDetail, Favorites, Profile, Categories
├── queries/              # useProducts, useSearchProducts, useProduct, useProfile, useCategories
├── router/               # AppRouter (router singleton), ProtectedRoute, GuestRoute, RouteErrorBoundary
├── store/                # auth.store, favorites.store, theme.store
├── hooks/                # useDebounce, useDocumentTitle
├── types/                # auth, product, category, api
├── lib/                  # constants, queryClient, theme
├── test/                 # Vitest setup (jest-dom matchers, cleanup)
└── App.tsx / main.tsx    # providers + session restore; theme init before first render

# Tests sit beside the code: auth.store.test.ts, router/guards.test.tsx, api/client.test.ts
```

## What I'd improve with more time

- Broaden test coverage to the data-fetching hooks and key page flows (the current suites cover the auth store, route guards, and 401 interceptor).
- Skeleton loaders in place of spinners, and request cancellation (AbortController) on search.
- Optimistic favorite toggles and `prefers-color-scheme` as the first-visit default.

### Knowingly left out

- **Search + category aren't combined.** Starting a search navigates to `/?search=…` and clears any active category filter (search is treated as a global override). The list stays URL-driven and bookmarkable, but a combined `?search=&category=` query isn't supported. Lifting the search input's state out of the Navbar and into the URL would be the clean fix.

## Trade-offs & assumptions

- **Favorites cleared on logout:** the brief asks logout to clear user-specific data, so the current user's favorites are cleared. Because favorites are keyed by `userId`, cross-user leakage is already impossible; if persistence across logout were preferred, removing the `clearUserFavorites` call in `auth.store` would achieve it.
- **Two `/auth/me` shapes:** session restore uses a minimal `User`; the profile page uses a richer `ProfileUser` — both hit the same endpoint, typed separately to keep the auth store lean.
