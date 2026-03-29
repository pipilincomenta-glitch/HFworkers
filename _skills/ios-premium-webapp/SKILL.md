---
name: ios-premium-webapp
description: Guidelines and blueprints for building premium, iPhone-native feeling web applications with multi-language support and hardened security.
---

# Premium iOS WebApp Design System

This skill provides the architectural and aesthetic foundations for building web applications that feel like high-end native iOS apps.

## Fundamental Principles

### 1. The "Glassmorphism" Aesthetic
- **Backgrounds**: Use radial or linear gradients that evoke a sense of depth.
- **Surfaces**: Use semi-transparent backgrounds with high `backdrop-filter: blur()`.
- **Borders**: Subtle, semi-transparent borders (`rgba(255,255,255,0.1)`) to define edges without clutter.

### 2. Native Navigation (Springboard)
- **Home Screen**: A grid of high-contrast icons representing modular applications.
- **Dock**: A persistent or semi-persistent area for high-frequency actions.
- **Smooth Transitions**: Use ease-in-out animations for "opening" and "closing" apps from the home screen.

### 3. Reactive Globalization (i18n)
- **Object Pattern**: Use a modular translation object `t` that updates reactively with state.
- **Context passing**: Ensure the `lang` prop is propagated deep into components.

### 4. Enterprise-Grade Security
- **Strict Headers**: Robust `vercel.json` configuration for CSP and frame protection.
- **WebSocket Safety**: Explicitly allowing `wss://` for real-time services.
- **Row Level Security (RLS)**: Mandatory `auth.uid()` checks in the database layer.

## File Structure Reference
- `examples/GlassStyles.css`: The UI design system implementation.
- `examples/Springboard.jsx`: The layout logic for the home screen.
- `examples/I18nSystem.js`: Helper for reactive translations.
- `security/vercel.json`: Deployment hardening template.
- `security/rls_policies.sql`: Database isolation templates.

## Mastery Checklist
- [ ] Is the notch/status bar handled by the native device? (Do not duplicate).
- [ ] Are logos theme-aware (Light/Dark variants)?
- [ ] Are all Realtime connections allowed in the CSP?
 Wilmington
