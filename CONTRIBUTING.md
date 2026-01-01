# Contributing to RFID OS

First off, thank you for considering contributing to RFID OS! 🎉

This is a community-driven project and we welcome contributions of all kinds: bug reports, feature suggestions, documentation improvements, and code contributions.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Good First Issues](#good-first-issues)

---

## 🤝 Code of Conduct

This project follows a simple code of conduct:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

---

## 🎯 How Can I Contribute?

### Reporting Bugs 🐛

Before creating a bug report, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information

**Use this template:**
```markdown
**Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- RFID OS Version: [e.g., 1.0.0]
```

### Suggesting Features 💡

We love new ideas! Before suggesting a feature:
- Check if it's already suggested in Issues
- Consider if it fits the project's scope
- Think about how it benefits other users

**Feature request template:**
```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternative Solutions**
What other options did you consider?

**Additional Context**
Mockups, examples, etc.
```

### Improving Documentation 📝

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples or use cases
- Improve code comments
- Create tutorials or guides

### Contributing Code 🔧

See [Development Setup](#development-setup) below.

---

## 🛠️ Development Setup

### Prerequisites
- A modern web browser
- Text editor (VS Code, Sublime, etc.)
- Basic knowledge of HTML, CSS, and JavaScript
- Optional: Local web server (Python, Node.js http-server, etc.)

### Getting Started

1. **Fork the repository**
   - Click the "Fork" button on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/rfid-os.git
   cd rfid-os
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make your changes**
   - Edit files as needed
   - Test thoroughly in multiple browsers

5. **Test locally**
   ```bash
   # Option 1: Open directly in browser
   open index.html
   
   # Option 2: Use a local server
   python -m http.server 8000
   # Visit: http://localhost:8000
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   # or
   git commit -m "fix: resolve issue with..."
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tested in Chrome, Firefox, and Safari (if possible)
- [ ] Added/updated documentation if needed
- [ ] Commit messages follow convention
- [ ] No console errors or warnings
- [ ] localStorage operations work correctly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## How to Test
Steps to test the changes

## Checklist
- [ ] Code tested in multiple browsers
- [ ] No console errors
- [ ] Documentation updated
- [ ] Follows style guidelines

## Screenshots (if applicable)
Add screenshots here
```

### Review Process

1. Maintainer will review your PR within 2-3 days
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be acknowledged!

---

## 📐 Style Guidelines

### JavaScript

```javascript
// Use ES6+ features
const myFunction = (param) => {
  // Use const/let, not var
  const result = param * 2;
  return result;
};

// Use meaningful variable names
const moduleData = {...};  // Good
const md = {...};          // Bad

// Add comments for complex logic
// Calculate ROI based on user input
const roi = calculateROI(input);

// Use async/await for promises
async function saveModule() {
  try {
    await window.storage.set('key', value);
  } catch (error) {
    console.error('Save failed:', error);
  }
}
```

### HTML

```html
<!-- Use semantic HTML -->
<main>
  <article>
    <header>...</header>
    <section>...</section>
  </article>
</main>

<!-- Add accessibility attributes -->
<button aria-label="Delete module">🗑️</button>

<!-- Use data attributes for JS hooks -->
<div data-module-id="123">...</div>
```

### CSS

```css
/* Use CSS variables */
:root {
  --primary-color: #38bdf8;
  --bg-color: #0f172a;
}

/* Use BEM-like naming */
.module-card { }
.module-card__header { }
.module-card--selected { }

/* Mobile-first approach */
.container {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    max-width: 1200px;
  }
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug with...
docs: update README
style: format code
refactor: restructure component
perf: improve performance
test: add tests
chore: update dependencies
```

---

## 🌟 Good First Issues

New to the project? Start here:

### Easy (1-2 hours)
- [ ] Add tooltips to action buttons
- [ ] Improve mobile responsiveness
- [ ] Add loading spinners
- [ ] Fix typos in documentation

### Medium (3-5 hours)
- [ ] Implement light/dark theme toggle
- [ ] Add fuzzy search
- [ ] Create "duplicate module" feature
- [ ] Add keyboard shortcuts help modal

### Advanced (5+ hours)
- [ ] Implement diff viewer for versions
- [ ] Add markdown editor with preview
- [ ] Create export to different formats (CSV, YAML)
- [ ] Build analytics dashboard

Check [Issues](https://github.com/yurakas-netizen/rfid-os/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) for current opportunities.

---

## 🤔 Questions?

- **General questions**: Open a [Discussion](https://github.com/yurakas-netizen/rfid-os/discussions)
- **Bug reports**: Open an [Issue](https://github.com/yurakas-netizen/rfid-os/issues)
- **Feature requests**: Open an [Issue](https://github.com/yurakas-netizen/rfid-os/issues)

---

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 

**Contributors will be recognized in:**
- README.md acknowledgments
- Release notes
- Project documentation

---

<div align="center">

**Happy coding! 🚀**

</div>
