# DESIGN RULES - Caio Personal Brand Landing Page

## 🎨 **Visual Identity Overview**
This document defines the complete visual identity system for Caio de Camargo's personal brand landing page, ensuring consistency across all design elements and future iterations.

---

## 🌈 **Color Palette**

### **Primary Colors**
- **Primary Purple**: `#8b5cf6` (violet-500)
  - Used for: Buttons, borders, accents, hover states
  - Hover variant: `#7c3aed` (violet-600)
  - Opacity variants: 10%, 15%, 20%, 25%, 30%, 40%, 60%

### **Background System**
- **Main Background**: Complex gradient system with multiple radial gradients
  - Base: `#0a0a0a` (near black)
  - Primary gradient: `#1a0a1a` → `#0f0a1f` → `#1a0a2a` → `#0a0a0a`
  - Radial overlays: Purple tints at 8-15% opacity positioned at corners

### **Surface Colors**
- **Card Background**: `#1C1C1C` (dark gray)
- **Card Border**: `#2D2D2D` (medium gray)
- **Text Colors**:
  - **Primary Text**: `#ffffff` (white)
  - **Secondary Text**: `#A0A0A0` (muted gray)
  - **Accent Text**: Gradient from white through indigo-100 to indigo-200

---

## 🔤 **Typography System**

### **Font Families**
- **Sans Serif (Body)**: Source Sans 3
  - Variable: `--font-sans`
  - Used for: Body text, descriptions, general content
  
- **Heading**: Roboto
  - Variable: `--font-heading`
  - Weights: 300, 400, 500, 700
  - Used for: Headings, titles, emphasis

### **Type Scale**
- **Hero Title**: `text-2xl sm:text-4xl md:text-[3.2rem]`
- **Card Titles**: `text-lg sm:text-xl`
- **Section Headings**: `text-lg sm:text-xl`
- **Body Text**: `text-base sm:text-lg`
- **Small Text**: `text-sm sm:text-base`
- **Caption**: `text-xs sm:text-sm`

### **Typography Features**
- **Tracking**: `tracking-[-0.03em]` for headings, `tracking-[-0.02em]` for cards
- **Line Height**: `leading-tight` for headings, `leading-relaxed` for body text
- **Text Balance**: `text-balance` for optimal text wrapping

---

## 🎭 **Visual Effects & Animations**

### **Gradients**
- **Card Gradients**: `from-card/95 to-black/70`
- **Hover States**: `hover:from-primary/15 hover:to-black/80`
- **Dialog Backgrounds**: `from-primary/10 via-black/90 to-primary/5`
- **Text Gradients**: `from-white via-indigo-100 to-indigo-200`

### **Shadows & Glows**
- **Profile Photo**: `shadow-[0_4px_15px_rgba(0,0,0,0.2),0_0_20px_rgba(139,92,246,0.1)]`
- **Button Shadow**: `shadow-[0_4px_15px_rgba(139,92,246,0.3)]`
- **Card Hover**: `hover:shadow-xl`

### **Transitions & Animations**
- **Duration**: `transition-all duration-300`
- **Hover Effects**: `hover:-translate-y-1` (subtle upward movement)
- **Framer Motion**: Staggered animations with 0.14s delay between items
- **Item Animation**: 0.45s duration for individual elements

---

## 🧩 **Component Design System**

### **Cards**
- **Border Radius**: `rounded-xl` (12px)
- **Padding**: `px-4 py-6 sm:px-6 sm:py-7`
- **Background**: Semi-transparent with backdrop blur
- **Hover States**: Border color changes to primary variants
- **Spacing**: `space-y-1.5 sm:space-y-2 md:space-y-2.5`

### **Buttons**
- **Primary Button**: Purple background with white text
- **Hover States**: Darker purple variant
- **Shadow**: Purple glow effect
- **Border Radius**: Inherits from Tailwind defaults

### **Dialogs**
- **Max Width**: `max-w-[520px]`
- **Background**: Semi-transparent with backdrop blur
- **Border**: Primary color with 30% opacity
- **Content Spacing**: `grid gap-3`

### **Language Switcher**
- **Position**: `absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8`
- **Background**: `bg-card/80 backdrop-blur-sm border border-cardBorder`
- **Hover States**: `hover:bg-card/90 hover:border-primary/30`
- **Dropdown**: `w-48 bg-card/95 backdrop-blur-xl border border-cardBorder`
- **Responsive**: Full text on desktop/tablet, flag only on mobile

---

