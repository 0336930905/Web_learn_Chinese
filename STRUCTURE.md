# Project Structure Documentation

## Cấu trúc thư mục chuyên nghiệp

```
Web_learn_Chinese/
│
├── api/                          # Backend API
│   ├── controllers/              # Business logic
│   │   └── authController.js     # Authentication logic
│   ├── middleware/               # Express middleware
│   │   └── auth.js              # JWT authentication
│   ├── models/                   # Database models
│   │   ├── User.js
│   │   ├── Word.js
│   │   └── Progress.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── words.js
│   │   └── progress.js
│   ├── utils/                    # Utilities
│   │   └── starterWords.js
│   ├── config/                   # Configuration
│   │   └── database.js
│   └── index.js                  # API entry point
│
├── public/                       # Frontend static files
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/              # Images, logos
│   │   └── icons/               # Icons, favicons
│   │
│   ├── css/                     # Stylesheets
│   │   ├── common/              # Base styles
│   │   │   ├── variables.css    # CSS variables
│   │   │   ├── reset.css        # Browser reset
│   │   │   └── utilities.css    # Utility classes
│   │   ├── components/          # Component styles
│   │   │   ├── alerts.css       # Alert notifications
│   │   │   ├── buttons.css      # Button styles
│   │   │   ├── cards.css        # Card containers
│   │   │   ├── forms.css        # Form elements
│   │   │   └── modals.css       # Modal dialogs
│   │   ├── pages/               # Page-specific styles
│   │   │   ├── login.css        # Login page
│   │   │   └── dashboard.css    # Dashboard
│   │   ├── main.css             # Main CSS entry
│   │   └── README.md            # CSS documentation
│   │
│   ├── js/                      # JavaScript files
│   │   ├── utils/               # Utility modules
│   │   │   ├── api.js           # API client
│   │   │   ├── auth.js          # Auth utilities
│   │   │   └── helpers.js       # Helper functions
│   │   ├── components/          # UI components
│   │   │   ├── alert.js         # Alert component
│   │   │   ├── modal.js         # Modal component
│   │   │   └── form-validator.js # Form validation
│   │   ├── pages/               # Page scripts
│   │   │   ├── login.js         # Login page logic
│   │   │   └── dashboard.js     # Dashboard logic
│   │   └── app.js               # Main app (legacy)
│   │
│   ├── pages/                   # HTML pages
│   │   ├── auth/                # Authentication pages
│   │   │   └── login.html       # Login/Register
│   │   └── dashboard/           # Dashboard pages
│   │       └── index.html       # Main dashboard
│   │
│   ├── index.html               # Application entry
│   └── styles.css               # Legacy styles
│
├── .env                         # Environment variables
├── .gitignore                   # Git ignore
├── package.json                 # Dependencies
├── README.md                    # Project documentation
└── vercel.json                  # Deployment config
```

## Kiến trúc phân tầng

### 1. Backend (API Layer)
- **Controllers**: Xử lý business logic
- **Middleware**: Authentication, validation
- **Models**: Database schema & methods
- **Routes**: API endpoints
- **Utils**: Helper functions
- **Config**: Database, environment

### 2. Frontend (Presentation Layer)

#### 2.1. CSS Architecture
```
css/
├── common/       → Base styles, variables, utilities
├── components/   → Reusable UI components
├── pages/        → Page-specific styles
└── main.css      → Entry point (imports all)
```

#### 2.2. JavaScript Architecture
```
js/
├── utils/        → Core utilities (API, auth, helpers)
├── components/   → UI components (alert, modal, validator)
├── pages/        → Page-specific logic
└── app.js        → Main application (legacy)
```

#### 2.3. Pages Structure
```
pages/
├── auth/         → Authentication flows
└── dashboard/    → Application dashboard
```

## Design Patterns

### 1. Separation of Concerns
- **CSS**: Style only (no logic)
- **JS**: Logic only (minimal inline styles)
- **HTML**: Structure only (semantic markup)

