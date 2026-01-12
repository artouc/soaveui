# Vue UI Composer Style Adapter System 実装ガイド

**Version**: 1.0.0  
**Date**: 2026-01-12  
**Status**: 実装フェーズ

---

## 概要

このガイドは、Headless-First アーキテクチャと Style Adapter System を Vue UI Composer に段階的に実装するための手順書です。

---

## Phase 1: Composable の Headless 化（1週間）

### Step 1.1: 型定義の準備

```typescript
// packages/core/types/composables.ts
export interface ButtonState {
  variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
}

export interface InputState {
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  error?: string;
}

export interface DialogState {
  isOpen: boolean;
}

export interface FormFieldState {
  error?: string;
  touched: boolean;
}

// 状態オブジェクトの汎用型
export interface ComponentState {
  [key: string]: any;
}

// Composable の戻り値型
export interface ComposableReturn<T extends ComponentState> {
  state: Readonly<Ref<T>>;
  ariaAttributes: Readonly<Ref<Record<string, string | boolean>>>;
}
```

### Step 1.2: useButton の Headless 化

**変更前（現在）**:
```typescript
// ❌ スタイル情報をComposableが返している
export const useButton = (props: Ref<ButtonProps>) => {
  const classes = computed(() => ({
    base: 'inline-flex...',
    variant: variantMap[props.value.variant],
    size: sizeMap[props.value.size]
  }));
  
  return { classes, isDisabled, ariaAttributes };
};
```

**変更後（Headless）**:
```typescript
// packages/core/composables/useButton.ts
import { computed, readonly, type Ref } from 'vue';
import type { ButtonState, ComposableReturn } from '../types/composables';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const useButton = (props: Ref<ButtonProps>): ComposableReturn<ButtonState> => {
  // ✅ ロジック情報のみ
  const state = computed((): ButtonState => ({
    variant: props.value.variant ?? 'primary',
    size: props.value.size ?? 'md',
    disabled: props.value.disabled ?? false
  }));
  
  const ariaAttributes = computed(() => ({
    'aria-disabled': state.value.disabled,
    role: 'button',
    type: props.value.type ?? 'button'
  }));
  
  return {
    state: readonly(state),
    ariaAttributes: readonly(ariaAttributes)
  };
};
```

### Step 1.3: 他の Composable も同様に更新

```typescript
// packages/core/composables/useInput.ts
export const useInput = (props: Ref<InputProps>): ComposableReturn<InputState> => {
  const state = computed((): InputState => ({
    size: props.value.size ?? 'md',
    disabled: props.value.disabled ?? false,
    error: props.value.error
  }));
  
  const ariaAttributes = computed(() => ({
    'aria-disabled': state.value.disabled,
    'aria-invalid': !!state.value.error,
    'aria-describedby': state.value.error ? `error-${props.value.id}` : undefined
  }));
  
  return {
    state: readonly(state),
    ariaAttributes: readonly(ariaAttributes)
  };
};

// packages/core/composables/useDialog.ts
export const useDialog = (props: Ref<DialogProps>): ComposableReturn<DialogState> => {
  const state = computed((): DialogState => ({
    isOpen: props.value.open ?? false
  }));
  
  const ariaAttributes = computed(() => ({
    role: 'dialog',
    'aria-modal': 'true'
  }));
  
  return {
    state: readonly(state),
    ariaAttributes: readonly(ariaAttributes)
  };
};

// packages/core/composables/useCheckbox.ts
// ... 同様に更新

// packages/core/composables/useSelect.ts
// ... 同様に更新
```

### Step 1.4: Composable Index の更新

```typescript
// packages/core/composables/index.ts
export { useButton, type ButtonProps } from './useButton';
export { useInput, type InputProps } from './useInput';
export { useDialog, type DialogProps } from './useDialog';
export { useCheckbox, type CheckboxProps } from './useCheckbox';
export { useSelect, type SelectProps } from './useSelect';
export { useForm } from './useForm';
export { useUIConfig } from './useUIConfig';

export type {
  ButtonState,
  InputState,
  DialogState,
  ComponentState,
  ComposableReturn
} from '../types/composables';
```

---

## Phase 2: Style Adapter System 実装（1週間）

### Step 2.1: Adapter インターフェース定義

