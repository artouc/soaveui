# Vue UI Composer - 完全ヘッドレス化 実装ガイド v2.1

**Version**: 2.1.0  
**Date**: 2026-01-12  
**Status**: 実装フェーズ

---

## 概要

Vue UI Composer を **完全ヘッドレス化** し、スタイル層を独立したパッケージに分離する実装手順です。

**核心設計**:
- ✅ `@soave/ui`: ロジック + ARIA属性のみ（スタイル情報ゼロ）
- ✅ `@soave/tailwind`: Core に依存し、Tailwind スタイルを提供
- ✅ `@soave/variables`: Core に依存し、CSS Variables スタイルを提供
- ✅ ユーザーが好きなスタイルシステムを選択可能

---

## パッケージ依存関係図

```
@soave/ui
├── composables (useButton, useInput...)
├── components/headless (HeadlessButton...)
├── types
└── utils

  ↑ ↑ ↑
  依存 依存 依存

@soave/tailwind              @soave/variables         カスタム実装
├── Button.vue           ├── Button.vue            ├── MyButton.vue
├── Input.vue            ├── Input.vue             └── ...
├── Card.vue             └── ...
└── tailwind.config.js
   （Tailwind設定）       （CSS Variables設定）      （任意）
```

**重要**: `@soave/tailwind` と `@soave/variables` は **Core に依存する**が、**Core は Style に依存しない**（一方向依存）

---

## Phase 1: Core Package の Headless 化（2週間）

### Step 1.1: Composable - 状態とARIA属性のみ

#### useButton

```typescript
// packages/core/composables/useButton.ts
import { computed, readonly, type Ref } from 'vue';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface ButtonState {
  variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  type: 'button' | 'submit' | 'reset';
}

/**
 * ✅ 返すのは「状態」と「ARIA属性」だけ
 * スタイル情報は一切含まない
 */
export const useButton = (props: Ref<ButtonProps>) => {
  const state = computed((): ButtonState => ({
    variant: props.value.variant ?? 'primary',
    size: props.value.size ?? 'md',
    disabled: props.value.disabled ?? false,
    type: props.value.type ?? 'button'
  }));

  const ariaAttributes = computed(() => ({
    'aria-disabled': state.value.disabled,
    role: 'button',
    type: state.value.type
  }));

  return {
    state: readonly(state),
    ariaAttributes: readonly(ariaAttributes)
  };
};
```

#### useInput

```typescript
// packages/core/composables/useInput.ts
export interface InputProps {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  id?: string;
  type?: string;
}

export interface InputState {
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  error?: string;
}

export const useInput = (props: Ref<InputProps>) => {
  const state = computed((): InputState => ({
    size: props.value.size ?? 'md',
    disabled: props.value.disabled ?? false,
    error: props.value.error
  }));

  const ariaAttributes = computed(() => ({
    'aria-disabled': state.value.disabled,
    'aria-invalid': !!state.value.error,
    'aria-describedby': state.value.error 
      ? `${props.value.id}-error` 
      : undefined
  }));

  return {
    state: readonly(state),
    ariaAttributes: readonly(ariaAttributes)
  };
};
```

#### useDialog, useCheckbox, useSelect, useForm

他の Composable も同じパターン（状態 + ARIA属性のみ）

### Step 1.2: Headless Components

#### HeadlessButton

```vue
<!-- packages/core/components/headless/Button.vue -->
<template>
  <button
    :disabled="composable.state.value.disabled"
    v-bind="composable.ariaAttributes.value"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useButton, type ButtonProps } from '~/composables/useButton';

defineProps<ButtonProps>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const composable = useButton(toRefs(defineProps<ButtonProps>()));
</script>

<style scoped>
/* ✅ スタイルなし */
</style>
```

**特徴**:
- `class` 属性なし（ユーザーが完全に制御）
- ロジック・ARIA・イベントハンドリングのみ
- シンプルで予測可能

#### HeadlessInput

```vue
<!-- packages/core/components/headless/Input.vue -->
<template>
  <input
    :value="modelValue"
    :disabled="composable.state.value.disabled"
    v-bind="composable.ariaAttributes.value"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useInput, type InputProps } from '~/composables/useInput';

interface HeadlessInputProps extends InputProps {
  modelValue?: string;
}

defineProps<HeadlessInputProps>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const composable = useInput(toRefs(defineProps<HeadlessInputProps>()));
</script>

<style scoped>
/* ✅ スタイルなし */
</style>
```

#### HeadlessCard, HeadlessDialog 等

同じパターンで実装

### Step 1.3: Index ファイル

