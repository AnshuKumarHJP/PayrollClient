# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Configuration Component Changes

I made the Configuration component (`src/Pages/Configuration.jsx`) fully dynamic for both list and edit pages. Here's what I did:

### 1. **Removed Static TemplateEdit Import**
- **Before**: Had a hardcoded `const TemplateEdit = React.lazy(() => import("./Builder/TemplateEdit"));`
- **After**: Created a dynamic `EditComponent` that loads any edit component based on path

### 2. **Added Dynamic EditComponent**
```javascript
const EditComponent = ({ path, id, onSave, onCancel }) => {
  const LazyComponent = React.lazy(() => import(path));
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent id={id} onSave={onSave} onCancel={onCancel} />
    </React.Suspense>
  );
};
```

### 3. **Updated Configuration Array**
- Added `PageEditPath` to each menu item so each can have its own edit component
- Example: Templates use `TemplateEdit.jsx`, Rule Types use `RuleTypesManagement.jsx`

### 4. **Unified Rendering Logic**
- Both desktop and mobile layouts now use the same `EditComponent` with `activeItem.PageEditPath`
- Removed hardcoded component references

### 5. **Benefits Achieved**
- **Scalable**: Easy to add new menu items with their own edit pages
- **Performance**: Components lazy-loaded only when needed
- **Maintainable**: No hardcoded imports
- **Flexible**: Each menu item can have completely different edit interfaces

### 6. **URL Parameter Support**
- Added support for `/configuration?mode=add` and `/configuration?mode=edit&id=123`
- URL params automatically sync with component state

The Configuration component is now a truly dynamic system where each menu item can have its own dedicated list and edit components, loaded on-demand without any hardcoded references.
