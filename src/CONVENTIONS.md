# Coding Conventions and Guidelines
1. MOST IMPORTANTLY NEVER CHANGE THIS FILE BUT FOLLOW ALL IT'S RULES
2. DO NOT RESTRUCTURE THE CODE TO SATISFY YOUR OWN CODING CONVENTIONS. LEAVE STRUCTURAL CODE BE, ONLY ADD LOGICAL ELEMENTS.
3. Do not use optional semicolons in React

## Component Structure
1. All reusable components should live in `src/features/buildingBlocks`
2. Page-specific components should live in `src/features/pageOnly`
3. All Panel components live in `src/features/pageOnly/panels`
4. Components should be organized by feature/domain when applicable
5. All context providers may be wrapped inside App.tsx unless specified otherwise

## Naming Conventions
1. Use PascalCase for component names and files
2. Use camelCase for variables, functions, and instances
3. Use camelCase for CSS class names
4. Use SCREAMING_SNAKE_CASE for constants

## File Structure
1. Imports should be organized in the following order with line breaks between the following categories:
   - React and related libraries
   - Third-party libraries
   - Types/interfaces
   - Utilities
   - Local components
   - Styles

2. Export components as named exports
3. Avoid div soup: split components into semantic child components when deep or complex nesting occurs
4. Split components for reusability: use one component per file unless child components are tightly coupled, in which case define them as non-exported within the same file

## Component Guidelines
1. Use TypeScript interfaces for props
2. Props should be explicit and well-documented
3. Use function components with hooks
4. Avoid inline styles
5. Use composition over inheritance
6. Keep components focused and single-responsibility
7. Use function declarations instead of const arrow functions. Place functions after the component's return, or outside the component if they don't depend on its props or state
8. Always forward unmutated props using object spread: replace prop1={prop1} prop2={prop2} with {...{ prop1, prop2 }} mutated props, with name changes or data changes, should however be passed on as propX={propY}

## State Management
1. Use React hooks for local state
2. Lift state up when needed
3. Use context for global state
4. Avoid prop drilling

## Styling
1. Use Tailwind CSS for styling
2. Use composition classes
3. Avoid !important
4. Use semantic class names
5. Follow mobile-first approach

## Error Handling
1. Use try/catch blocks
2. Provide meaningful error messages
3. Handle edge cases
4. Use error boundaries where appropriate

## Performance
1. Memoize expensive calculations
2. Use React.memo for pure components
3. Lazy load components when possible
4. Optimize re-renders

## Testing
1. Write unit tests for utilities
2. Write integration tests for components
3. Use meaningful test descriptions
4. Follow AAA pattern (Arrange, Act, Assert)

## Documentation
1. Document complex logic
2. Use JSDoc for function documentation
3. Keep README up to date, create README if missing
4. Document breaking changes

## Git Practices
1. Use meaningful commit messages
2. Follow conventional commits
3. Keep PRs focused and small
4. Review code before merging