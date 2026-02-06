# 🎮 Command Reference

## Essential Commands

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173

# Build for production
npm run build
# → Creates optimized build in dist/

# Preview production build locally
npm run preview
# → Opens at http://localhost:4173

# Run linter
npm run lint
```

### Port Management

```bash
# Use different port (if 5173 is busy)
npm run dev -- --port 3000

# Use specific host
npm run dev -- --host

# Open browser automatically
npm run dev -- --open
```

### Project Structure

```bash
# View project structure
tree -L 3 -I 'node_modules|dist'

# Count lines of code
find src -name '*.ts' -o -name '*.tsx' | xargs wc -l

# List all components
ls -la src/components/*/
```

### Git Commands (wenn Repository initialisiert)

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "feat: Initial MVP - 3 Lektionen mit Quiz System"

# Add remote
git remote add origin <your-repo-url>

# Push to main
git push -u origin main
```

### Deployment

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Package Management

```bash
# Update all packages
npm update

# Check for outdated packages
npm outdated

# Clean install (if issues)
rm -rf node_modules package-lock.json
npm install

# Audit security
npm audit

# Fix security issues
npm audit fix
```

### Development Helpers

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear all caches
npm run build -- --force

# Check TypeScript errors
npx tsc --noEmit

# Format code (if prettier installed)
npx prettier --write "src/**/*.{ts,tsx}"
```

### Testing (wenn Tests implementiert)

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Content Management

```bash
# Add new lesson
# Edit: src/data/lessons.ts

# Add new quiz
# Edit: src/data/quizzes.ts

# Update types
# Edit: src/types/index.ts
```

### Debugging

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Verbose build output
npm run build -- --debug

# Show Vite config
npx vite --help

# Check bundle size
npm run build && ls -lh dist/assets/
```

### Environment Setup

```bash
# Create .env.local (if needed)
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Load environment variables
source .env.local
```

### Performance Analysis

```bash
# Analyze bundle
npm run build -- --report

# Check bundle size
du -sh dist/

# Gzipped size
gzip -c dist/assets/*.js | wc -c
```

### Maintenance

```bash
# Clean everything
rm -rf node_modules dist .vite

# Fresh install
npm install

# Rebuild
npm run build
```

## Quick Commands

```bash
# Quick start (from scratch)
npm install && npm run dev

# Quick deploy to Vercel
vercel

# Quick build & preview
npm run build && npm run preview

# Quick reset
rm -rf node_modules package-lock.json && npm install
```

## Shortcuts

```bash
# Alias for dev server
alias dev="npm run dev"

# Alias for build
alias build="npm run build"

# Alias for preview
alias preview="npm run preview"

# Add to ~/.zshrc or ~/.bashrc
```

## Documentation Commands

```bash
# View README
cat README.md

# View Quickstart
cat QUICKSTART.md

# View all docs
ls -la *.md

# Search in docs
grep -r "keyword" *.md
```

## File Operations

```bash
# Find all TypeScript files
find src -name "*.ts" -o -name "*.tsx"

# Find all Components
find src/components -type f

# Count total files
find src -type f | wc -l

# Show file sizes
du -sh src/*
```

## Troubleshooting Commands

```bash
# Node version
node --version

# npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall everything
rm -rf node_modules package-lock.json
npm install

# Check for peer dependency issues
npm ls

# Verbose error output
npm run dev --verbose
```

## Useful npm Scripts (Custom)

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "clean": "rm -rf dist node_modules/.vite",
    "fresh": "npm run clean && npm install",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod"
  }
}
```

Then use:
```bash
npm run clean
npm run fresh
npm run deploy:vercel
npm run deploy:netlify
```

---

**Tip**: Press `Ctrl+C` to stop the development server.

**Note**: All commands assume you're in the project root directory.
