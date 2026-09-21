# Institutional Dashboard Redesign

This redesign transforms the jev-trader dashboard from a light, friendly aesthetic to a professional, institutional-grade trading terminal experience.

## Key Changes

### 1. Typography
- **Before**: Inter + Geist Mono
- **After**: IBM Plex Sans + IBM Plex Mono
- Tight letter-spacing on labels (-0.01em to 0.06em depending on context)
- Tabular numerals throughout for stable number display at 3.3 Hz updates
- Larger hero price display (32px → scales down responsively)

### 2. Theme System
Four production-ready themes with instant switching:

#### Dark (Default)
- Deep charcoal backgrounds (#0A0B0F base)
- High-contrast green/red for buy/sell
- Live connection pulse with subtle glow
- Zero-radius cards for edge-to-edge terminal feel

#### Light
- Clean institutional white
- Muted buy/sell colors for daytime trading
- Professional gray hierarchy

#### Bloomberg Amber Terminal
- Iconic amber-on-black color scheme
- Bright green buy, bright red sell
- High contrast for CRT aesthetic

#### Midnight Indigo
- Deep indigo backgrounds with violet accents
- Teal buy, pink sell for premium dark mode
- Softer on the eyes for extended sessions

All themes persist in localStorage and transition smoothly via CSS custom properties (300ms ease).

### 3. Component Redesign

#### EquityBar (NEW)
Hero-level P&L display positioned between Header and StatsRow:
- **Flow visualization**: Bankroll $500 → Equity $XXX.XX
- **Clear P&L**: +$XX.XX (+X.XX%) with red/green color coding
- **Label clarity**: "GAIN/LOSS VS $500 START" eliminates confusion
- **Smooth animations**: AnimatedNumber with ease-out cubic (400ms)
- **Hero typography**: 28px equity, 24px P&L USD, 16px percentage
- **Theme aware**: Adapts to all 4 color schemes
- **Success metric**: Instantly answers "am I up or down on the $500?"

#### Header
- Centered block counter with monospace numbers
- Live connection pulse animation (respects prefers-reduced-motion)
- Theme switcher integrated as segmented control
- Wallet button with copy feedback
- Model badge (jev or stand-in)

#### StatsRow
- Cleaner metric tiles with label/value hierarchy
- Monospace values with unit suffixes
- Reduced visual noise

#### DecisionPanel
- Sharp flicker animation on decision updates (250-300ms)
- Glowing bar charts with box-shadow
- Active/inactive state transitions
- 60-block strip placeholder (for future implementation)

#### Feed (Trade Tape)
- Professional blotter layout
- Smooth row slide-in animation (250ms)
- Hover states on rows
- Grid-based column alignment
- Filled trades highlighted
- Transaction links with pending/confirmed states

#### FlowChart
- Refined SVG animations
- Ripple effect on latest fill
- Cell pop animation on new blocks
- Smooth price tag tracking
- Hover tooltip with trade details
- GPU-accelerated transforms

### 4. Performance
All animations use GPU-friendly properties only:
- `transform` for position changes
- `opacity` for fades
- `will-change` hints on animated elements
- No layout thrashing
- Tabular numerals prevent width shifts

### 5. Responsive Design
Breakpoints maintained:
- Desktop 16:9 primary (≥900px)
- Tablet (600px-899px): vertical stack with adjusted sizing
- Mobile (≤600px): single column, reduced font sizes

### 6. Accessibility
- `prefers-reduced-motion` respected throughout
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus-visible outlines
- Screen reader friendly

## Testing

### Local Development
```bash
cd web
bun install  # or npm install
bun run dev  # or npm run dev
```

Visit http://localhost:3000

### Theme Switching
Click any theme button in the header. Selection persists across sessions.

### Connection States
- **Live**: Green pulse animation
- **Connecting/Reconnecting**: Yellow status text

### Visual Verification
1. **P&L visibility**: Can you instantly see if up or down on the $500?
2. **Dark theme**: Should feel like a prop desk terminal
3. **Light theme**: Clean institutional, no cartoon colors
4. **Bloomberg**: Iconic amber aesthetic
5. **Midnight**: Premium dark with indigo/violet accents
6. **Animations**: At ~3.3 Hz block rate, UI should stay butter-smooth
7. **Number stability**: Counters shouldn't jitter as values change
8. **EquityBar**: Smooth number transitions, clear red/green P&L

## Files Changed
- `web/src/app/page.tsx` - Integrated EquityBar
- `web/src/components/EquityBar/*` - NEW prominent P&L display
- `web/src/components/AnimatedNumber/*` - Smooth number transitions
- `web/src/app/layout.tsx` - IBM Plex fonts
- `web/src/app/globals.css` - Theme system with 4 themes
- `web/src/app/page.module.css` - Updated layout grid
- `web/src/components/ThemeSwitcher/*` - New theme switcher
- `web/src/components/Header/*` - Institutional header redesign
- `web/src/components/StatsRow/*` - Cleaner metrics
- `web/src/components/DecisionPanel/*` - Sharp decision display
- `web/src/components/Feed/*` - Professional trade blotter
- `web/src/components/FlowChart/*` - Refined chart animations

## Future Enhancements
- Add keyboard shortcuts for theme switching (T key)
- Add chart zoom controls if requested
- Consider additional themes (Jane Street green, Citadel blue)
- Consider making bankroll configurable via NEXT_PUBLIC_BANKROLL_USD env var

## Design Principles Preserved
- One screen, no navigation
- Motion is content (3.3 Hz block updates)
- Everything shown is verifiable
- Legible in compressed 1080p clips and at phone width
- Restraint: no gradients, no decorative elements
- Honest: losses shown as plainly as gains
- Screen-recordable: no hover-only meaning