```typescript
// packages/core/adapters/types.ts
import type { ButtonState, InputState, DialogState, ComponentState } from '../types/composables';

/**
 * Style Adapter インターフェース
 * コンポーネントの状態からスタイルクラスを生成する
 */
export interface StyleAdapter {
  /**
   * Adapter の識別名
   */
  name: 'tailwind' | 'css-variables' | 'headless' | string;
  
  /**
   * コンポーネント名と状態からクラス文字列を生成
   * @param component コンポーネント名（'button', 'input' など）
   * @param state コンポーネントの状態オブジェクト
   * @returns CSS クラス文字列
   */
  getClasses(component: string, state: ComponentState): string;
  
  /**
   * Adapter の詳細情報（オプション）
   */
  description?: string;
}

/**
 * Adapter レジストリ
 */
export const ADAPTER_REGISTRY = new Map<string, StyleAdapter>();

/**
 * Adapter を登録
 */
export const registerAdapter = (adapter: StyleAdapter) => {
  ADAPTER_REGISTRY.set(adapter.name, adapter);
};

/**
 * Adapter を取得
 */
export const getAdapter = (name: string): StyleAdapter | undefined => {
  return ADAPTER_REGISTRY.get(name);
};
```

### Step 2.2: Tailwind Adapter 実装

```typescript
// packages/core/adapters/tailwind.ts
import { cn } from '../utils/cn';
import type { StyleAdapter } from './types';
import type { ButtonState, InputState } from '../types/composables';

export const tailwindAdapter: StyleAdapter = {
  name: 'tailwind',
  description: 'Tailwind CSS ベースのスタイリング',
  
  getClasses(component: string, state) {
    switch (component) {
      case 'button':
        return getTailwindButtonClasses(state as ButtonState);
      case 'input':
        return getTailwindInputClasses(state as InputState);
      case 'card':
        return getTailwindCardClasses(state);
      case 'dialog':
        return getTailwindDialogClasses(state);
      // ... その他のコンポーネント
      default:
        return '';
    }
  }
};

function getTailwindButtonClasses(state: ButtonState): string {
  const variantMap = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeMap = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  };
  
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
    variantMap[state.variant],
    sizeMap[state.size],
    state.disabled && 'opacity-50 cursor-not-allowed'
  );
}

function getTailwindInputClasses(state: InputState): string {
  const sizeMap = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-4 text-lg'
  };
  
  return cn(
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    sizeMap[state.size],
    state.error && 'border-destructive focus-visible:ring-destructive',
    state.disabled && 'bg-muted'
  );
}

function getTailwindCardClasses(state: any): string {
  return cn(
    'rounded-lg border border-card-border bg-card text-card-foreground shadow-sm'
  );
}

function getTailwindDialogClasses(state: any): string {
  return cn(
    'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-4 shadow-lg sm:rounded-lg'
  );
}
```

### Step 2.3: CSS Variables Adapter 実装

```typescript
// packages/core/adapters/css-variables.ts
import type { StyleAdapter } from './types';

export const cssVariablesAdapter: StyleAdapter = {
  name: 'css-variables',
  description: 'CSS Variables ベースのスタイリング（BEM命名）',
  
  getClasses(component: string, state) {
    switch (component) {
      case 'button':
        return getCssVariablesButtonClasses(state);
      case 'input':
        return getCssVariablesInputClasses(state);
      case 'card':
        return getCssVariablesCardClasses(state);
      case 'dialog':
        return getCssVariablesDialogClasses(state);
      default:
        return '';
    }
  }
};

function getCssVariablesButtonClasses(state: any): string {
  return [
    'button',
    `button--${state.variant}`,
    `button--${state.size}`,
    state.disabled && 'button--disabled'
  ]
    .filter(Boolean)
    .join(' ');
}

function getCssVariablesInputClasses(state: any): string {
  return [
    'input',
    `input--${state.size}`,
    state.error && 'input--error',
    state.disabled && 'input--disabled'
  ]
    .filter(Boolean)
    .join(' ');
}

function getCssVariablesCardClasses(state: any): string {
  return 'card';
}

function getCssVariablesDialogClasses(state: any): string {
  return [
    'dialog',
    state.isOpen && 'dialog--open'
  ]
    .filter(Boolean)
    .join(' ');
}
```

### Step 2.4: Headless Adapter 実装

