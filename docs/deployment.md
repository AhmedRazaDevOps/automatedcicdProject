# Deployment Guide — End-to-End Production on AWS Free Tier

> Real-world enterprise CI/CD: Docker → GitHub Actions → Docker Hub → EC2, **automated on every push**.

---

## Architecture Overview

```
Developer Push
     │
     ▼
GitHub (main branch)
     │
     ├── Pull Request Created → PR Checks run (build + test)
     ├── PR Merged to main → CI/CD Pipeline triggers
     │
     ▼
GitHub Actions Workflow
     ├── 1. Build Docker images (api, frontend, panel)
     ├── 2. Run tests
     ├── 3. Push images to Docker Hub
     └── 4. SSH into EC2 → pull latest images → zero-downtime restart
          │
          ▼
     AWS EC2 t2.micro (Free Tier)
          ├── Docker + Docker Compose installed
          ├── Containers: api → :5005, frontend → :3000, panel → :5173, mysql → :3306
          └── Nginx Reverse Proxy → port 80 (public)
```

---

## Phase 1 — Docker Containerization

All services already have Dockerfiles. Verify with:

```bash
# From project root
docker-compose up --build
```

### Required Dockerfiles

Each service must have a multi-stage production Dockerfile:

#### `apis/Dockerfile` (.NET 8 Web API)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5005

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["apis.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "apis.dll"]
```

#### `frontend/Dockerfile` (Next.js)
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

#### `panel/Dockerfile` (Vue 3 + Vite)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Phase 2 — Docker Hub Setup

### Step 1 — Create Docker Hub Account
1. Sign up free at [hub.docker.com](https://hub.docker.com)
2. Create repositories:
   - `yourusername/proj2-api`
   - `yourusername/proj2-frontend`
   - `yourusername/proj2-panel`

### Step 2 — Add GitHub Repository Secrets

Go to **GitHub Repo → Settings → Secrets and Variables → Actions** and add:

| Secret Name | Value |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub access token (not password) |
| `EC2_HOST` | Your EC2 public IP address |
| `EC2_USER` | `ubuntu` (default for Ubuntu AMI) |
| `EC2_SSH_KEY` | Your EC2 `.pem` private key contents |

> **How to create Docker Hub access token:** Docker Hub → Account Settings → Security → New Access Token

---

## Phase 3 — GitHub Branch Protection Rules (PR Policy)

Real companies protect `main` with these rules. Go to:
**GitHub Repo → Settings → Branches → Add Branch Protection Rule**

Set these required rules for `main`:
- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Require status checks to pass before merging
  - Add: `build-and-test` (from your workflow)
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

This means: **no direct pushes to `main`** — everything must go through a PR.

---

## Phase 4 — GitHub Actions CI/CD Workflow

Create this file at `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline — Build, Push & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
  IMAGE_API: ${{ secrets.DOCKER_USERNAME }}/proj2-api
  IMAGE_FRONTEND: ${{ secrets.DOCKER_USERNAME }}/proj2-frontend
  IMAGE_PANEL: ${{ secrets.DOCKER_USERNAME }}/proj2-panel

jobs:
  # ─────────────────────────────────────────────────
  # JOB 1: Build & Test (runs on all PRs and pushes)
  # ─────────────────────────────────────────────────
  build-and-test:
    name: Build & Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET 8
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Restore & Build .NET API
        run: |
          cd apis
          dotnet restore
          dotnet build --no-restore -c Release

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install & Build Next.js
        run: |
          cd frontend
          npm ci
          npm run build

      - name: Install & Build Vue 3 Panel
        run: |
          cd panel
          npm ci
          npm run build

  # ─────────────────────────────────────────────────
  # JOB 2: Push Docker Images (only on main merge)
  # ─────────────────────────────────────────────────
  docker-push:
    name: Push Docker Images to Hub
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build & Push API image
        uses: docker/build-push-action@v5
        with:
          context: ./apis
          push: true
          tags: |
            ${{ env.IMAGE_API }}:latest
            ${{ env.IMAGE_API }}:${{ github.sha }}

      - name: Build & Push Frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ env.IMAGE_FRONTEND }}:latest
            ${{ env.IMAGE_FRONTEND }}:${{ github.sha }}

      - name: Build & Push Panel image
        uses: docker/build-push-action@v5
        with:
          context: ./panel
          push: true
          tags: |
            ${{ env.IMAGE_PANEL }}:latest
            ${{ env.IMAGE_PANEL }}:${{ github.sha }}

  # ─────────────────────────────────────────────────
  # JOB 3: Zero-Downtime Deploy to EC2
  # ─────────────────────────────────────────────────
  deploy-ec2:
    name: Deploy to EC2 (Zero-Downtime)
    runs-on: ubuntu-latest
    needs: docker-push
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4

      - name: Copy docker-compose.prod.yml to EC2
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: "docker-compose.prod.yml"
          target: "~/proj2"

      - name: Deploy on EC2 (rolling restart — zero downtime)
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/proj2
            echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d --no-deps --remove-orphans
            docker image prune -f
            echo "✅ Deployment complete: $(date)"
