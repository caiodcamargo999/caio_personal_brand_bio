# DESIGN RULES - Caio Personal Brand Landing Page

## 🎨 **Visual Identity Overview**
This document defines the complete visual identity system for Caio de Camargo's personal brand landing page, ensuring consistency across all design elements and future iterations. The design strictly models a minimalist, tech-startup aesthetic.

---

## 🌈 **Color Palette**

### **Theme System**
- The site supports a strict Light and Dark mode toggle.
- **Light Mode**:
  - Background: `#ffffff` (white)
  - Foreground (Text): `#000000` (black)
  - Primary: `#000000` (black)
  - Primary Foreground: `#ffffff` (white)
  - Borders: `#e5e7eb` (gray-200)
  - Muted: `#f9fafb` (gray-50)
  - Muted Foreground: `#6b7280` (gray-500)

- **Dark Mode**:
  - Background: `#0a0a0a` (near black)
  - Foreground (Text): `#ffffff` (white)
  - Primary: `#ffffff` (white)
  - Primary Foreground: `#000000` (black)
  - Borders: `#27272a` (zinc-800)
  - Muted: `#18181b` (zinc-900)
  - Muted Foreground: `#a1a1aa` (zinc-400)

---

## 🔤 **Typography System**

### **Font Families**
- **Sans Serif**: Inter or system-ui
  - Clean, neutral font.
- **Mono**: Geist Mono or standard monospace
  - Used for tags and code-like elements like `[ caio ]`.

---

## 🎭 **Visual Effects & Animations**

### **Borders and Shadows**
- Sharp edges, minimalistic rounded corners (`rounded-none` or `rounded-sm` at most for subtle elements, but primary buttons and cards should favor sharp or very slight rounding).
- No heavy purple glows. Use subtle neutral drop shadows if needed.

### **Animations**
- **Marquee**: Infinite horizontal scrolling for social proof / logo wall.
- **Vertical Slide**: Rotating words in the hero section (e.g., Ship, Scale, Grow) with a clipping container.
- **Fade Ins**: Standard `framer-motion` opacity and `y` translation for entry animations.

---

## 🧩 **Component Design System**

### **Buttons**
- **Primary CTA**: Solid background (black in light mode, white in dark mode), contrasting text. Sharp corners. Often includes a command shortcut hint like `⌘K`.
- **Secondary CTA**: Transparent background, border matching the primary color.

### **Cards (Services)**
- Simple layout with top-left aligned icon.
- Subtle background patterns or very minimal gradient lines.

---

## 🚫 **Design Constraints**

### **CRITICAL RULE**
- **Do NOT** reintroduce the old purple gradient theme.
- **Do NOT** use heavily rounded, pill-shaped buttons. Stick to the sharp, tech-startup aesthetic.
- **Do NOT** add random colors. Stick strictly to black, white, and shades of gray, utilizing the CSS variables for themes.