```typescript
// packages/core/adapters/headless.ts
import type { StyleAdapter } from './types';

export const headlessAdapter: StyleAdapter = {
  name: 'headless',
  description: 'Headless モード（スタイル適用なし）',
  
  getClasses(component: string, state): string {
    // ✅ スタイル情報を返さない
    return '';
  }
};
```

### Step 2.5: Adapter の登録と Export

```typescript
// packages/core/adapters/index.ts
import { registerAdapter } from './types';
import { tailwindAdapter } from './tailwind';
import { cssVariablesAdapter } from './css-variables';
import { headlessAdapter } from './headless';

export type { StyleAdapter } from './types';
export { tailwindAdapter, cssVariablesAdapter, headlessAdapter };

// 組み込み Adapter を登録
registerAdapter(tailwindAdapter);
registerAdapter(cssVariablesAdapter);
registerAdapter(headlessAdapter);
```

---

## Phase 3: UIProvider での Adapter 統合（1週間）

### Step 3.1: UIProvider Context の拡張

```typescript
// packages/core/composables/useUIConfig.ts
import { 
  inject, 
  provide, 
  reactive, 
  readonly, 
  type InjectionKey,
  type Ref
} from 'vue';
import type { StyleAdapter } from '../adapters/types';
import { tailwindAdapter } from '../adapters/tailwind';
import type { DeepPartial } from '../types/utils';

export interface UIConfig {
  button: {
    defaultVariant: 'primary' | 'secondary' | 'ghost' | 'outline';
    defaultSize: 'sm' | 'md' | 'lg';
  };
  input: {
    defaultSize: 'sm' | 'md' | 'lg';
  };
  card: {
    defaultPadding: 'sm' | 'md' | 'lg';
  };
}

export interface UIProviderContext {
  config: UIConfig;
  adapter: StyleAdapter;
}

const defaultConfig: UIConfig = {
  button: {
    defaultVariant: 'primary',
    defaultSize: 'md'
  },
  input: {
    defaultSize: 'md'
  },
  card: {
    defaultPadding: 'md'
  }
};

export const UIConfigKey: InjectionKey<UIProviderContext> = Symbol('ui-config');

/**
 * UIProvider を設定
 */
export const useUIProvider = (
  config: DeepPartial<UIConfig> = {},
  adapter: StyleAdapter = tailwindAdapter
) => {
  const merged = reactive(deepMerge(defaultConfig, config)) as UIConfig;
  
  const context: UIProviderContext = {
    config: merged,
    adapter
  };
  
  provide(UIConfigKey, context);
  return context;
};

/**
 * UIConfig を取得
 */
export const useUI = <K extends keyof UIConfig>(component: K): Readonly<UIConfig[K]> => {
  const context = inject<UIProviderContext>(UIConfigKey);
  if (!context) {
    console.warn(`UIProvider context not found for ${component}`);
    return readonly(defaultConfig[component]) as any;
  }
  return readonly(context.config[component]);
};

/**
 * Style Adapter を取得
 */
export const useStyleAdapter = (): StyleAdapter => {
  const context = inject<UIProviderContext>(UIConfigKey);
  if (!context) {
    console.warn('UIProvider context not found');
    return tailwindAdapter;
  }
  return context.adapter;
};
```

### Step 3.2: UIProvider コンポーネント実装

```vue
<!-- packages/nuxt/runtime/components/UIProvider.vue -->
<template>
  <slot />
</template>

<script setup lang="ts">
import { useUIProvider } from '@vue-ui-composer/core/composables/useUIConfig';
import type { StyleAdapter } from '@vue-ui-composer/core/adapters/types';
import { tailwindAdapter } from '@vue-ui-composer/core/adapters/tailwind';
import type { UIConfig } from '@vue-ui-composer/core/composables/useUIConfig';

interface Props {
  config?: Partial<UIConfig>;
  adapter?: StyleAdapter;
}

const props = withDefaults(defineProps<Props>(), {
  adapter: () => tailwindAdapter
});

// UIProvider を設定
useUIProvider(props.config, props.adapter);
</script>
```

---

## Phase 4: コンポーネント更新（2週間）

### Step 4.1: Button コンポーネント更新

