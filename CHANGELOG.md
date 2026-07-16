# UI Refactor Changelog

## 2026-07-16 — Final Round sprint (max win, keep app live)

### Why
Casper Agentic Buildathon Final Round. Organizer feedback: fix/improve the web app; keep repo functional at all times; security tooling required.

### Shipped
- **Real x402 micropayment settle**: when HTTP facilitator cannot settle, agent wallet submits a real 0.01 CSPR Testnet transfer and returns the explorer tx
- **x402 status honesty**: UI no longer claims "confirmed" before settle; shows settled/verified + explorer link
- **Judge proof panel** on landing page: package hash + sample txs with descriptions + playbook links
- **Clickable activity-log tx links** for on-chain steps
- **JUDGE_PLAYBOOK.md** — 60-second reviewer path
- **CodeQL workflow + Dependabot**
- **CODE_OF_CONDUCT.md + CONTRIBUTING.md**
- Finalist badge on hero; live (not "simulated") RWA copy

## 2026-06-16 — Linear.app-style redesign

### Philosophy
Removed all generic "AI SaaS" design smells: gradients, glassmorphism, backdrop-blur, pill shapes, oversized padding, decorative animations, and generic lucide icons. Replaced with a dense, functional, opinionated interface inspired by Linear.app.

### Files Changed

#### `src/app/globals.css`
- **Removed**: `.shadow-soft`, `.shadow-float`, `.shadow-glow-primary`, `.transition-spring`, `.glass`, `.glass-strong`, `.gradient-text`, `.gradient-border`, `@keyframes riseIn`, `.animate-rise`
- **Removed**: scrollbar border-radius (sharp scrollbar now)
- **Added**: `.terminal-cursor` blink animation — the one human-feeling element
- **Added**: `prefers-reduced-motion` support
- **Changed**: body background from `#ffffff` to `#fafafa` for subtle depth
- **Changed**: focus ring from `4px` to `2px` radius

#### `tailwind.config.ts`
- **Removed**: `cute`, `cute-dark` colors; `surface-strong` color; `cute`/`cute-lg` borderRadius tokens; `bounce-slow`, `wiggle`, `float` animations
- **Added**: `muted`, `border`, `border-strong`, `surface`, `surface-alt` colors
- **Changed**: default borderRadius from `1.5rem` to max `4px`
- **Changed**: fontFamily to use CSS vars `--font-inter` and `--font-ibm-plex-mono`

#### `src/app/layout.tsx`
- **Replaced**: `Nunito` font with `Inter` (sans) + `IBM_Plex_Mono` (mono)
- **Changed**: themeColor to `#0a0a0a`
- **Changed**: description to remove "cute"

#### `src/app/page.tsx`
- **Removed**: all decorative background layers (gradient orbs, floating particles, diagonal lines)
- **Removed**: centered hero layout — now left-aligned with 2-column grid
- **Removed**: all gradient buttons, pill buttons, shadow buttons
- **Removed**: `Brain`, `Shield`, `Sparkles`, `Heart`, `Star`, `Zap`, `Rainbow`, `Bot`, `Link2` lucide imports
- **Added**: Terminal activity log (`agent.log`) as the unique intentional imperfection — a monospace block with faux agent logs and a blinking cursor
- **Changed**: nav to sharp 1px border, no backdrop-blur
- **Changed**: features to 4-column dense grid with text badges (`AI`, `AG`, `$0`, `CH`) instead of gradient icon circles
- **Changed**: how-it-works to numbered list with sharp boxes
- **Changed**: footer to dark solid bg with left-aligned text and mono links
- **Changed**: dashboard view to clean layout with no decorative background

#### `src/components/AIAnalysis.tsx`
- **Removed**: all gradient icon circles, `Sparkles`, `Heart`, `Star`, `Zap`, `Link2`, `Activity`, `Brain`, `AlertTriangle`, `Target`, `Lightbulb` icons
- **Kept**: `ExternalLink` only (functional explorer link)
- **Changed**: all cards to `bg-surface border border-border p-4` with sharp corners
- **Changed**: progress bars from gradient to solid `bg-black`
- **Changed**: numbered recommendations from gradient circles to black squares
- **Changed**: on-chain / autonomous cards to subtle colored borders (`green-600/30`, `purple-600/30`)

#### `src/components/PortfolioDisplay.tsx`
- **Removed**: `PieChart`, `Heart`, `Sparkles` icons; gradient total value text; gradient progress bars; gradient symbol circles
- **Changed**: to dense layout with `bg-surface border border-border p-4`
- **Changed**: symbol avatar from gradient circle to black square with white text
- **Changed**: progress bar to `bg-black` on `bg-surface-alt`

