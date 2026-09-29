# Monorepo Project

A modern, high-performance monorepo architecture combining a **.NET REST API** backend, a **Next.js** user web application, a **Vue 3** control panel, and containerized **MySQL** database.

---

## 📁 Repository Structure

```text
proj2/
├── docs/             # Implementation Phase Documentation
│   ├── overview.md       # High-level architecture & multi-phase roadmap
│   ├── apis-dotnet.md    # .NET REST API technical specs & phases
│   ├── frontend-nextjs.md# Next.js user web app technical specs & phases
│   ├── panel-vuejs.md    # Vue 3 control panel specs & phases
│   └── database-mysql.md # MySQL database schema & Docker specs
├── apis/             # .NET Web API REST Application (Port 5000)
├── frontend/         # Next.js User Web App (Port 3000)
├── panel/            # Vue 3 Admin Control Panel (Port 5173)
├── database/         # MySQL database initialization scripts
├── docker-compose.yml# Container orchestration
└── README.md         # Project documentation & instructions
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [.NET SDK 8.0+](https://dotnet.microsoft.com/)
- [Node.js 18+ & npm](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/)

---

### Running via Docker Compose

To spin up the entire monorepo stack (MySQL + .NET API + Next.js + Vue Panel) in one command:

```bash
docker-compose up --build
```

Access services at:
- **Next.js Web App**: `http://localhost:3000`
- **Vue 3 Admin Panel**: `http://localhost:5173`
- **.NET REST API / Swagger**: `http://localhost:5000/swagger`
- **MySQL Database**: `localhost:3306` (`Database: proj2_db`, `User: root`, `Password: rootpassword`)

---

### Running Applications Individually

#### 1. Database Setup
Ensure MySQL is running locally or via Docker:
```bash
docker-compose up database -d
```

#### 2. .NET REST API (`apis/`)
```bash
cd apis
dotnet restore
dotnet run
```

#### 3. Next.js Web App (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```

#### 4. Vue 3 Control Panel (`panel/`)
```bash
cd panel
npm install
npm run dev
```

---

## 📖 Phase Documentation

For detailed phase-by-phase implementation plans, see the `docs/` folder:
- [`docs/overview.md`](docs/overview.md)
- [`docs/apis-dotnet.md`](docs/apis-dotnet.md)
- [`docs/frontend-nextjs.md`](docs/frontend-nextjs.md)
- [`docs/panel-vuejs.md`](docs/panel-vuejs.md)
- [`docs/database-mysql.md`](docs/database-mysql.md)