```vue
<!-- packages/core/components/ui/Button.vue -->
<template>
  <button
    :class="[computedClasses, props.class]"
    :disabled="composable.state.value.disabled"
    v-bind="composable.ariaAttributes.value"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useButton, type ButtonProps } from '~/composables/useButton';
import { useStyleAdapter } from '~/composables/useUIConfig';

interface ButtonComponentProps extends ButtonProps {
  class?: string;
  unstyled?: boolean;
}

const props = withDefaults(defineProps<ButtonComponentProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  unstyled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const composable = useButton(toRefs(props));
const styleAdapter = useStyleAdapter();

// ✅ Adapter からクラスを取得
const computedClasses = computed(() => {
  if (props.unstyled) {
    return '';
  }
  return styleAdapter.getClasses('button', composable.state.value);
});
</script>
```

### Step 4.2: Input コンポーネント更新

```vue
<!-- packages/core/components/ui/Input.vue -->
<template>
  <div class="input-wrapper">
    <input
      :class="[computedClasses, props.class]"
      :disabled="composable.state.value.disabled"
      :value="modelValue"
      v-bind="composable.ariaAttributes.value"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div v-if="composable.state.value.error" :id="`error-${id}`" class="input-error">
      {{ composable.state.value.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useInput, type InputProps } from '~/composables/useInput';
import { useStyleAdapter } from '~/composables/useUIConfig';

interface InputComponentProps extends InputProps {
  modelValue?: string;
  class?: string;
  unstyled?: boolean;
}

const props = withDefaults(defineProps<InputComponentProps>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  unstyled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const composable = useInput(toRefs(props));
const styleAdapter = useStyleAdapter();

const computedClasses = computed(() => {
  if (props.unstyled) {
    return '';
  }
  return styleAdapter.getClasses('input', composable.state.value);
});
</script>
```

### Step 4.3: Card コンポーネント更新

```vue
<!-- packages/core/components/ui/Card.vue -->
<template>
  <div :class="[computedClasses, props.class]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStyleAdapter } from '~/composables/useUIConfig';

interface CardComponentProps {
  class?: string;
  unstyled?: boolean;
}

const props = withDefaults(defineProps<CardComponentProps>(), {
  unstyled: false
});

const styleAdapter = useStyleAdapter();

const computedClasses = computed(() => {
  if (props.unstyled) {
    return '';
  }
  return styleAdapter.getClasses('card', {});
});
</script>
```

### Step 4.4: 他のコンポーネントも同様に更新

- Dialog.vue
- Checkbox.vue
- Select.vue
- Textarea.vue
- Switch.vue
- RadioGroup.vue

---

## Phase 5: CSS Variables 設計（1週間）

### Step 5.1: CSS Variables Token 定義

