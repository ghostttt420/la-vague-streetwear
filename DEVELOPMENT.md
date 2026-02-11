# LA VAGUE - Development Guide

Professional development workflow for the LA VAGUE e-commerce platform.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (check with `node --version`)
- **npm** 9+ (comes with Node.js)

### Installation

```bash
# Navigate to project
cd "la vague"

# Install all dependencies
npm install

# Set up git hooks
npm run prepare
```

---

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start full dev environment (frontend + backend) |
| `npm run dev:client` | Start Vite dev server only (frontend) |
| `npm run dev:server` | Start Node.js backend only |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

---

## 🔄 Development Workflow

### 1. Start Development

```bash
# Option A: Start everything (recommended)
npm run dev

# Option B: Start separately (if you need different ports)
npm run dev:server  # Terminal 1 - Backend on :3001
npm run dev:client  # Terminal 2 - Frontend on :3000
```

### 2. Make Changes

- Edit HTML, CSS, or JS files as normal
- **Hot Module Replacement** automatically refreshes the browser
- Backend API requests are proxied automatically

### 3. Before Committing

Git hooks automatically run on commit:
- ✅ ESLint checks code quality
- ✅ Prettier formats your code

```bash
git add .
git commit -m "Your message"
# Hooks run automatically!
```

---

## 📁 Project Structure

```
la vague/
├── 📄 HTML Files (root)       # index.html, shop.html, etc.
├── 🎨 CSS Files (root)        # styles.css, home-styles.css, etc.
├── ⚡ JS Files (root)          # cart.js, shop.js, products.js, etc.
├── 🖥️ server.js               # Backend API
├── ⚙️ Configuration Files
│   ├── vite.config.js         # Vite build configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── eslint.config.js       # ESLint rules
│   ├── .prettierrc            # Prettier formatting
│   └── package.json           # Dependencies & scripts
├── 📝 src/                    # Source for gradual migration
│   ├── types/                 # TypeScript type definitions
│   ├── js/                    # New TypeScript modules (future)
│   ├── css/                   # Organized styles (future)
│   └── assets/                # Images, fonts, etc.
└── 📦 dist/                   # Production build output
```

---

## 🧪 Gradual TypeScript Migration

Your existing JavaScript files **continue to work exactly as before**. TypeScript is opt-in.

### To use TypeScript for new files:

1. Create a `.ts` file instead of `.js`
2. Import types from `src/types/`
3. Vite handles compilation automatically

### To migrate existing files:

1. Rename `.js` to `.ts`
2. Add type annotations gradually
3. Fix any type errors that appear

### Example:

```typescript
// src/js/utils.ts - New TypeScript file
import type { Product, CartItem } from '../types';

export function calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
```

---

## 🎨 Code Quality Tools

### ESLint (Linting)

Checks for:
- Syntax errors
- Unused variables
- Code style consistency
- Best practices

```bash
# Check all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Prettier (Formatting)

Formats:
- JavaScript / TypeScript
- HTML
- CSS
- JSON
- Markdown

```bash
# Format all files
npm run format

# Check formatting (CI use)
npm run format:check
```

---

## 🐛 Debugging

### Frontend (Vite)

1. Open browser DevTools (F12)
2. Source maps are enabled - you'll see original files
3. Set breakpoints in your JS files
4. Hot reload preserves state where possible

### Backend (Node.js)

```bash
# Debug mode
node --inspect server.js

# Or use nodemon
npm run dev:server
```

---

## 📦 Building for Production

```bash
# Create optimized build
npm run build

# Preview the build locally
npm run preview

# Output is in `dist/` folder
```

### Build Features:
- ✅ JavaScript/CSS minification
- ✅ Tree shaking (removes unused code)
- ✅ Asset optimization
- ✅ Source maps for debugging
- ✅ Multi-page support

---

## 🔧 Environment Variables

### Frontend (Vite)

Create `.env` file:

```bash
VITE_API_URL=http://localhost:3001
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Backend (Node.js)

Uses existing `.env` file (see `.env.example`)

---

## 🚦 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev:client -- --port 3002
```

### Git hooks not running

```bash
# Reinstall hooks
npm run prepare
```

### Dependencies issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors in JS files

If you see type errors in `.js` files, they're informational only. The build will still succeed.

To suppress them, add to the top of the file:
```javascript
// @ts-nocheck
```

---

## 📝 Best Practices

### 1. Commit Often
```bash
git add .
git commit -m "feat: add new feature"
```

### 2. Write Meaningful Commits
- `feat: ` - New feature
- `fix: ` - Bug fix
- `docs: ` - Documentation
- `style: ` - Formatting
- `refactor: ` - Code restructuring
- `test: ` - Tests

### 3. Test Before Pushing
```bash
npm run lint
npm run build
npm run preview
```

### 4. Keep Dependencies Updated
```bash
npm outdated
npm update
```

---

## 🎯 Next Steps

### Phase 1 ✅ (Current)
- [x] Vite build system
- [x] TypeScript setup
- [x] ESLint + Prettier
- [x] Git hooks

### Phase 2 (Coming)
- [ ] Component-based architecture
- [ ] CSS organization with PostCSS
- [ ] Module imports
- [ ] Environment configs

### Phase 3 (Coming)
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] CI/CD pipeline

---

**Happy coding! 🌊**
