# CSS Architecture Documentation

## 📂 Cấu trúc thư mục

```
public/
├── css/
│   ├── variables.css   # CSS Variables & Design System
│   ├── auth.css        # Authentication pages (login, register)
│   └── main.css        # Main application styles
├── index.html          # → variables.css + main.css
├── login.html          # → variables.css + auth.css
└── register.html       # → variables.css + auth.css
```

---

## 🎨 Design System (variables.css)

### Color Palette

#### Primary Colors
- `--color-primary`: #667eea (Purple Blue)
- `--color-primary-dark`: #764ba2 (Dark Purple)
- `--color-primary-light`: rgba(102, 126, 234, 0.1)

#### Neutral Colors
- Gray scale: 50, 100, 200, 300, 400, 600, 800
- White & Black

#### Semantic Colors
- Success: Green (#3c3)
- Error: Red (#c33)
- Warning: Orange (#f90)
- Info: Blue (#09f)

### Spacing System
```
xs:  5px
sm:  8px
md:  12px
lg:  15px
xl:  20px
2xl: 30px
3xl: 40px
4xl: 50px
```

### Typography
- Font Family: System fonts (Apple, Segoe UI, Roboto...)
- Font Sizes: xs (12px) → 3xl (64px)
- Font Weights: normal (400), medium (500), semibold (600), bold (700)

### Border Radius
- sm: 5px
- md: 8px
- lg: 10px
- xl: 20px
- full: 50% (circle)

### Shadows
- sm: Subtle shadow
- md: Medium shadow for hover states
- lg: Large shadow for modals
- focus: Focus ring for form inputs

### Transitions
- fast: 0.15s
- normal: 0.3s
- slow: 0.5s

### Z-Index Layers
- dropdown: 100
- modal: 1000
- tooltip: 2000

---

## 🔐 Auth Styles (auth.css)

Áp dụng cho: `login.html`, `register.html`

### Sections:

1. **Layout**
   - `.login-container` - Full viewport gradient background
   - `.login-box` - White card container

2. **Branding**
   - `.login-logo` - Large emoji icon
   - `.login-title` - Page title
   - `.login-subtitle` - Description text

3. **Form Elements**
   - `.form-group` - Form field wrapper
   - `.form-control` - Input fields with focus states

4. **Buttons**
   - `.btn-primary` - Gradient button
   - `.btn-google` - Google OAuth button

5. **UI Components**
   - `.divider` - "hoặc" separator
   - `.error-message` / `.success-message` - Alert messages
   - `.loading` + `.spinner` - Loading animation
   - `.password-toggle` - Show/hide password

6. **Responsive**
   - Mobile optimized (max-width: 480px)

---

## 🏠 Main Styles (main.css)

Áp dụng cho: `index.html`

### Sections:

1. **Base Styles**
   - Reset CSS
   - Body defaults

2. **Layout**
   - `.container` - Max-width wrapper
   - `header` - Top navigation

3. **User Interface**
   - `#userInfo` - User display & logout
   - `.btn-logout` - Logout button

4. **Dashboard**
   - `.stats-grid` - Statistics cards
   - `.stat-card` - Individual stat display

5. **Filters**
   - `.filter-controls` - Search & category filters
   - `.btn-primary` / `.btn-secondary` - Action buttons

6. **Words Display**
   - `.words-grid` - Word cards grid
   - `.word-card` - Individual word card

7. **Modal System**
   - `.modal` - Overlay
   - `.modal-content` - Content box
   - `.close` - Close button

8. **Practice Mode**
   - `.flashcard` - Flashcard display
   - `.practice-controls` - Control buttons
   - `.btn-success` / `.btn-warning` - Action buttons

9. **Responsive Design**
   - Tablet: max-width 768px
   - Mobile: max-width 480px

---

## 🎯 Best Practices

### 1. **Sử dụng CSS Variables**
```css
/* ❌ Không nên */
.button {
  color: #667eea;
  padding: 12px;
}

/* ✅ Nên */
.button {
  color: var(--color-primary);
  padding: var(--spacing-md);
}
```

### 2. **BEM-like Naming Convention**
```css
/* Block */
.card { }

/* Element */
.card-title { }
.card-body { }

/* Modifier */
.card--highlighted { }
```

### 3. **Mobile-First Approach**
```css
/* Base styles for mobile */
.element { }

/* Tablet and up */
@media (min-width: 768px) { }

/* Desktop and up */
@media (min-width: 1024px) { }
```

### 4. **Consistent Spacing**
- Luôn dùng spacing variables
- Tránh magic numbers
- Maintain vertical rhythm

### 5. **Reusable Components**
- Extract common patterns
- Use utility classes
- Keep DRY (Don't Repeat Yourself)

---

## 🔧 Maintenance

### Adding New Colors
1. Add to `variables.css` color palette
2. Follow naming convention: `--color-{name}-{variant}`
3. Update documentation

### Adding New Components
1. Identify which CSS file (auth.css vs main.css)
2. Add to appropriate section with comment
3. Use existing variables
4. Test responsive behavior

### Performance Tips
- Minimize specificity
- Avoid deep nesting
- Use CSS variables for dynamic values
- Combine similar selectors
- Remove unused styles

---

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

CSS Features used:
- CSS Variables (Custom Properties)
- Flexbox
- Grid Layout
- Media Queries
- Transitions & Animations

---

## 🚀 Future Improvements

- [ ] Add dark mode support
- [ ] Create utility classes file
- [ ] Add print styles
- [ ] Implement CSS-in-JS alternative
- [ ] Add CSS linting (Stylelint)
- [ ] Create component library documentation

---

**Last updated:** February 2, 2026
