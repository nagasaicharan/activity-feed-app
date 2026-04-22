# UI Component Library Documentation

## Overview

Activity Feed App ships its own **Atomic Design component library** under the `ui/` folder. All components are re-exported through a single barrel (`ui/index.ts`) and accessible via the `@ui` path alias. This keeps import paths clean and the library boundary explicit.

```typescript
// ✅ Clean — import from the library barrel
import { Text, View, Image, tw } from '@ui';
import { Header, Button } from '@ui';

// ❌ Avoid — direct file references bypass the library contract
import Text from '../../ui/atoms/Text';
```

---

## Why a Dedicated UI Folder?

The `ui/` folder is a deliberate architectural boundary. Its purpose is to:

1. **Decouple presentational concerns from feature logic** — feature components import from `@ui`, not from React Native directly.
2. **Enable design-system-wide changes** — swapping a primitive (e.g., adding a default `allowFontScaling={false}` to all `Text`) requires editing one file.
3. **Provide a typed, documented contract** — consumers don't need to know whether `Text` is a thin wrapper or a fully custom component.
4. **Support theming** — the configured `tw` instance lives here and is shared across the whole app.

---

## Atomic Design Hierarchy

```
ui/
├── index.ts              # Single barrel export
├── tw.ts                 # Configured twrnc instance (theme + device context)
│
├── atoms/                # Smallest indivisible building blocks
│   ├── index.ts
│   ├── Text.tsx          # Wraps RN Text
│   ├── View.tsx          # Wraps RN View
│   └── Image.tsx         # Wraps RN Image
│
├── molecules/            # Compositions of atoms with behaviour
│   ├── index.ts
│   ├── Header.tsx        # App header with back button and safe area
│   ├── UserCard.tsx      # User identity card
│   ├── FixedActionButton.tsx
│   └── Button/
│       ├── index.ts
│       ├── Primary.tsx
│       └── Secondary.tsx
│
└── views/                # Full-featured form/input widgets
    ├── index.ts
    ├── TextField.tsx
    ├── DropdownField.tsx
    └── RadioFields.tsx
```

### Atoms
Thin, zero-behaviour wrappers around React Native primitives. They exist purely to give the codebase a single point of extension:

| Component | Wraps | Purpose |
|-----------|-------|---------|
| `Text` | `RN.Text` | Typography primitive |
| `View` | `RN.View` | Layout primitive |
| `Image` | `RN.Image` | Image primitive |

### Molecules
Reusable UI building blocks that combine atoms and carry layout / interaction behaviour but no application state:

| Component | Description |
|-----------|-------------|
| `Header` | Screen header with back button, title, optional right slot, and safe area top inset |
| `Button.Primary` | Primary CTA button (filled, brand colour) |
| `Button.Secondary` | Secondary action button (outlined) |
| `UserCard` | Avatar + name + email row |
| `FixedActionButton` | Floating action button pinned to the bottom of a screen |

### Views
Controlled input components designed for form use:

| Component | Description |
|-----------|-------------|
| `TextField` | Single-line or multi-line text input with label and error state |
| `DropdownField` | Modal-backed option picker |
| `RadioFields` | Horizontal or vertical radio button group |

---

## Styling: Why twrnc

### The Problem with Traditional React Native Styling

`StyleSheet.create()` forces styles into separate objects, breaking the connection between markup and its visual presentation:

```typescript
// ❌ Traditional — read JSX, then scroll down to find the style
<View style={styles.card}>
  <Text style={styles.title}>Hello</Text>
</View>

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 15, fontWeight: '600', color: '#18181b' },
});
```

### The twrnc Solution

**twrnc** ports Tailwind CSS utility classes to React Native. Styles live inline in JSX, co-located with the markup they describe:

```typescript
// ✅ twrnc — intent is immediately visible
<View style={tw`mb-3 rounded-2xl bg-white px-4 pb-3 pt-3`}>
  <Text style={tw`text-[15px] font-semibold leading-5 text-zinc-900`}>Hello</Text>
</View>
```

### Why twrnc Over NativeWind

| Concern | twrnc | NativeWind |
|---------|-------|-----------|
| Runtime behaviour | Computes styles at runtime from class strings | Requires Babel transform + PostCSS build step |
| Expo compatibility | Zero config — works with any Metro setup | Requires metro config changes |
| Arbitrary values | `text-[15px]`, `tracking-[1.2px]` ✅ | Same ✅ |
| Type safety | Full TypeScript — `tw` returns a `StyleProp` | Same ✅ |
| Device context | `useDeviceContext(tw)` enables responsive `dark:` and `platform:` variants | `useColorScheme` is manual |

**twrnc was chosen because it requires zero build configuration and works identically on web and native** — critical for an Expo managed workflow targeting three platforms.

### Configured Instance

The app creates a single `tw` instance in `ui/tw.ts` and shares it across all components:

```typescript
// ui/tw.ts
import { create } from 'twrnc';
import colors from '../src/theme/colors';

const tw = create({
  theme: {
    extend: {
      colors,       // Brand colors (primary, etc.)
    },
  },
});

export default tw;
```

`useDeviceContext(tw)` is called once in `AppProviders` to enable responsive and dark-mode variants globally.

### Common Utility Patterns

```typescript
// Layout
tw`flex-1 flex-row items-center justify-between`

// Spacing
tw`px-4 py-3 mt-2 mb-4 gap-2`

// Typography
tw`text-[15px] font-semibold leading-5 text-zinc-900`
tw`text-xs text-zinc-500`

// Backgrounds & borders
tw`bg-white rounded-2xl border border-zinc-100`

// Conditional styles — combine tw results in an array
[tw`rounded-2xl px-3 py-3`, isActive ? tw`bg-emerald-50` : tw`bg-white`]

// Arbitrary values
tw`text-[13px] tracking-[1.2px]`

// Platform adaptive (web max-width container)
Platform.OS === 'web' ? { width: '100%', maxWidth: 760, alignSelf: 'center' } : null
```

---

## Usage Examples

### Importing from the library

```typescript
import { Text, View, Image, tw } from '@ui';
// or
import { Header, Button } from '@ui';
```

### Using atoms

```typescript
import { Text, View, Image, tw } from '@ui';

function MyComponent() {
  return (
    <View style={tw`flex-1 bg-zinc-50 p-4`}>
      <Image source={{ uri: user.avatarUrl }} style={tw`h-12 w-12 rounded-full`} />
      <Text style={tw`text-[15px] font-semibold text-zinc-900`}>{user.name}</Text>
    </View>
  );
}
```

### Using molecules

```typescript
import { Header } from '@ui';

function MyScreen() {
  return (
    <>
      <Header title="Activity Detail" showBackButton />
      {/* screen content */}
    </>
  );
}
```

### Conditional styling

```typescript
// Array syntax — React Native accepts arrays of StyleProp
<Pressable
  style={[
    tw`mb-3 flex-row items-center rounded-2xl px-3 py-3`,
    isActive ? tw`bg-emerald-50` : tw`bg-white`,
  ]}
>
```
