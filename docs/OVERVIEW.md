# OVERVIEW - Caio Personal Brand Landing Page

## 🎯 **Project Overview**
This is a professional personal brand landing page for **Caio de Camargo**, designed to showcase his expertise in AI, Strategy, and Business Consulting. The page serves as a modern platform that connects visitors to various services and professional opportunities, featuring a complete lead capture and CRM funnel.

## 🌍 **Internationalization System**

### **Supported Languages**
- **English (en)**: Default language, fallback for all users
- **Portuguese (pt)**: For users from Brazil, Portugal, and other Portuguese-speaking countries
- **Spanish (es)**: For users from Spain, Mexico, Argentina, and other Spanish-speaking countries

### **URL Structure & Routing**
- **Locale Routes**: `/en`, `/pt`, `/es` for each language via `next-intl`
- **Automatic Redirects**: Handled by middleware based on user preferences.

## 🚀 **Key Features**

### **Service Showcase**
- **Strategy & Consultation**: Personal and business consulting services with an interactive lead capture funnel.
- **Rarity Agency**: Marketing and AI agency services.

### **Interactive Elements & Automations**
- **WhatsApp Integration**: Direct contact for "no budget" leads. Includes an automated WhatsApp service via Evolution API for sending meeting reminders.
- **Lead Capture Funnel**: A multi-step form built with React Hook Form and Zod.
- **Cal.com Integration**: Automated scheduling using the Cal.com embed widget.
- **CRM Sync (Trello)**: Leads are automatically synced to Trello.
- **Google Sheets Integration**: Leads are appended to Google Sheets for redundancy and tracking.
- **Responsive Design**: Optimized for all device types.

### **Lead Capture & Conversion Funnel**
- **Modal Trigger**: "Strategy & Consultation" button (`⌘K` shortcut) opens the interactive lead capture modal.
- **Smart Budget Logic**:
  - **No Budget**: Redirects the user directly to WhatsApp.
  - **Yes Budget**: Proceeds to the Cal.com scheduling embed.
- **Pre-saving Leads**: Leads are saved to Trello and Google Sheets *before* the calendar step to prevent drop-off loss.
- **Automated Follow-ups**: Email notifications sent to Caio, and 1-hour WhatsApp reminders sent to the leads before their scheduled calls.

### **User Experience**
- **WebGL Vanta Fog**: A cinematic, deep-toned atmospheric background featuring dark violet and magenta fog.
- **Smooth Animations**: Framer Motion-powered entrance, hover effects, and infinite scrolling tech stack marquees.
- **Modern UI**: Forced Dark Mode with sharp corners (`0rem` border radius) and a premium tech-startup aesthetic.
- **Fast Performance**: Next.js optimization and component lazy-loading.

## 🎨 **Design Philosophy**
The design emphasizes a premium, minimalist tech-startup aesthetic. It utilizes a strict **Forced Dark Mode** with sharp edges, JetBrains Mono accents, and an interactive cinematic fog background. This replaces the old saturated purple gradients with volumetric depth and noise textures.

## 🔗 **External Integrations**
- **Cal.com**: Embedded widget for scheduling calls.
- **Trello API**: Direct REST API integration for lead management.
- **Google Sheets API v4**: Real-time lead data collection and storage.
- **Google Calendar API v3**: Used by the WhatsApp reminder service to scan for upcoming meetings.
- **WhatsApp Web Client**: Local Node.js service for sending automated reminders.
- **NodeMailer (SMTP)**: Used for internal email notifications.

## 📈 **Business Goals**
- **Lead Generation**: Convert visitors into consulting clients through the interactive funnel.
- **Brand Awareness**: Establish Caio as a thought leader in AI and strategy.
- **Network Expansion**: Connect with potential business partners.
- **Service Promotion**: Showcase Rarity Agency and consulting offerings.
- **Data Collection**: Build a comprehensive lead database with behavioral insights.

## 🚫 **CRITICAL RULE - NEVER BREAK THIS**
**NEVER, I SAY, NEVER CHANGE ANYTHING IN DESIGN AND STRUCTURE IF I DON'T ASK TO!!!**

- **Design**: Keep exactly as designed (Forced Dark Mode, Vanta Fog, sharp corners).
- **Structure**: Maintain original layout.
- **Components**: Don't add/remove without explicit request.
- **Styling**: Preserve original colors, spacing, animations.
- **Functionality**: Keep original behavior unless specifically asked to change.

---

*This document provides a high-level overview of the project. For technical details, see ARCHITECTURE.md. For design specifications, see DESIGN_RULES.md. For lead capture and backend setup, see LEAD_CAPTURE_SETUP.md.*