```typescript
// packages/core/composables/index.ts
export { useButton, type ButtonProps, type ButtonState } from './useButton';
export { useInput, type InputProps, type InputState } from './useInput';
export { useDialog, type DialogProps, type DialogState } from './useDialog';
export { useCheckbox, type CheckboxProps } from './useCheckbox';
export { useSelect, type SelectProps } from './useSelect';
export { useForm } from './useForm';

// packages/core/components/index.ts
export { default as HeadlessButton } from './headless/Button.vue';
export { default as HeadlessInput } from './headless/Input.vue';
export { default as HeadlessCard } from './headless/Card.vue';
export { default as HeadlessDialog } from './headless/Dialog.vue';
export { default as HeadlessCheckbox } from './headless/Checkbox.vue';
export { default as HeadlessSelect } from './headless/Select.vue';
```

---

## Phase 2: @soave/tailwind Package（1週間）

### Step 2.1: 構成

```
packages/style/
├── components/
│   ├── Button.vue       ← HeadlessButton + Tailwind classes
│   ├── Input.vue
│   ├── Card.vue
│   └── Dialog.vue
├── styles/              ← 追加スタイル（任意）
├── tailwind.config.js   ← Tailwind 設定
├── package.json
└── README.md
```

### Step 2.2: Styled Components - Tailwind ベース

#### Button.vue

```vue
<!-- packages/style/components/Button.vue -->
<template>
  <HeadlessButton
    :class="computedClasses"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </HeadlessButton>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HeadlessButton } from '@soave/ui';
import type { ButtonProps } from '@soave/ui/composables/useButton';

interface StyledButtonProps extends ButtonProps {
  class?: string;
}

const props = withDefaults(defineProps<StyledButtonProps>(), {
  variant: 'primary',
  size: 'md'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// ✅ スタイル生成ロジックはここだけ
const computedClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };

  return [
    base,
    variants[props.variant],
    sizes[props.size],
    props.disabled && 'opacity-50 cursor-not-allowed disabled:pointer-events-none',
    props.class
  ]
    .filter(Boolean)
    .join(' ');
});
</script>
```

**特徴**:
- ✅ `@soave/ui` の `HeadlessButton` を使用
- ✅ Tailwind クラスを追加
- ✅ `class` prop で追加カスタマイズ可能
- ✅ Core の更新に自動で対応

#### Input.vue

```vue
<!-- packages/style/components/Input.vue -->
<template>
  <div class="input-container">
    <HeadlessInput
      :class="computedClasses"
      :model-value="modelValue"
      :size="size"
      :error="error"
      :disabled="disabled"
      :id="id"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <div v-if="error" :id="`${id}-error`" class="text-sm text-destructive mt-2">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HeadlessInput } from '@soave/ui';

interface Props {
  modelValue?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  disabled?: boolean;
  class?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

const computedClasses = computed(() => {
  const base =
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors';

  const sizes = {
    sm: 'h-9 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-11 text-base'
  };

  return [
    base,
    sizes[props.size],
    props.error && 'border-destructive focus-visible:ring-destructive',
    props.disabled && 'bg-muted opacity-50 cursor-not-allowed',
    props.class
  ]
    .filter(Boolean)
    .join(' ');
});
</script>
```

#### Card.vue, Dialog.vue

同じパターンで実装

### Step 2.3: Tailwind Config

```javascript
// packages/style/tailwind.config.js
export default {
  content: [
    './components/**/*.vue',
    './pages/**/*.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 100%, 50%)',
        'primary-foreground': 'hsl(0, 0%, 100%)',
        secondary: 'hsl(0, 0%, 96%)',
        'secondary-foreground': 'hsl(0, 0%, 0%)',
        accent: 'hsl(0, 0%, 8%)',
        'accent-foreground': 'hsl(0, 0%, 100%)',
        destructive: 'hsl(0, 84%, 60%)',
        'destructive-foreground': 'hsl(0, 0%, 100%)',
        background: 'hsl(0, 0%, 100%)',
        card: 'hsl(0, 0%, 100%)',
        'card-border': 'hsl(210, 40%, 90%)',
        'card-foreground': 'hsl(0, 0%, 0%)',
        muted: 'hsl(210, 40%, 96%)',
        'muted-foreground': 'hsl(210, 40%, 40%)',
        input: 'hsl(210, 40%, 96%)',
        'input-border': 'hsl(210, 40%, 90%)',
        ring: 'hsl(210, 100%, 50%)'
      }
    }
  }
};
```

### Step 2.4: Package.json

