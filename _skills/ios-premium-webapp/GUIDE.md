# How to use the 'ios-premium-webapp' Skill

This guide explains how to transform a standard React/Supabase web application into a premium, iOS-style native-feeling platform using the blueprints in this Skill.

## Step 1: Initialize the Design System
Apply the CSS variables and glassmorphism utilities from `examples/GlassStyles.css` to your global `index.css`.
-   **Critical**: Ensure the `ios-container` has `position: relative` and `overflow: hidden` to simulate the mobile frame.
-   **Gradients**: Use the `radial-gradient` provided to achieve the correct depth effect.

## Step 2: Implement the Springboard Logic
Use the `examples/Springboard.jsx` component to manage your home screen.
-   **Icon Design**: Use 64px squared icons with `border-radius: 16px`.
-   **Routing**: Manage `currentView` state in your root `App.jsx`.
-   **Native Device Support**: Do NOT implement a custom notch or status bar. Let the physical device handle these to avoid UI duplication.

## Step 3: Setup Reactive Localization
Copy the pattern from `examples/I18nSystem.js`.
-   Create a central `t` object in your component.
-   Pass the `lang` prop from the settings state down to every module.

## Step 4: Security Hardening (Deployment)
Before deploying to Vercel, merge the `security/vercel.json` configurations into your project root.
-   **Headers**: Verify that `connect-src` includes `wss://*.supabase.co` to allow real-time notifications/messages.
-   **CSP**: This configuration is pre-hardened against Clickjacking and XSS.

## Step 5: Database Isolation (Supabase)
Run the SQL templates in `security/rls_policies.sql` within your Supabase SQL Editor.
-   **Verify**: Always test that a user CANNOT see another user's data by using an incognito window and the `anon_key`.

---
*Created by Antigravity - Following the HFworkers Premium Standard*
 Wilmington
