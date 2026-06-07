# E-Ink Web Design Specification

## Core Principle: Maximum Readability on E-Ink Displays

### Color Rules

**Non-negotiable: All text must be pure black (#000000)**

E-ink displays have limited contrast and grayscale rendering. Light colors (gray, light gray) become invisible or extremely difficult to read. This is a hard constraint, not a preference.

#### Text Colors
- **Primary text**: `#000000` (pure black)
- **Secondary text**: `#000000` (same as primary)
- **Labels, captions, metadata**: `#000000` (same as primary)
- **Disabled text**: `#000000` with reduced opacity if needed, but prefer keeping full opacity

#### Background Colors
- **Primary background**: `#ffffff` (pure white)
- **Active/selected states**: `#000000` background with `#ffffff` text (inverted)
- **Borders**: `#000000` (2px solid)

#### What NOT to use
- `--gray` (#555555) - TOO LIGHT, invisible on e-ink
- `--light-gray` (#999999) - TOO LIGHT, invisible on e-ink
- `text-[#333]` - TOO LIGHT
- `text-[#555]` - TOO LIGHT
- `text-[#888]` - TOO LIGHT
- `text-[#ccc]` - TOO LIGHT
- `color: '#bbb'` - TOO LIGHT
- `text-gray-400` - TOO LIGHT
- Any rgba/hsla with low opacity for text

### Typography

- Use high-contrast black text on white background
- Minimum font size: 11px for labels, 12px for body
- Bold weights for emphasis (font-bold, font-black)
- Monospace for numbers and times (font-mono)

### Layout

- 2px solid black borders for structure
- Clear visual hierarchy through size and weight, not color
- Adequate spacing (padding, margins) for touch targets

### Why This Matters

E-ink displays:
- Refresh slowly (ghosting visible with low contrast)
- Have limited grayscale range (16 levels typical)
- Are used in bright ambient light (needs high contrast)
- Prioritize readability over aesthetics

**Rule: If you can't read it at arm's length on the actual device, it's not dark enough.**
