# Frontend Development Guide

This document serves as a comprehensive guide for understanding and contributing to the frontend of the application. It contains essential information about the design system, component structure, directory organization, and development practices.

## Directory Structure

```
frontend/
├── .next/               # Next.js build output
├── node_modules/        # Dependencies
├── public/              # Static assets
├── src/                 # Source code
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...          # Feature-specific components
│   ├── lib/             # Utility functions and services
│   ├── types/           # TypeScript type definitions
│   ├── config/          # Configuration files
│   └── styles/          # Global styles
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Color Theme and Design System

The application uses a custom Tailwind CSS configuration with a well-defined color palette and design tokens. The theme is configured in `tailwind.config.js`.

### Colors

The color system follows a semantic naming convention with HSL variables:

- **Primary**: Indigo-based color scheme (primary-50 to primary-900)
- **Secondary**: Purple-based color scheme (secondary-50 to secondary-900)
- **Stone**: Neutral gray colors (stone-50 to stone-900)
- **Semantic Colors**:
  - `background`/`foreground`: Base page colors
  - `card`/`card-foreground`: Card component colors
  - `popover`/`popover-foreground`: Popover/dropdown colors
  - `border`: Border color
  - `input`: Form input colors
  - `ring`: Focus ring color

### Typography

- Font family: Montserrat (using Next.js font loading)
- Custom letter spacing options available

### Animations

Custom animations defined:
- `bounce-slow`: Slow bouncing animation
- `pulse-slow`: Slow pulsing effect
- `typing`: Typing indicator animation
- `bounce-x`: Horizontal bouncing
- `fade-in`: Fade in effect
- `fade-in-down`: Fade in from top
- `slide-in-right`: Slide in from right

### Border Radius

- `lg`: Base radius variable
- `md`: Slightly smaller radius
- `sm`: Smallest radius

## Component Library

The application includes a set of reusable UI components located in `src/components/ui/`. These components follow consistent patterns and are designed to be used throughout the application.

### Core UI Components

1. **Button**
   - Props:
     - `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
     - `size`: 'xs' | 'sm' | 'md' | 'lg'
     - `icon`: ReactNode for icon
     - `iconPosition`: 'left' | 'right'
     - `isLoading`: Boolean to show loading state
     - `fullWidth`: Boolean to make button full width

2. **StatusDot**
   - Displays a colored dot for status indication

3. **Icon**
   - A comprehensive icon component with many built-in icons

4. **LoadingDots**
   - Animated loading indicator

5. **Modal**
   - Popup dialog component

6. **Progress**
   - Progress bar component

7. **CollapsiblePanel**
   - Expandable/collapsible content panel

### Feature Components

Other specialized components in `src/components/`:

- **StatusIndicator**: Shows system status
- **TaskProgress**: Displays task completion progress
- **ChatSection**: Chat interface component
- **ChatInput**: Input for chat messages
- **ChatMessage**: Displays chat messages
- **FileViewer**: Component for viewing files
- **FileNavigator**: Component for navigating files
- **MarkdownRenderer**: Renders markdown content
- **SlideViewer**: Component for viewing slides

## Utility Functions

The application includes utility functions in `src/lib/`:

- `cn`: A utility function for merging Tailwind CSS classes using `clsx` and `tailwind-merge`
- Pusher-related utilities for real-time communication

## Best Practices for Creating New Components

1. **Follow Existing Patterns**:
   - Look at similar components before creating new ones
   - Maintain consistent naming, structure, and props

2. **Use the Design System**:
   - Use Tailwind CSS classes that align with the design system
   - Utilize the `cn()` utility for merging classes

3. **Component Structure**:
   - Create well-typed props interface with TypeScript
   - Use React.FC for functional components
   - Include appropriate default values
   - Follow the established pattern for variant/size styles

4. **Accessibility**:
   - Include proper ARIA attributes
   - Ensure keyboard navigation works
   - Maintain good contrast ratios

5. **Reusability**:
   - Make components configurable with props
   - Avoid hard-coding values
   - Consider responsive behavior

## Project Configuration

The project uses:
- Next.js for the frontend framework
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality

When creating new files, ensure they follow the existing structure and adhere to the project's code style and guidelines. 