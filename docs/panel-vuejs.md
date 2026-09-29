# Vue 3 Admin Panel Implementation Plan

## 1. Overview & Technology Stack

The administration control panel located in `panel/` is built using **Vue 3** powered by **Vite**. It provides a reactive interface for administrators to manage system data, view metrics, and execute CRUD operations against the .NET backend API.

- **Framework**: Vue 3 (Composition API `<script setup>`)
- **Build Tool**: Vite
- **Router**: Vue Router 4
- **State Management**: Pinia
- **HTTP Client**: Axios / native fetch wrapper
- **Styling**: Modern CSS / Flexbox / Grid

---

## 2. Implementation Phases Roadmap

### Phase 1: Project Setup & Structure
- Initialize Vue 3 + Vite project in `panel/`.
- Setup configuration (`package.json`, `vite.config.js`, `index.html`).
- Directory structure:
  - `/src/views`: Top-level page views (`Dashboard.vue`, `ProductsView.vue`, `LoginView.vue`).
  - `/src/components`: UI components (`Navbar.vue`, `Sidebar.vue`, `DataTable.vue`, `Modal.vue`).
  - `/src/router`: Vue Router configuration with auth route guards.
  - `/src/stores`: Pinia state management modules (`authStore.js`, `productStore.js`).
  - `/src/services`: API client connecting to .NET REST API endpoints.

### Phase 2: Shell Layout & UI Design System
- Build admin shell featuring responsive side navigation, header bar, user profile dropdown, and breadcrumbs.
- Design sleek metric cards (Total Products, Active Users, System Status).

### Phase 3: Dynamic Data Views & Admin Workflows
- **Admin Dashboard (`/`)**: High-level key performance metrics, quick actions, and backend health status widget.
- **Product Management (`/products`)**:
  - Reactive data table with search, sorting, and pagination.
  - Add Product modal dialog posting to `POST /api/products`.
  - Edit Product modal dialog updating via `PUT /api/products/{id}`.
  - Delete confirmation modal calling `DELETE /api/products/{id}`.
- **System Settings & Health (`/settings`)**: Monitor .NET backend API and MySQL database connection status.

### Phase 4: Authentication & Security Guards
- Implement route guard (`router.beforeEach`) checking JWT auth token validity before entering protected admin routes.
- Automatic logout handling upon token expiration (401 Unauthorized response from .NET API).

### Phase 5: Containerization & Verification
- Test build using `npm run build`.
- Create `panel/Dockerfile` serving built static files via Nginx/Vite for Docker Compose.