```

---

## Phase 5 — AWS EC2 Free Tier Setup

### Step 1 — Launch EC2 Instance
1. Go to [AWS Console](https://console.aws.amazon.com) → EC2 → Launch Instance
2. Settings:
   - **AMI**: Ubuntu Server 22.04 LTS (free tier eligible)
   - **Instance type**: `t2.micro` (free tier: 750 hrs/month)
   - **Storage**: 30 GB gp2 (free tier limit)
   - **Key pair**: Create and download `.pem` file — **keep this safe**
3. In **Security Group**, open these ports:
   - **22** (SSH) — from your IP only
   - **80** (HTTP) — from anywhere `0.0.0.0/0`
   - **443** (HTTPS) — from anywhere
   - **5005** (API) — optional for direct access

### Step 2 — Install Docker on EC2

SSH into your instance and run:
```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt-get install -y docker-compose-plugin
docker compose version
```

### Step 3 — Create Production docker-compose on EC2

Create `~/proj2/docker-compose.prod.yml`:

```yaml
services:
  database:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: proj2_db
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 5

  api:
    image: yourusername/proj2-api:latest
    restart: always
    ports:
      - "5005:5005"
    environment:
      ConnectionStrings__DefaultConnection: "Server=database;Port=3306;Database=proj2_db;Uid=root;Pwd=${MYSQL_ROOT_PASSWORD:-rootpassword};"
    depends_on:
      database:
        condition: service_healthy

  frontend:
    image: yourusername/proj2-frontend:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://YOUR_EC2_PUBLIC_IP:5005/api

  panel:
    image: yourusername/proj2-panel:latest
    restart: always
    ports:
      - "5173:80"

volumes:
  mysql_data:
```

### Step 4 — Nginx Reverse Proxy (Professional Setup)

Install Nginx to expose everything on port 80:
```bash
sudo apt install -y nginx

# /etc/nginx/sites-available/proj2
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    location /api/ {
        proxy_pass http://localhost:5005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin {
        proxy_pass http://localhost:5173;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/proj2 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Phase 6 — Zero-Downtime Strategy

The deploy script uses `docker-compose up -d --no-deps` which:
1. Pulls latest images in the background
2. Stops the old container
3. Starts the new container
4. There is only a **~1-3 second restart gap** (acceptable for free tier)

For true zero-downtime on free tier, use this pattern in deploy:
```bash
# Pull new image while old is still running
docker-compose pull api
# Restart only the api service (not the whole stack)
docker-compose up -d --no-deps api
# Clean up old images
docker image prune -f
```

---

## Phase 7 — Complete Working Flow

```
You write code on feature branch
      │
      ▼
git push origin feature/my-feature
      │
      ▼
Open PR on GitHub
      │
      ├── GitHub Actions: build-and-test job runs automatically
      ├── All checks must pass ✅
      ├── 1 approval required ✅
      └── PR can now be merged
            │
            ▼
      Merge to main
            │
            ▼
      GitHub Actions triggers full pipeline:
      1. build-and-test       (~3–5 min)
      2. docker-push          (~5–8 min) → images on Docker Hub
      3. deploy-ec2           (~1–2 min) → EC2 pulls & restarts
            │
            ▼
      Live on EC2 (http://YOUR_EC2_IP)
      Total time: ~10–15 minutes from merge to live
```

---

## What You Need (Checklist)

- [ ] Docker Hub account (free) — [hub.docker.com](https://hub.docker.com)
- [ ] AWS account (free tier) — [aws.amazon.com/free](https://aws.amazon.com/free)
- [ ] GitHub repository with code pushed
- [ ] `.pem` key file for EC2 SSH
- [ ] GitHub Secrets added (see Phase 2, Step 2)
- [ ] Replace `yourusername` in all compose files with your Docker Hub username
- [ ] Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 IP

---

## Cost on AWS Free Tier

| Resource | Free Tier Allowance | Usage |
|---|---|---|
| EC2 t2.micro | 750 hrs/month (~31 days) | 1 instance = free |
| EBS Storage | 30 GB/month | ~10 GB used = free |
| Data Transfer | 100 GB/month outbound | Well within limit |
| Elastic IP | 1 free if instance running | Recommended: use 1 |

> **Note**: Free tier is for 12 months from account creation. After that, t2.micro costs ~$8.50/month.