```css
/* packages/core/styles/css-variables.css */

:root {
  /* ========== Colors ========== */
  --color-primary: hsl(210, 100%, 50%);
  --color-primary-foreground: hsl(0, 0%, 100%);
  --color-primary-hover: hsl(210, 100%, 45%);
  --color-primary-active: hsl(210, 100%, 40%);
  
  --color-secondary: hsl(0, 0%, 96%);
  --color-secondary-foreground: hsl(0, 0%, 0%);
  --color-secondary-hover: hsl(0, 0%, 90%);
  
  --color-accent: hsl(0, 0%, 8%);
  --color-accent-foreground: hsl(0, 0%, 100%);
  
  --color-destructive: hsl(0, 84%, 60%);
  --color-destructive-foreground: hsl(0, 0%, 100%);
  
  --color-input: hsl(210, 40%, 96%);
  --color-input-border: hsl(210, 40%, 90%);
  --color-input-error: hsl(0, 84%, 60%);
  
  --color-card: hsl(0, 0%, 100%);
  --color-card-border: hsl(210, 40%, 90%);
  --color-card-foreground: hsl(0, 0%, 0%);
  
  /* ========== Sizing ========== */
  --size-xs: 0.75rem;
  --size-sm: 0.875rem;
  --size-md: 1rem;
  --size-lg: 1.125rem;
  --size-xl: 1.25rem;
  
  /* ========== Spacing ========== */
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  
  /* ========== Border ========== */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  --radius-full: 9999px;
  
  --border-width-1: 1px;
  --border-width-2: 2px;
  
  /* ========== Typography ========== */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'Courier New', monospace;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* ========== Transitions ========== */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-normal: 250ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 350ms cubic-bezier(0.16, 1, 0.3, 1);
  
  /* ========== Shadows ========== */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* ========== Button Styles ========== */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  font-size: var(--size-md);
  transition: all var(--transition-normal);
  border: none;
  cursor: pointer;
  font-family: var(--font-family-base);
}

.button--primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
  border: var(--border-width-1) solid var(--color-primary);
}

.button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.button--primary:active:not(:disabled) {
  background-color: var(--color-primary-active);
}

.button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-secondary-foreground);
  border: var(--border-width-1) solid var(--color-input-border);
}

.button--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-hover);
}

.button--outline {
  background-color: transparent;
  color: var(--color-primary);
  border: var(--border-width-1) solid var(--color-input-border);
}

.button--outline:hover:not(:disabled) {
  background-color: var(--color-input);
}

.button--ghost {
  background-color: transparent;
  color: var(--color-accent);
  border: none;
}

.button--ghost:hover:not(:disabled) {
  background-color: var(--color-input);
}

.button--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--size-sm);
  height: var(--space-8);
}

.button--md {
  padding: var(--space-2) var(--space-4);
  height: var(--space-10);
}

.button--lg {
  padding: var(--space-3) var(--space-8);
  font-size: var(--size-lg);
  height: var(--space-11);
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== Input Styles ========== */
.input {
  display: flex;
  width: 100%;
  border-radius: var(--radius-md);
  border: var(--border-width-1) solid var(--color-input-border);
  background-color: var(--color-card);
  padding: var(--space-2) var(--space-3);
  font-size: var(--size-md);
  font-family: var(--font-family-base);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
}

.input--sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--size-sm);
  height: var(--space-8);
}

.input--md {
  padding: var(--space-2) var(--space-3);
  height: var(--space-10);
}

.input--lg {
  padding: var(--space-3) var(--space-4);
  font-size: var(--size-lg);
  height: var(--space-11);
}

.input--error {
  border-color: var(--color-input-error);
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-input-error), 0.1);
}

.input--disabled {
  background-color: var(--color-input);
  cursor: not-allowed;
  opacity: 0.7;
}

/* ========== Card Styles ========== */
.card {
  border-radius: var(--radius-lg);
  border: var(--border-width-1) solid var(--color-card-border);
  background-color: var(--color-card);
  color: var(--color-card-foreground);
  box-shadow: var(--shadow-sm);
}

/* ========== Dialog Styles ========== */
.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  width: 100%;
  max-width: 32rem;
  transform: translate(-50%, -50%);
  border-radius: var(--radius-lg);
  border: var(--border-width-1) solid var(--color-card-border);
  background-color: var(--color-card);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}

/* ========== Dark Mode ========== */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: hsl(210, 100%, 60%);
    --color-primary-foreground: hsl(0, 0%, 0%);
    
    --color-secondary: hsl(210, 9%, 16%);
    --color-secondary-foreground: hsl(0, 0%, 100%);
    
    --color-card: hsl(210, 9%, 10%);
    --color-card-border: hsl(210, 9%, 20%);
    --color-card-foreground: hsl(0, 0%, 100%);
    
    --color-input: hsl(210, 9%, 16%);
    --color-input-border: hsl(210, 9%, 25%);
  }
}
```

### Step 5.2: テーマ切り替え Composable

```typescript
// packages/core/composables/useTheme.ts
import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  [key: string]: string | number;
}

export const useTheme = (initialTheme: Theme = 'auto') => {
  const currentTheme = ref<Theme>(initialTheme);
  
  const systemTheme = ref<'light' | 'dark'>('light');
  
  // システムテーマを監視
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light';
    
    mediaQuery.addEventListener('change', (e) => {
      systemTheme.value = e.matches ? 'dark' : 'light';
      if (currentTheme.value === 'auto') {
        applyTheme('auto');
      }
    });
  }
  
  /**
   * テーマを適用
   */
  const applyTheme = (theme: Theme) => {
    currentTheme.value = theme;
    
    if (typeof document === 'undefined') return;
    
    const htmlElement = document.documentElement;
    const effectiveTheme = theme === 'auto' ? systemTheme.value : theme;
    
    htmlElement.setAttribute('data-theme', effectiveTheme);
    
    // local storage に保存
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('app-theme', theme);
    }
  };
  
  /**
   * カスタムテーマを設定
   */
  const setCustomTheme = (config: ThemeConfig) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(key, String(value));
    });
  };
  
  // 初期化
  watch(
    () => currentTheme.value,
    (theme) => applyTheme(theme),
    { immediate: true }
  );
  
  return {
    currentTheme,
    applyTheme,
    setCustomTheme,
    getEffectiveTheme: () => 
      currentTheme.value === 'auto' ? systemTheme.value : currentTheme.value
  };
};
```