```json
{
  "name": "@soave/tailwind",
  "version": "1.0.0",
  "description": "Tailwind CSS styled components for Vue UI Composer Core",
  "type": "module",
  "main": "./components/index.js",
  "exports": {
    ".": {
      "import": "./components/index.js"
    },
    "./components/*": {
      "import": "./components/*.vue"
    },
    "./tailwind.config.js": "./tailwind.config.js"
  },
  "dependencies": {
    "@soave/ui": "^2.0.0",
    "vue": "^3.3.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**ポイント**:
- ✅ `@soave/ui` を **dependencies** に指定
- ✅ `tailwindcss` も **dependencies**（Tailwind classes 生成に必須）
- ✅ 明示的な依存で、ユーザーが安心して使用可能

---

## Phase 3: @soave/variables Package（1週間）

### Step 3.1: 構成

```
packages/style-css/
├── components/
│   ├── Button.vue
│   ├── Input.vue
│   └── Card.vue
├── styles/
│   ├── tokens.css
│   ├── button.css
│   ├── input.css
│   └── card.css
├── package.json
└── README.md
```

### Step 3.2: CSS Variables ベースのコンポーネント

#### Button.vue

```vue
<!-- packages/style-css/components/Button.vue -->
<template>
  <HeadlessButton
    :class="['button', `button--${variant}`, `button--${size}`, props.class]"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </HeadlessButton>
</template>

<script setup lang="ts">
import { HeadlessButton } from '@soave/ui';
import type { ButtonProps } from '@soave/ui/composables/useButton';

interface StyledButtonProps extends ButtonProps {
  class?: string;
}

const props = withDefaults(defineProps<StyledButtonProps>(), {
  variant: 'primary',
  size: 'md'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
@import '../styles/button.css';
</style>
```

**特徴**:
- ✅ BEM クラス命名（`.button--primary`, `.button--md`）
- ✅ CSS ファイルは別途管理
- ✅ CSS Variables で完全カスタマイズ可能

#### styles/tokens.css

```css
/* packages/style-css/styles/tokens.css */

:root {
  /* Colors */
  --color-primary: hsl(210, 100%, 50%);
  --color-primary-foreground: hsl(0, 0%, 100%);
  --color-secondary: hsl(0, 0%, 96%);
  --color-secondary-foreground: hsl(0, 0%, 0%);
  --color-accent: hsl(0, 0%, 8%);
  --color-input: hsl(210, 40%, 96%);
  --color-card: hsl(0, 0%, 100%);
  --color-destructive: hsl(0, 84%, 60%);
  
  /* Spacing */
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  
  /* Border */
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  
  /* Typography */
  --font-weight-medium: 500;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: hsl(210, 100%, 60%);
    --color-secondary: hsl(210, 9%, 16%);
    --color-card: hsl(210, 9%, 10%);
  }
}
```

#### styles/button.css

```css
/* packages/style-css/styles/button.css */

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: all 250ms ease;
}

.button--primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}

.button--primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-secondary-foreground);
}

.button--ghost {
  background-color: transparent;
  color: var(--color-accent);
}

.button--outline {
  background-color: transparent;
  border: 1px solid var(--color-input);
  color: var(--color-accent);
}

.button--sm {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  height: 2.25rem;
}

.button--md {
  padding: var(--space-2) var(--space-4);
  font-size: 1rem;
  height: 2.5rem;
}

