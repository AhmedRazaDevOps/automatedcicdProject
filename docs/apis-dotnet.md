# .NET REST API Implementation Plan

## 1. Overview & Technology Stack

The backend API component located in `apis/` is constructed with **.NET 8 / .NET 9 Web API**. It provides RESTful endpoints to both the Next.js user frontend and the Vue.js admin panel.

- **Framework**: .NET Web API
- **ORM**: Entity Framework Core (`Pomelo.EntityFrameworkCore.MySql`)
- **Authentication**: JWT (JSON Web Tokens) with ASP.NET Core Authentication Middleware
- **Documentation**: OpenAPI / Swagger (`Swashbuckle.AspNetCore`)
- **Testing**: xUnit + Moq / Integration Tests

---

## 2. Implementation Phases Roadmap

### Phase 1: Project Architecture & Setup
- Initialize `.NET Web API` project using `dotnet new webapi -n apis`.
- Configure `apis.csproj` with necessary NuGet dependencies:
  - `Pomelo.EntityFrameworkCore.MySql`
  - `Microsoft.EntityFrameworkCore.Design`
  - `Microsoft.AspNetCore.Authentication.JwtBearer`
  - `Swashbuckle.AspNetCore`
- Establish folder structure:
  - `/Controllers`: HTTP endpoints (e.g., `ProductsController`, `UsersController`, `AuthController`).
  - `/Models`: Entity classes (`Product.cs`, `User.cs`) and DTOs (`ProductCreateDto.cs`, `LoginDto.cs`).
  - `/Data`: `AppDbContext.cs` extending EF Core `DbContext`.
  - `/Services`: Business logic services and interfaces.

### Phase 2: Database Connectivity & EF Core Configuration
- Define connection string in `appsettings.json`:
  ```json
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=proj2_db;Uid=root;Pwd=rootpassword;"
  }
  ```
- Configure EF Core MySQL provider in `Program.cs`.
- Create domain entity models (`User`, `Product`, `Order`, `Category`).
- Generate initial migration: `dotnet ef migrations add InitialCreate`.
- Apply migrations or execute auto-migrations on application startup.

### Phase 3: REST API Endpoints Development
- Implement **Health Check Endpoint**: `/api/health` returning database status and server uptime.
- Implement **Authentication API**:
  - `POST /api/auth/register` - Register new user account.
  - `POST /api/auth/login` - Authenticate user & return JWT token.
- Implement **Products CRUD API**:
  - `GET /api/products` - List products with pagination & search filtering.
  - `GET /api/products/{id}` - Fetch single product details.
  - `POST /api/products` - Create new product (Admin authorization required).
  - `PUT /api/products/{id}` - Update product (Admin authorization required).
  - `DELETE /api/products/{id}` - Delete product (Admin authorization required).

### Phase 4: Middleware, CORS & Error Handling
- Configure **CORS Policy** in `Program.cs` to allow requests from Next.js (`http://localhost:3000`) and Vue Panel (`http://localhost:5173`).
- Implement global exception handler middleware for unified JSON error responses.
- Configure Swagger/OpenAPI UI with JWT bearer token input capabilities.

### Phase 5: Containerization & Verification
- Create `apis/Dockerfile` targeting multi-stage build (`mcr.microsoft.com/dotnet/sdk` and `aspnet`).
- Run integration tests and verify database persistence.