---

## Phase 6: Nuxt Module 統合（1週間）

### Step 6.1: Nuxt Module 実装

```typescript
// packages/nuxt/module.ts
import { defineNuxtModule, createResolver, addPlugin, addComponentsDir } from '@nuxt/kit';
import type { StyleAdapter } from '@vue-ui-composer/core/adapters/types';
import { tailwindAdapter } from '@vue-ui-composer/core/adapters/tailwind';

interface ModuleOptions {
  /**
   * Style Adapter を選択
   * 'tailwind' | 'css-variables' | 'headless' | カスタム Adapter
   */
  adapter?: StyleAdapter | 'tailwind' | 'css-variables' | 'headless';
  
  /**
   * UI 設定
   */
  config?: Record<string, any>;
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
    adapter: 'tailwind'
  },
  
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    
    // ✅ CSS Variables を含める
    if (options.adapter === 'css-variables' || 
        (typeof options.adapter === 'object' && options.adapter.name === 'css-variables')) {
      nuxt.options.css.push(
        resolve('./runtime/styles/css-variables.css')
      );
    }
    
    // ✅ UIProvider コンポーネントを登録
    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: '',
      global: true
    });
    
    // ✅ Plugin を追加（Adapter を inject）
    addPlugin(resolve('./runtime/plugins/ui-provider.ts'));
  }
});
```

### Step 6.2: Nuxt Plugin

```typescript
// packages/nuxt/runtime/plugins/ui-provider.ts
import { defineNuxtPlugin } from '#app';
import { useUIProvider } from '@vue-ui-composer/core/composables/useUIConfig';
import { 
  tailwindAdapter, 
  cssVariablesAdapter, 
  headlessAdapter 
} from '@vue-ui-composer/core/adapters';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.vueUIComposer || {};
  
  let adapter = tailwindAdapter;
  
  if (typeof config.adapter === 'string') {
    const adapterMap = {
      'tailwind': tailwindAdapter,
      'css-variables': cssVariablesAdapter,
      'headless': headlessAdapter
    };
    adapter = adapterMap[config.adapter as keyof typeof adapterMap] || tailwindAdapter;
  } else if (config.adapter) {
    adapter = config.adapter;
  }
  
  // UIProvider を初期化
  useUIProvider(config.config, adapter);
});
```

---

## Phase 7: ドキュメント・テスト（2週間）

### Step 7.1: ユーザーガイド

```markdown
## Style Adapter の使用方法

### デフォルト（Tailwind CSS）

```vue
<template>
  <div>
    <Button variant="primary">送信</Button>
  </div>
</template>
```

### CSS Variables を使用

```vue
<!-- app.vue -->
<template>
  <UIProvider :adapter="cssVariablesAdapter">
    <Button variant="primary">送信</Button>
  </UIProvider>
</template>

<script setup lang="ts">
import { cssVariablesAdapter } from '@vue-ui-composer/core/adapters';
</script>
```

### Headless モード（スタイルなし）

```vue
<template>
  <Button unstyled :class="myCustomClasses">送信</Button>
</template>

<script setup lang="ts">
const myCustomClasses = 'px-4 py-2 bg-blue-500 text-white rounded';
</script>
```

### カスタム Adapter

```typescript
import type { StyleAdapter } from '@vue-ui-composer/core/adapters/types';

const bootstrapAdapter: StyleAdapter = {
  name: 'bootstrap',
  
  getClasses(component, state) {
    if (component === 'button') {
      return `btn btn-${state.variant} btn-${state.size}`;
    }
    return '';
  }
};
```
```

### Step 7.2: テスト実装

