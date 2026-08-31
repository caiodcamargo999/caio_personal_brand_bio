# DESIGN RULES - Caio Personal Brand Landing Page

## 🎨 **Visual Identity Overview**
This document defines the complete visual identity system for Caio de Camargo's personal brand landing page, ensuring consistency across all design elements and future iterations. The design models a premium, modern tech aesthetic with a cinematic, deep-toned atmospheric background.

---

## 🌈 **Color Palette & Theme**

### **Theme System**
- The site is strictly **Forced Dark Mode** (`forcedTheme="dark"`).
- **Dark Mode CSS Variables**:
  - Background: `#0a0a0a` (near black)
  - Foreground (Text): `#fafafa` (off-white)
  - Primary: `#fafafa` (white)
  - Primary Foreground: `#0a0a0a` (black)
  - Borders/Cards/Inputs: `#27272a` (zinc-800)
  - Muted/Secondary: `#27272a`
  - Muted Foreground: `#a1a1aa` (zinc-400)

### **Cinematic Background (UnicornBackground)**
- The primary background is an interactive WebGL Fog (Vanta.js) combined with a noise overlay.
- **Fog Colors**:
  - Base: `#000000` (pure black)
  - Highlight: `#3a007a` (deep violet)
  - Midtone: `#8a0b50` (darkened magenta/fuchsia)
  - Lowlight: `#190033` (very dark indigo)
- **Texture**: Grid-noise variants (`BackgroundImageTexture`) and SVG fractal noise overlays are used to add a cinematic, tactile feel to the fog and sections.

---

## 🔤 **Typography System**

### **Font Families**
- **Sans Serif**: `Inter` (used as `--font-sans`)
  - Clean, neutral, and readable font for main body and headings.
- **Mono**: `JetBrains Mono` (used as `--font-mono`)
  - Used for tech tags, code-like elements like `[ caio ]`, and command shortcuts.

---

## 🎭 **Visual Effects & Animations**

### **Borders and Shadows**
- **Sharp edges**: `radius: 0rem` is enforced globally in `globals.css`. No rounded corners for cards and inputs, matching a sharp, tech-startup aesthetic.
- Buttons have sharp corners (`rounded-none`).

### **Animations & Effects**
- **WebGL Fog**: Smooth, volumetric fog animation running dynamically in the background.
- **Interactive Marquee**: Infinite horizontal scrolling for the tech stack and logo wall (`InteractiveMarquee` component).
- **Typewriter Effect**: Used for rotating primary keywords in the hero section.
- **Fade Ins**: Standard `framer-motion` opacity and `y` translation for entry animations.
- **Blob Animations**: Subtle floating CSS keyframe blobs (`blob`, `blob-reverse`) available in the global styles.

---

## 🧩 **Component Design System**

### **Buttons**
- **Primary CTA**: Solid background (white in dark mode), contrasting text (black). Sharp corners. Often includes a command shortcut hint like `⌘K` to trigger the Lead Capture Modal.
- **Secondary CTA**: Transparent background, border matching the primary color or subtle muted borders.
- **TextureButton**: Custom button component with noise texture for a tactile feel.

### **Cards (Services / Process)**
- Simple layout with sharp edges (`border-radius: 0`).
- Subtle border colors (`#27272a`).

---

## 🚫 **Design Constraints**

### **CRITICAL RULES**
- **Do NOT** use Light Mode. The site must remain in forced Dark Mode for the cinematic fog to work correctly.
- **Do NOT** use rounded corners (`rounded-md`, `rounded-full`). Stick strictly to sharp edges (`rounded-none`).
- **Do NOT** use bright, flat, saturated CSS gradients. Rely on the volumetric Vanta fog and noise textures for depth, color, and aesthetic appeal.
