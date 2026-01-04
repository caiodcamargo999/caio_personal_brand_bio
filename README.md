# Caio Personal Brand LP – Next.js + Tailwind + Framer Motion + shadcn/ui + Internationalization

## Tech Stack

- **Next.js (App Router, TypeScript)**: Modern React framework with server/client components
- **React 18**: UI library
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations and gestures
- **shadcn/ui-style components**: Accessible UI primitives (Button, Card, Dialog)
- **next-intl**: Internationalization with IP-based language detection

## Project Structure

```
app/
  [locale]/
    layout.tsx
    page.tsx
  globals.css
  page.tsx
components/
  ui/
    button.tsx
    card.tsx
    dialog.tsx
i18n/
  request.ts
messages/
  en.json
  pt.json
  es.json
lib/utils.ts
package.json
tailwind.config.ts
tsconfig.json
next.config.js
middleware.ts
```

Static asset used by the page: `caio-profile-2026.jpg` is in `public/`. Next serves it at `/caio-profile-2026.jpg`.

## Internationalization Features

- **IP-based Language Detection**: Automatically detects user's country and suggests appropriate language
- **Language Switcher**: Globe icon in top-right corner with dropdown for manual language selection
- **Supported Languages**:
  - 🇺🇸 English (default)
  - 🇧🇷 Portuguese (Brazil)
  - 🇪🇸 Spanish (Latin America)
- **URL Structure**: `/en`, `/pt`, `/es` for each language
- **Automatic Redirects**: Root `/` redirects to `/en` by default

## Page Content Migrated

The original `index.html` content was migrated into `site/app/page.tsx` with Tailwind and motion/shadcn equivalents:

- **Header**: Photo, name "Caio de Camargo", tagline "Helping you grow with AI, Strategy & Business."
- **Cards/Links**:
  - Rarity Agency → `https://rarityagency.io`
  - Real Estate Opportunities → opens Dialog with countries (Indonesia, Dubai, Brazil). Each opens WhatsApp `wa.me/5551993288772` with prefilled text
  - Strategy & Consulting → Calendly link
  - Connect on LinkedIn → profile link
- **Value proposition**: "My mission is to provide the strategic leverage you need to achieve your goals."
- **Footer**: Links to LinkedIn, Instagram, X and copyright.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Ensure the photo is accessible at `/caio-profile-2026.jpg`.
   - The photo is already in `public/` folder
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Notes

- The UI components under `components/ui` follow shadcn/ui patterns without running its CLI. You can later run the official CLI to manage components if desired.
- Tailwind theme colors mirror your original palette for background, card, borders, and primary.