```typescript
// packages/core/__tests__/adapters.test.ts
import { describe, it, expect } from 'vitest';
import { tailwindAdapter, cssVariablesAdapter, headlessAdapter } from '../adapters';
import type { ButtonState } from '../types/composables';

describe('Style Adapters', () => {
  describe('tailwindAdapter', () => {
    it('should generate Tailwind classes for button', () => {
      const state: ButtonState = {
        variant: 'primary',
        size: 'md',
        disabled: false
      };
      
      const classes = tailwindAdapter.getClasses('button', state);
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('h-10');
    });
    
    it('should include disabled styles when disabled', () => {
      const state: ButtonState = {
        variant: 'primary',
        size: 'md',
        disabled: true
      };
      
      const classes = tailwindAdapter.getClasses('button', state);
      expect(classes).toContain('opacity-50');
      expect(classes).toContain('cursor-not-allowed');
    });
  });
  
  describe('cssVariablesAdapter', () => {
    it('should generate BEM classes', () => {
      const state: ButtonState = {
        variant: 'primary',
        size: 'md',
        disabled: false
      };
      
      const classes = cssVariablesAdapter.getClasses('button', state);
      expect(classes).toBe('button button--primary button--md');
    });
  });
  
  describe('headlessAdapter', () => {
    it('should return empty string', () => {
      const state: ButtonState = {
        variant: 'primary',
        size: 'md',
        disabled: false
      };
      
      const classes = headlessAdapter.getClasses('button', state);
      expect(classes).toBe('');
    });
  });
});
```

---

## 実装チェックリスト

### Phase 1: Composable の Headless 化
- [ ] 型定義ファイル作成
- [ ] useButton を更新
- [ ] useInput を更新
- [ ] useDialog を更新
- [ ] 他の Composable を更新
- [ ] Index ファイルを更新

### Phase 2: Style Adapter System
- [ ] Adapter インターフェース定義
- [ ] Tailwind Adapter 実装
- [ ] CSS Variables Adapter 実装
- [ ] Headless Adapter 実装
- [ ] Adapter Export

### Phase 3: UIProvider 統合
- [ ] UIConfig に Adapter 追加
- [ ] useStyleAdapter Composable 実装
- [ ] UIProvider コンポーネント実装

### Phase 4: コンポーネント更新
- [ ] Button コンポーネント更新
- [ ] Input コンポーネント更新
- [ ] Card コンポーネント更新
- [ ] Dialog コンポーネント更新
- [ ] Checkbox コンポーネント更新
- [ ] Select コンポーネント更新

### Phase 5: CSS Variables
- [ ] CSS Variables Token 定義
- [ ] useTheme Composable 実装
- [ ] ダークモード対応

### Phase 6: Nuxt Module
- [ ] Nuxt Module 実装
- [ ] Plugin 実装
- [ ] CSS 読み込み設定

### Phase 7: ドキュメント・テスト
- [ ] ユーザーガイド作成
- [ ] API リファレンス作成
- [ ] テスト実装
- [ ] 統合テスト実装

---

## 移行ガイド（既存プロジェクト向け）

### v0.2 → v0.3 移行

**Breaking Changes:**
- Composable の `classes` プロパティが廃止
- コンポーネントは自動的に `styleAdapter` から classes を取得

**アップデート手順:**

1. **UIProvider を追加**
```vue
<!-- app.vue -->
<UIProvider :adapter="tailwindAdapter">
  <App />
</UIProvider>
```

2. **コンポーネント側の修正は不要**（自動的に適用されます）

3. **カスタムスタイルの場合**
```vue
<!-- 以前 -->
<Button :class="customClass" />

<!-- 以後（変更なし）-->
<Button :class="customClass" />

<!-- または新しい方法 -->
<Button unstyled :class="customClass" />
```

---

## トラブルシューティング

### Q: Adapter が反映されない

```typescript
// ✅ 解決策：UIProvider を最上位に配置
<UIProvider :adapter="myAdapter">
  <App />
</UIProvider>
```

### Q: CSS Variables が効かない

```typescript
// ✅ 解決策：CSS ファイルが読み込まれているか確認
import '@vue-ui-composer/core/styles/css-variables.css';
```

### Q: カスタム Adapter を作成したい

```typescript
// ✅ インターフェースに従う
const myAdapter: StyleAdapter = {
  name: 'my-custom',
  getClasses(component, state) {
    // コンポーネントと状態からクラス生成
    return '';
  }
};
```

---

## 参考リンク

- [Architecture Doc](./vue-ui-composer-arch.md)
- [Styling Strategy](./styling_strategy.md)
- [Adapter Types](../packages/core/adapters/types.ts)