.button--lg {
  padding: var(--space-3) var(--space-4);
  font-size: 1.125rem;
  height: 2.75rem;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### Step 3.3: Package.json

```json
{
  "name": "@soave/variables",
  "version": "1.0.0",
  "description": "CSS Variables styled components for Vue UI Composer Core",
  "type": "module",
  "exports": {
    "./components/*": {
      "import": "./components/*.vue"
    },
    "./styles/*": {
      "import": "./styles/*.css"
    }
  },
  "dependencies": {
    "@soave/ui": "^2.0.0",
    "vue": "^3.3.0"
  }
}
```

**ポイント**:
- ✅ `@soave/ui` を **dependencies** に指定
- ✅ `tailwindcss` には依存しない（CSS のみ）
- ✅ より軽量で柔軟

---

## Phase 4: 実装パターン

### パターン A: @soave/tailwind を使用（推奨 - Tailwind）

```vue
<!-- app.vue -->
<template>
  <div>
    <Button variant="primary" size="md">
      送信
    </Button>
    
    <Input 
      v-model="email"
      type="email"
      placeholder="メールアドレス"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// ✅ @soave/tailwind から import
import Button from '@soave/tailwind/components/Button.vue';
import Input from '@soave/tailwind/components/Input.vue';

const email = ref('');
</script>
```

### パターン B: @soave/variables を使用（CSS Variables）

```vue
<!-- app.vue -->
<template>
  <div>
    <Button variant="primary" size="md">
      送信
    </Button>
  </div>
</template>

<script setup lang="ts">
// ✅ @soave/variables から import
import Button from '@soave/variables/components/Button.vue';
// CSS Variables Token を読み込む
import '@soave/variables/styles/tokens.css';
</script>
```

### パターン C: Headless + カスタム CSS

```vue
<!-- app.vue -->
<template>
  <div>
    <HeadlessButton class="my-button">
      送信
    </HeadlessButton>
  </div>
</template>

<script setup lang="ts">
// ✅ Core から直接 import
import { HeadlessButton } from '@soave/ui';
</script>

<style scoped>
.my-button {
  display: inline-flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.my-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.my-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### パターン D: 複数スタイルの混在

```vue
<!-- app.vue -->
<template>
  <div>
    <!-- @soave/tailwind から -->
    <Button variant="primary">Tailwind Button</Button>
    
    <!-- @soave/variables から -->
    <MyButton variant="secondary">CSS Vars Button</MyButton>
    
    <!-- Headless + custom -->
    <HeadlessButton class="custom-btn">Custom Button</HeadlessButton>
  </div>
</template>

<script setup lang="ts">
import Button from '@soave/tailwind/components/Button.vue';
import MyButton from '@soave/variables/components/Button.vue';
import { HeadlessButton } from '@soave/ui';
import '@soave/variables/styles/tokens.css';
</script>

<style scoped>
.custom-btn {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: 1px solid #ccc;
}
</style>
```

---

## Phase 5: CLI + Nuxt Module（1週間）

### Step 5.1: CLI コマンド

```bash
# Headless パッケージのみ
npx @vue-ui-composer/cli init --headless

# Tailwind スタイルを含める（推奨）
npx @vue-ui-composer/cli init --style tailwind

# CSS Variables スタイルを含める
npx @vue-ui-composer/cli init --style css-variables

# 両方含める
npx @vue-ui-composer/cli init --style both

# コンポーネント追加
npx @vue-ui-composer/cli add Button Input Card --style tailwind
```

### Step 5.2: Nuxt Module

```typescript
// packages/nuxt/module.ts
import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit';

interface ModuleOptions {
  /**
   * スタイル実装を選択
   * - 'tailwind': @soave/tailwind を使用
   * - 'css-variables': @soave/variables を使用
   * - 'both': 両方を使用可能
   * - 'headless': Core のみ（ユーザーがスタイル管理）
   */
  style?: 'tailwind' | 'css-variables' | 'both' | 'headless';
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@vue-ui-composer/nuxt',
    configKey: 'vueUIComposer',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },

  defaults: {
    style: 'tailwind'
  },

  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // ✅ 常に Headless コンポーネントを登録（オプション）
    addComponentsDir({
      path: resolve('../core/components/headless'),
      prefix: 'Headless'
    });

    // ✅ スタイル付きコンポーネントを登録（選択可能）
    if (options.style === 'tailwind' || options.style === 'both') {
      addComponentsDir({
        path: resolve('../style/components'),
        global: true
      });
    }

    if (options.style === 'css-variables' || options.style === 'both') {
      addComponentsDir({
        path: resolve('../style-css/components'),
        prefix: options.style === 'both' ? 'CssVars' : '', // 'both' の場合はプレフィックス
        global: true
      });
      nuxt.options.css.push(
        resolve('../style-css/styles/tokens.css')
      );
    }
  }
});
```

**使用例**:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@vue-ui-composer/nuxt'
  ],
  vueUIComposer: {
    style: 'tailwind'  // または 'css-variables', 'both', 'headless'
  }
});
```

---

## パッケージ構成図