## 📱 **Layout & Spacing**

### **Container System**
- **Max Width**: `max-w-[680px]`
- **Padding**: `px-4 py-6 sm:py-8 md:py-12`
- **Margins**: `mx-auto` for centering

### **Spacing Scale**
- **Small**: `mb-3`, `mt-2`, `gap-3`
- **Medium**: `mb-6`, `mt-4`, `gap-5`
- **Large**: `mb-10`, `mt-5`, `gap-6`
- **Responsive**: `sm:mb-8`, `sm:gap-6`

### **Grid & Flexbox**
- **Card Grid**: Single column with consistent spacing
- **Social Icons**: `flex items-center justify-center gap-5 sm:gap-6`
- **Content Alignment**: `text-center` for headers and CTAs

---

## 🖼️ **Imagery & Icons**

### **Profile Photo**
- **Size**: `100px x 100px` (mobile), `120px x 120px` (desktop)
- **Shape**: `rounded-full`
- **Border**: `border-[3px] border-cardBorder`
- **Object Fit**: `object-cover object-[center_25%]`
- **Background**: `bg-cardBorder`

### **Icons**
- **Size**: `22px` (mobile), `24px` (desktop)
- **Color**: `text-muted` with `hover:text-white` transition
- **Spacing**: Consistent `gap-5 sm:gap-6` between social icons

### **Language Icons**
- **Globe Icon**: `h-4 w-4` for language switcher
- **Flag Emojis**: Country flags for each language option
- **Chevron**: `h-3 w-3` for dropdown indicator

---

## 🎯 **Interactive States**

### **Hover Effects**
- **Cards**: Upward movement, shadow increase, border color change
- **Buttons**: Background color darkening
- **Links**: Text color transitions
- **Icons**: Color change from muted to white
- **Language Switcher**: Background and border color changes

### **Focus States**
- **Accessibility**: Proper focus indicators for keyboard navigation
- **Visual Feedback**: Clear hover and active states

### **Loading States**
- **Framer Motion**: Staggered entrance animations
- **Initial State**: `opacity: 0, y: 10` for header
- **Animate State**: `opacity: 1, y: 0` with 0.6s duration

---

## 📐 **Responsive Design**

### **Breakpoints**
- **Mobile First**: Base styles for mobile devices
- **Small**: `sm:` prefix (640px+)
- **Medium**: `md:` prefix (768px+)

### **Adaptive Elements**
- **Typography**: Responsive font sizes
- **Spacing**: Adaptive margins and padding
- **Layout**: Flexible container widths
- **Images**: Responsive sizing
- **Language Switcher**: Full text on larger screens, flag only on mobile

---

## 🚫 **Design Constraints**

### **CRITICAL RULE - NEVER BREAK THIS**
**NEVER, I SAY, NEVER CHANGE ANYTHING IN DESIGN AND STRUCTURE IF I DON'T ASK TO!!!**

### **What NOT to Do**
- **NEVER** change design without explicit request
- **NEVER** modify structure without permission
- **NEVER** add/remove components without asking
- Don't use colors outside the defined palette
- Don't change the gradient background system
- Don't modify the primary purple (#8b5cf6) without updating the entire system
- Don't add new fonts without updating the font variables
- Don't change the card border radius (12px)
- Don't remove the backdrop blur effects
- Don't change the animation timing without updating all related animations
- Don't modify the language switcher positioning without updating responsive breakpoints

### **Consistency Rules**
- Always use the defined spacing scale
- Maintain the established hover state patterns
- Keep the gradient text effects for headings
- Preserve the card hover animations
- Maintain the purple accent color throughout
- Keep the language switcher in the top right corner

---

## 🔄 **Future Considerations**

### **Scalability**
- The design system supports easy addition of new cards/sections
- Color variants can be extended using the established opacity system
- Animation patterns can be reused for new components

### **Maintenance**
- All design tokens are defined in `tailwind.config.ts`
- CSS custom properties are used for font variables
- Component patterns are established for consistency

---

## 📋 **Implementation Checklist**

When creating new components or modifying existing ones, ensure:
- [ ] Colors match the defined palette
- [ ] Typography follows the established scale
- [ ] Spacing uses the defined scale
- [ ] Hover states follow the established patterns
- [ ] Animations use consistent timing
- [ ] Responsive design is implemented
- [ ] Accessibility standards are met
- [ ] Language switcher positioning follows responsive guidelines

---

*This document should be updated whenever design decisions change or new patterns are established.*
