# 🚀 Meet Your Co-Founder — Event Website

A high-energy, modern landing and authentication web app built for the **Meet Your Co-Founder** event hosted by the **EIS (Entrepreneur & Innovation Society)**.

Built with **React, Vite, Tailwind CSS, and WebGL (OGL)** using pure JavaScript (`.jsx`) for seamless team collaboration.

---

## 🌟 Key Features & Sections

### 1. 🌌 Hero Section
- **Night Sky Background**: Gradient (`teal → dark blue → black`) with an interactive **WebGL Galaxy starfield** (`ogl`).
- **Navbar**:
  - Left-aligned **EIS Society Logo** with a white text filter and transparent background.
  - Right-aligned navigation links (**About**, **Schedule**, **FAQs**) featuring a **glowing comet star trail animation** on tab clicks.
- **Hero Title**: Bold italic typography with a **cyan blue flame motion-streak text effect** ("NIGHT" / "GHOSTING" aesthetic).
- **Subheading**: `network · collaborate · pitch` with a 1-second sequential glowing word animation cycle.
- **Register CTA Button**: Pulsing cyan gradient button with a hover shimmer animation.

### 2. 💡 About Section
- Clean glassmorphism card (`GlowCard`) with an animated glowing blue border and smooth scroll-reveal entrance.

### 3. 📅 Schedule Section
- **Vertical Timeline**: Animated **cyan energy light beam line** linking all 8 event phases.
- **Phase Cards**: Staggered scroll animations, pulsing phase number badges (`01`, `02`, `4A`...), and chevron connectors.

### 4. ❓ FAQs Section
- Accordion-style expandable questions with smooth height transitions, rotating `+` / `×` icons, and glowing card focus states.

### 5. 🔐 Auth Page (`/auth`)
- Glassmorphism card for **Login** and **Register**.
- **Register Form** includes: `Name`, `Email`, `College`, `Branch`, and `Domain / Area of Interest`.
- Smooth sliding tab indicator.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Galaxy.jsx            # WebGL starfield shader component
│   ├── card.jsx              # Reusable GlowCard component
│   ├── navbar.jsx            # Top navbar with EIS logo & comet star animation
│   ├── heroBackground.jsx    # Night sky gradient background wrapper
│   ├── heroHeading.jsx       # Cyan flame & motion-streak title text
│   ├── heroSubheading.jsx    # 1s word glow cycle subheading
│   └── AnimatedSection.jsx   # Scroll reveal animation wrapper
├── pages/
│   ├── landing/
│   │   ├── hero.jsx          # Hero section
│   │   ├── about.jsx         # About section
│   │   ├── schedule.jsx      # Timeline schedule section
│   │   ├── faqs.jsx          # FAQs section
│   │   └── index.jsx         # Main landing page wrapper
│   └── auth/
│       └── register.jsx      # Login & Register auth page
├── App.jsx                   # React Router setup
├── index.css                 # Tailwind directives & keyframe animations
└── main.jsx                  # React entry point
```

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## ⚡ Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Graphics / WebGL**: OGL (Lightweight 3D/Shader library)
- **Language**: Pure JavaScript & JSX (`.jsx`)