```
vue-ui-composer/
│
├── packages/
│   ├── core/
│   │   ├── composables/
│   │   │   ├── useButton.ts
│   │   │   ├── useInput.ts
│   │   │   ├── useDialog.ts
│   │   │   ├── useCheckbox.ts
│   │   │   ├── useSelect.ts
│   │   │   ├── useForm.ts
│   │   │   └── index.ts
│   │   ├── components/headless/
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Card.vue
│   │   │   ├── Dialog.vue
│   │   │   ├── Checkbox.vue
│   │   │   ├── Select.vue
│   │   │   └── index.ts
│   │   ├── types/
│   │   ├── utils/
│   │   └── package.json
│   │
│   ├── style/                           ← Tailwind デフォルト
│   │   ├── components/
│   │   │   ├── Button.vue              ← HeadlessButton + Tailwind
│   │   │   ├── Input.vue
│   │   │   ├── Card.vue
│   │   │   ├── Dialog.vue
│   │   │   └── index.ts
│   │   ├── styles/                     ← 追加スタイル（任意）
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │       dependencies: [@soave/ui, tailwindcss]
│   │
│   ├── style-css/                      ← CSS Variables 版
│   │   ├── components/
│   │   │   ├── Button.vue              ← HeadlessButton + BEM classes
│   │   │   ├── Input.vue
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   ├── tokens.css
│   │   │   ├── button.css
│   │   │   ├── input.css
│   │   │   └── card.css
│   │   └── package.json
│   │       dependencies: [@soave/ui]
│   │
│   ├── nuxt/                           ← Nuxt Module
│   │   ├── module.ts
│   │   ├── runtime/
│   │   └── package.json
│   │
│   └── cli/                            ← CLI ツール
│       ├── commands/
│       └── package.json
│
├── docs/
│   ├── getting-started.md
│   ├── choosing-styles.md
│   ├── components/
│   └── styling/
│
└── examples/
    ├── tailwind-app/
    ├── css-vars-app/
    └── headless-app/
```

---

## 依存関係の明確性

### ✅ Core Package
- 他に依存しない（独立）
- Vue 3 のみに依存

### ✅ @soave/tailwind Package
- `@soave/ui` に依存（必須）
- `tailwindcss` に依存（必須）
- **Core が更新 → style は自動で対応**

### ✅ @soave/variables Package
- `@soave/ui` に依存（必須）
- tailwindcss には依存しない

### ✅ ユーザープロジェクト
- Core か Style（またはその両方）のいずれかを選択
- Core のみ → 完全にカスタマイズ
- Style → 即座に使用可能

---

## メリット

### 🎯 シンプル性
- **概念数**: 3つ（Core, Style, Style-CSS）
- **依存関係**: 一方向で明確
- **LLM理解度**: 非常に高い

### 💪 スケーラビリティ
- 新しいスタイルシステム追加 = 新パッケージ
- Core は一度の実装で完了
- Style パッケージは独立で進化可能

### 🎨 柔軟性
- Headless で完全カスタマイズ可能
- @soave/tailwind で即座に使用
- @soave/variables で CSS variables 活用
- 複数スタイルを同時に使用可能

### 📦 依存管理
- **dependencies** で明示的に依存関係を宣言
- ユーザーが安心して使用可能
- 更新時の影響を最小化

---

## 実装チェックリスト

### Phase 1: Core Headless 化（2週間）
- [ ] ButtonProps/State インターフェース定義
- [ ] useButton, useInput, useDialog, useCheckbox, useSelect Composable
- [ ] HeadlessButton, HeadlessInput, HeadlessCard, HeadlessDialog コンポーネント
- [ ] テスト実装

### Phase 2: @soave/tailwind（1週間）
- [ ] Button, Input, Card, Dialog Styled コンポーネント
- [ ] Tailwind Config
- [ ] Package.json（依存関係明記）
- [ ] テスト

### Phase 3: @soave/variables（1週間）
- [ ] Button, Input, Card Styled コンポーネント
- [ ] CSS Variables Token 定義
- [ ] Component スタイルシート
- [ ] テスト

### Phase 4: 使用例（1週間）
- [ ] Tailwind パターン
- [ ] CSS Variables パターン
- [ ] Headless カスタムパターン
- [ ] Mixed パターン

### Phase 5: CLI + Nuxt（1週間）
- [ ] CLI コマンド実装
- [ ] Nuxt Module 実装
- [ ] ドキュメント

---

## まとめ

**完全ヘッドレス化 + スタイルパッケージ分離**

| 特性 | 効果 |
|------|------|
| **概念の シンプル性** | ⭐⭐⭐⭐⭐ |
| **LLM親和性** | ⭐⭐⭐⭐⭐ |
| **実装期間** | 6週間（短縮） |
| **メンテナンス性** | ⭐⭐⭐⭐⭐ |
| **拡張性** | ⭐⭐⭐⭐⭐ |
| **ユーザー体験** | ⭐⭐⭐⭐⭐ |

✅ **複雑な Adapter パターンを廃止**  
✅ **Core と Style の責任を明確に分離**  
✅ **依存関係を一方向で管理**  
✅ **新しいスタイルシステムの追加が簡単**  
✅ **shadcn/ui の自由度 + Vue 3 の力**