### 2. Component-Based Architecture
- Reusable components (buttons, forms, cards)
- Modular CSS & JS
- Single responsibility principle

### 3. Utility-First CSS
- CSS variables for consistency
- Utility classes for rapid development
- Component classes for complex patterns

### 4. API Client Pattern
- Centralized API configuration
- Consistent error handling
- Promise-based async operations

## File Naming Conventions

### CSS Files
- `kebab-case.css` (e.g., `form-validator.css`)
- Descriptive names (e.g., `buttons.css`, not `btn.css`)

### JavaScript Files
- `kebab-case.js` for modules (e.g., `form-validator.js`)
- `camelCase.js` for pages (e.g., `dashboard.js`)

### HTML Files
- `kebab-case.html` (e.g., `login.html`)
- Descriptive names (e.g., `dashboard/index.html`)

## Import Strategy

### CSS Imports (main.css)
```css
@import url('./common/variables.css');
@import url('./common/reset.css');
@import url('./common/utilities.css');
@import url('./components/buttons.css');
/* ... */
```

### JavaScript Modules (ES6)
```javascript
// Named exports
import { api } from '/js/utils/api.js';
import { showAlert } from '/js/components/alert.js';

// Default exports
import validateForm from '/js/components/form-validator.js';
```

## Development Workflow

### 1. Adding New Feature
```
1. Create component CSS → css/components/feature.css
2. Create component JS → js/components/feature.js
3. Import in main.css
4. Use in pages
```

### 2. Adding New Page
```
1. Create HTML → pages/section/page.html
2. Create page CSS → css/pages/page.css
3. Create page JS → js/pages/page.js
4. Link in HTML <head>
```

### 3. Updating Styles
```
1. Global changes → css/common/variables.css
2. Component changes → css/components/[name].css
3. Page-specific → css/pages/[name].css
```

## Best Practices

### CSS
✅ Use CSS variables
✅ Mobile-first responsive
✅ BEM naming for components
✅ Utility classes for spacing
✅ Component classes for patterns

❌ Don't use !important
❌ Don't inline styles
❌ Don't deep nesting (max 3 levels)

### JavaScript
✅ ES6+ modules
✅ Async/await
✅ Error handling
✅ Clear function names
✅ JSDoc comments

❌ Don't use global variables
❌ Don't manipulate DOM in utils
❌ Don't duplicate code

### HTML
✅ Semantic HTML5
✅ Accessibility (ARIA)
✅ SEO meta tags
✅ Progressive enhancement

❌ Don't use inline styles
❌ Don't use deprecated tags
❌ Don't skip heading levels

## Migration Guide

### From Old Structure
```
OLD                         NEW
public/login.html       →   public/pages/auth/login.html
public/app.js           →   public/js/utils/ + js/pages/
public/css/login.css    →   public/css/pages/login.css
```

### Updating Links
```html
<!-- Old -->
<link href="/css/login.css">
<script src="/app.js">

<!-- New -->
<link href="/css/main.css">
<link href="/css/pages/login.css">
<script type="module" src="/js/pages/login.js">
```

## Testing Checklist

- [ ] CSS loads correctly
- [ ] JavaScript modules import
- [ ] All pages accessible
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] API calls working
- [ ] Authentication flow
- [ ] Form validation

## Performance Optimization

### CSS
- Minify for production
- Remove unused styles
- Use CSS variables (no duplication)
- Critical CSS inline

### JavaScript
- Code splitting
- Lazy loading
- Tree shaking
- Module bundling (future)

### Assets
- Image optimization
- Icon sprites
- Font subsetting
- CDN for libraries

## Future Enhancements

1. **Build System**: Webpack/Vite for bundling
2. **CSS Preprocessor**: Sass/Less for advanced features
3. **TypeScript**: Type safety
4. **Testing**: Jest for unit tests
5. **Linting**: ESLint + Stylelint
6. **CI/CD**: Automated deployment

## Resources

- [CSS Architecture](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