#### `src/components/AgentChat.tsx`
- **Removed**: `Bot`, `User`, `Sparkles`, `Zap`, `Heart`, `Wallet` icons
- **Kept**: `Send` only (functional send button)
- **Changed**: header from gradient to solid `bg-black`
- **Changed**: avatars from gradient circles to text badges (`AI`, `U`)
- **Changed**: message bubbles from rounded-2xl to sharp boxes with borders
- **Changed**: action buttons from gradient/pill to `bg-surface border border-border`
- **Changed**: typing indicator from bouncing dots to `Thinking_` with terminal cursor

#### `src/components/WalletConnect.tsx`
- **Removed**: `Wallet`, `Sparkles`, `Heart` icons; gradient button; pill shapes
- **Changed**: to dense `bg-surface border border-border p-4` layout
- **Changed**: input and button to sharp corners, 1px borders

#### `src/components/LoadingState.tsx`
- **Removed**: `Loader`, `Sparkles`, `Heart` icons; gradient circle; bouncing dot animation
- **Changed**: to sharp box with CSS-only spinner (`border-t-transparent`)
- **Changed**: message from cute to functional

#### `src/components/ErrorState.tsx`
- **Removed**: `AlertCircle`, `Heart`, `Sparkles` icons; gradient button; rounded-3xl; "Oopsie!" copy
- **Changed**: to sharp box with `ERROR` badge tag, functional copy

#### `src/components/Logo.tsx`
- **Removed**: cute bear SVG, gradient background, glass overlay, glow, rounded-3xl, shadow
- **Added**: intentionally imperfect hand-coded geometric mark — an asymmetric composition of overlapping rectangles that feels human-crafted rather than AI-generated

## 2026-06-17 — Galaxy theme, FAQ, Docs, Casper Wallet integration

### New Features
- **Live moving galaxy background**: CSS-only starfield with drifting stars, twinkling layers, shooting stars, and nebula color gradients (purple/blue/pink). Fully performant using only `transform` and `opacity` animations.
- **FAQ Section**: 5-item accordion with smooth open/close transitions, added to landing page.
- **Docs Section**: 3-card grid linking to Smart Contract, API Reference, and GitHub Repository.
- **Casper Wallet Browser Extension Integration**: Auto-detects `window.CasperWalletProvider`, supports one-click connect, and falls back to manual public key input.
- **Mobile wallet deep link**: "Get Casper Wallet" link for users without the extension.

### Theme Changes
- **Complete dark theme shift**: Background changed from `#fafafa` to `#050510` deep space black.
- **New color palette**: Added `galaxy-900` through `galaxy-500`, `neon-cyan`, `neon-purple`, `neon-pink`, `neon-blue` to Tailwind config.
- **Glass morphism cards**: All cards now use `bg-galaxy-800/60 backdrop-blur-sm border border-white/10` for a premium space feel.
- **Gradient glow borders**: Every card has a subtle gradient glow on hover (`from-neon-cyan/20 to-neon-purple/20`).
- **Smooth transitions**: Added `slide-up`, `float`, and `pulse-slow` animations. All interactive elements have `hover:-translate-y-0.5` and `duration-300` transitions.
- **Neon progress bars**: Portfolio and allocation bars use `from-neon-cyan to-neon-purple` gradients.

### Updated Components
- `page.tsx`: Full dark theme with galaxy background wrapper on all views (landing, loading, error, dashboard).
- `WalletConnect.tsx`: Centered card with gradient glow, Casper Wallet extension detection, neon status indicators, and manual input fallback.
- `PortfolioDisplay.tsx`: Glass card with neon gradient progress bars and glow hover effect.
- `AIAnalysis.tsx`: Glass cards with neon badges, colored borders for on-chain records.
- `AgentChat.tsx`: Glass chat panel with gradient header, neon avatar badges, and gradient user message bubbles.
- `LoadingState.tsx`: Glass spinner card with neon-cyan spinning border.
- `ErrorState.tsx`: Glass error card with red gradient glow and neon retry button.
- `tailwind.config.ts`: Added `darkMode: 'class'`, new galaxy and neon colors, rounded-xl radius tokens, new animations.

## 2026-06-17 — Premium logo, Casper icon, MIT license, 404 & Coming Soon

### New Files
- `LICENSE`: MIT License added to repository.
- `src/app/not-found.tsx`: Custom 404 page with galaxy background, neon badge, and gradient CTA button.
- `src/app/coming-soon/page.tsx`: Standalone Coming Soon page with galaxy background, nav bar, status badges, and GitHub link.

### Updated Components
- `src/components/Logo.tsx`: Replaced hand-coded rectangles with a premium geometric diamond mark — outer diamond frame, inner filled diamond, center vertical line and dot, all using a cyan-to-purple gradient. Scales cleanly from 32px to 64px.
- `public/icon.svg`: Updated favicon/app icon to match the new premium diamond logo.
- `src/components/WalletConnect.tsx`: Replaced generic Lucide wallet icon with a custom stylized Casper "C" with dot, using the same cyan-to-purple gradient.
- `src/app/layout.tsx`: Fixed body background from `bg-[#fafafa] text-black` to `bg-galaxy-900 text-white` for galaxy theme consistency.
