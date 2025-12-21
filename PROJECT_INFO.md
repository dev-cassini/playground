# Nx Angular Monorepo - Multi-App Project

This is an Nx Angular monorepo containing two independent applications: **sign-up** and **portal**.

## Project Structure

```
nx-multi-app/
├── apps/
│   ├── sign-up/              # Sign-up application
│   │   ├── src/
│   │   │   ├── app/          # App components
│   │   │   │   ├── app.ts
│   │   │   │   ├── app.html
│   │   │   │   ├── app.css
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── app.routes.ts
│   │   │   │   └── nx-welcome.ts
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   └── styles.css
│   │   └── project.json
│   │
│   ├── sign-up-e2e/          # E2E tests for sign-up
│   │   └── src/
│   │
│   ├── portal/               # Portal application
│   │   ├── src/
│   │   │   ├── app/          # App components
│   │   │   │   ├── app.ts
│   │   │   │   ├── app.html
│   │   │   │   ├── app.css
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── app.routes.ts
│   │   │   │   └── nx-welcome.ts
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   └── styles.css
│   │   └── project.json
│   │
│   └── portal-e2e/           # E2E tests for portal
│       └── src/
│
├── node_modules/
├── package.json
├── nx.json
└── tsconfig.base.json
```

## Applications

### 1. Sign-up App
- **Name:** sign-up
- **Type:** Angular Standalone Application
- **Features:**
  - Routing enabled
  - CSS styling
  - Jest for unit testing
  - Playwright for E2E testing
  - SSR enabled (Server-Side Rendering)

### 2. Portal App
- **Name:** portal
- **Type:** Angular Standalone Application
- **Features:**
  - Routing enabled
  - CSS styling
  - Jest for unit testing
  - Playwright for E2E testing
  - esbuild bundler

## Available Commands

### Development Servers

Run the **sign-up** app:
```bash
npx nx serve sign-up
```

Run the **portal** app:
```bash
npx nx serve portal
```

### Build Applications

Build the **sign-up** app:
```bash
npx nx build sign-up
```

Build the **portal** app:
```bash
npx nx build portal
```

### Run Tests

Run unit tests for **sign-up**:
```bash
npx nx test sign-up
```

Run unit tests for **portal**:
```bash
npx nx test portal
```

Run E2E tests for **sign-up**:
```bash
npx nx e2e sign-up-e2e
```

Run E2E tests for **portal**:
```bash
npx nx e2e portal-e2e
```

### Lint Applications

Lint the **sign-up** app:
```bash
npx nx lint sign-up
```

Lint the **portal** app:
```bash
npx nx lint portal
```

### View Project Information

View all projects:
```bash
npx nx show projects
```

View details about a specific project:
```bash
npx nx show project sign-up
npx nx show project portal
```

### Run Multiple Commands

Build both apps:
```bash
npx nx run-many --target=build --all
```

Test both apps:
```bash
npx nx run-many --target=test --all
```

## Technology Stack

- **Framework:** Angular (latest version)
- **Build Tool:** Nx
- **Bundler:** esbuild (portal), webpack (sign-up with SSR)
- **Testing:** Jest (unit tests), Playwright (E2E tests)
- **Styling:** CSS
- **Package Manager:** npm

## Getting Started

1. Navigate to the project directory:
   ```bash
   cd nx-multi-app
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start developing either app:
   ```bash
   npx nx serve sign-up
   # or
   npx nx serve portal
   ```

4. Open your browser and navigate to:
   - Sign-up app: http://localhost:4200
   - Portal app: http://localhost:4200 (when running portal)

## Notes

- Both applications are independent and can be developed, built, and deployed separately
- The monorepo structure allows for code sharing between apps if needed in the future
- Each app has its own E2E test suite
- The sign-up app includes SSR capabilities, while the portal app uses a simpler client-side setup
