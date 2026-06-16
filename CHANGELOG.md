# UI Refactor Changelog

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
