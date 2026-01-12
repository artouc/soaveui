# Vue UI Composer アーキテクチャ仕様書

**Version**: 1.0.0  
**Last Updated**: 2026年1月12日  
**Status**: 設計フェーズ

---

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [コアコンセプト](#コアコンセプト)
3. [アーキテクチャ設計](#アーキテクチャ設計)
4. [フォルダ構造](#フォルダ構造)
5. [実装例](#実装例)
6. [開発ロードマップ](#開発ロードマップ)
7. [shadcn/ui との比較](#shadcnui-との比較)

---

## プロジェクト概要

### ビジョン

**Vue UI Composer** は、shadcn/ui を超える Vue.js/Nuxt.js 専用の次世代 UI フレームワークです。「人間 + LLM + Nuxt」が一体となって扱えるコンポーネントシステムを提供し、アクセシビリティ・型安全性・AI フレンドリーな設計を実現します。

### 設計哲学

1. **Composable-First**: Vue 3 Composition API の本質を活かし、すべてのロジックを再利用可能な Composable として分離
2. **Type-Safe by Default**: TypeScript + Zod による完全な型安全性
3. **LLM-Optimized**: MCP 対応と予測可能な API で、AI コーディングを最適化
4. **Nuxt-Native**: SSR・i18n・File-based routing と深く統合
5. **Code Ownership**: コンポーネントをプロジェクト内にコピーし、完全にカスタマイズ可能

---

## コアコンセプト

### なぜ shadcn/ui を超えられるか

| 特性 | shadcn/ui | Vue UI Composer |
|------|-----------|-----------------|
| **Composable の深さ** | × (React Hooks) | ⭐⭐⭐⭐⭐ (Vue 3 本来の力) |
| **フレームワーク統合** | × (汎用) | ⭐⭐⭐⭐⭐ (Nuxt 専用最適化) |
| **Type Safety** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (Zod + Composable 全層) |
| **LLM Friendliness** | ⭐⭐⭐⭐⭐ (MCP 対応) | ⭐⭐⭐⭐⭐⭐ (Composable + Schema) |
| **SSR Ready** | △ | ⭐⭐⭐⭐⭐ |

---

## アーキテクチャ設計

### 1. Composable-First Architecture

**原則**: コンポーネントロジックを Composable として完全分離

#### 設計パターン

```typescript
// composables/useButton.ts
import { computed, type Ref } from 'vue';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const useButton = (props: Ref<ButtonProps>) => {
  const isDisabled = computed(() => props.value.disabled ?? false);
  
  const classes = computed(() => ({
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input hover:bg-accent'
    }[props.value.variant ?? 'primary'],
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-11 px-8'
    }[props.value.size ?? 'md'],
    disabled: isDisabled.value ? 'opacity-50 cursor-not-allowed' : ''
  }));
  
  const ariaAttributes = computed(() => ({
    'aria-disabled': isDisabled.value,
    role: 'button'
  }));
  
  return {
    classes,
    isDisabled,
    ariaAttributes
  };
};
```

#### コンポーネント実装

```vue
<!-- components/ui/Button.vue -->
<template>
  <button
    :class="[composable.classes.base, composable.classes.variant, composable.classes.size, composable.classes.disabled]"
    :disabled="composable.isDisabled"
    v-bind="composable.ariaAttributes"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useButton, type ButtonProps } from '~/composables/useButton';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
});

const composable = useButton(toRefs(props));
</script>
```

**利点**:
- **テスト性**: Composable を単独でテスト可能
- **再利用性**: 複数コンポーネント間でロジック共有
- **型安全性**: Composable の戻り値型から自動補完
- **LLM 最適性**: シグネチャから動作を完全に推測可能

---

### 2. Provider + Context Pattern

**原則**: UI 設定を統一された Provider Context で一元管理

#### 設計パターン

```typescript
// composables/useUIConfig.ts
import { inject, provide, reactive, readonly, type InjectionKey } from 'vue';
import type { DeepPartial } from '~/types/utils';

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

export const UIConfigKey: InjectionKey<UIConfig> = Symbol('ui-config');

export const useUIProvider = (config: DeepPartial<UIConfig> = {}) => {
  const merged = reactive(deepMerge(defaultConfig, config)) as UIConfig;
  provide(UIConfigKey, merged);
  return merged;
};

export const useUI = <K extends keyof UIConfig>(component: K): Readonly<UIConfig[K]> => {
  const config = inject(UIConfigKey, defaultConfig);
  return readonly(config[component]);
};
```

#### 使用例

```vue
<!-- app.vue -->
<template>
  <UIProvider :config="{ button: { defaultVariant: 'outline' } }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UIProvider>
</template>

<script setup lang="ts">
import { useUIProvider } from '~/composables/useUIConfig';

const config = useUIProvider({
  button: { defaultVariant: 'outline' }
});
</script>
```

```vue
<!-- components/ui/Button.vue -->
<script setup lang="ts">
import { useUI } from '~/composables/useUIConfig';

const uiConfig = useUI('button');
const props = withDefaults(defineProps<ButtonProps>(), {
  variant: uiConfig.defaultVariant, // Provider から自動取得
  size: uiConfig.defaultSize
});
</script>
```

**利点**:
- **スキーマ統一**: すべてのコンポーネントが同じ `useUI` で設定
- **スコープ付け**: Form 内で Input のデフォルトサイズを自動変更など
- **LLM 最適性**: `useUI('button')` という命令形が極めて予測可能

---

### 3. Declarative Schema + Validation

**原則**: Zod スキーマによる宣言的フォーム管理

#### 設計パターン

```typescript
// composables/useForm.ts
import { reactive, computed, type Ref } from 'vue';
import { z, type ZodSchema } from 'zod';

export const useForm = <T extends ZodSchema>(schema: T) => {
  type FormData = z.infer<T>;
  
  const formState = reactive({
    values: {} as FormData,
    errors: {} as Partial<Record<keyof FormData, string>>,
    touched: {} as Partial<Record<keyof FormData, boolean>>,
    isSubmitting: false
  });
  
  const isValid = computed(() => {
    const result = schema.safeParse(formState.values);
    return result.success;
  });
  
  const validateField = (field: keyof FormData) => {
    try {
      const fieldSchema = schema.shape[field as string];
      fieldSchema.parse(formState.values[field]);
      formState.errors[field] = undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        formState.errors[field] = error.errors[0].message;
      }
    }
  };
  
  const submit = async (onSubmit: (data: FormData) => Promise<void>) => {
    formState.isSubmitting = true;
    try {
      const validatedData = schema.parse(formState.values);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const field = err.path[0] as keyof FormData;
          formState.errors[field] = err.message;
        });
      }
    } finally {
      formState.isSubmitting = false;
    }
  };
  
  return {
    values: formState.values,
    errors: readonly(formState.errors),
    touched: readonly(formState.touched),
    isValid,
    isSubmitting: readonly(computed(() => formState.isSubmitting)),
    validateField,
    submit
  };
};
```

#### 使用例

```vue
<!-- pages/login.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <FormField>
      <FormLabel for="email">メールアドレス</FormLabel>
      <FormInput
        id="email"
        v-model="form.values.email"
        type="email"
        :error="form.errors.email"
        @blur="form.validateField('email')"
      />
      <FormError v-if="form.errors.email">{{ form.errors.email }}</FormError>
    </FormField>
    
    <FormField>
      <FormLabel for="password">パスワード</FormLabel>
      <FormInput
        id="password"
        v-model="form.values.password"
        type="password"
        :error="form.errors.password"
        @blur="form.validateField('password')"
      />
      <FormError v-if="form.errors.password">{{ form.errors.password }}</FormError>
    </FormField>
    
    <Button type="submit" :disabled="!form.isValid || form.isSubmitting">
      {{ form.isSubmitting ? 'ログイン中...' : 'ログイン' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { useForm } from '~/composables/useForm';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください')
});

const form = useForm(loginSchema);

const handleSubmit = () => {
  form.submit(async (data) => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: data
    });
    navigateTo('/dashboard');
  });
};
</script>
```

**利点**:
- **バリデーション一元化**: フロント・バック同じスキーマ使用可能
- **型安全性**: `data` の型が自動的に推論される
- **LLM 最適性**: スキーマが真実の単一の源となる

---

### 4. Nuxt File-Based Routing 統合

**原則**: Route パラメータの型安全性を UI まで延伸

#### 設計パターン

```typescript
// composables/useRoute.ts
import { useRoute as _useRoute } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export const defineRoute = <T extends { params?: Record<string, string>; query?: Record<string, string> }>() => {
  const route = _useRoute() as RouteLocationNormalizedLoaded & T;
  return route;
};
```

```typescript
// composables/useBreadcrumbs.ts
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export const useBreadcrumbs = () => {
  const route = useRoute();
  
  const breadcrumbs = computed(() => {
    const paths = route.path.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + paths.slice(0, index + 1).join('/')
    }));
  });
  
  return breadcrumbs;
};
```

#### 使用例

```vue
<!-- pages/users/[id].vue -->
<template>
  <UiContainer>
    <Breadcrumbs :items="breadcrumbs" />
    
    <Card v-if="!pending">
      <CardHeader>
        <CardTitle>{{ user?.name }}</CardTitle>
        <CardDescription>{{ user?.email }}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{{ user?.bio }}</p>
      </CardContent>
    </Card>
    
    <CardSkeleton v-if="pending" />
    <CardError v-if="error" :error="error" />
  </UiContainer>
</template>

<script setup lang="ts">
import { defineRoute } from '~/composables/useRoute';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';

const route = defineRoute<{ params: { id: string } }>();
const { id } = route.params;

const { data: user, pending, error } = await useFetch(`/api/users/${id}`);
const breadcrumbs = useBreadcrumbs();

useSeoMeta({
  title: computed(() => user.value?.name ?? 'ユーザー'),
  ogTitle: computed(() => user.value?.name ?? 'ユーザー')
});
</script>
```

**利点**:
- **型安全性**: Route パラメータが完全に型推論される
- **SSR 対応**: サーバーサイドレンダリングで自動 hydration
- **メタデータ自動化**: パンくず・SEO タグが自動生成

---

### 5. MCP + Component Registry

**原則**: LLM が直接レジストリにアクセスできるスキーマを提供

#### Component Registry スキーマ

```json
{
  "version": "1.0.0",
  "framework": "vue-ui-composer",
  "components": [
    {
      "name": "Button",
      "category": "form",
      "path": "components/ui/Button.vue",
      "composable": {
        "name": "useButton",
        "path": "composables/useButton.ts"
      },
      "props": {
        "variant": {
          "type": "enum",
          "values": ["primary", "secondary", "ghost", "outline"],
          "default": "primary",
          "description": "ボタンのスタイル変種"
        },
        "size": {
          "type": "enum",
          "values": ["sm", "md", "lg"],
          "default": "md",
          "description": "ボタンのサイズ"
        },
        "disabled": {
          "type": "boolean",
          "default": false,
          "description": "無効化状態"
        }
      },
      "slots": {
        "default": {
          "description": "ボタンのテキストコンテンツ"
        }
      },
      "emits": {
        "click": {
          "description": "ボタンクリック時に発火",
          "payload": "MouseEvent"
        }
      },
      "accessibility": {
        "role": "button",
        "aria": ["aria-disabled"]
      },
      "examples": [
        {
          "title": "プライマリボタン",
          "code": "<Button variant=\"primary\">送信</Button>"
        },
        {
          "title": "ローディング状態",
          "code": "<Button :disabled=\"isLoading\">\n  {{ isLoading ? 'ローディング...' : '送信' }}\n</Button>"
        }
      ]
    }
  ],
  "patterns": {
    "login-form": {
      "description": "ログインフォームの推奨パターン",
      "components": ["FormField", "FormLabel", "FormInput", "FormError", "Button"],
      "composables": ["useForm"],
      "example": "<!-- 省略 -->"
    }
  }
}
```

#### MCP Server 実装

```typescript
// server/mcp/components.ts
import { createMCPServer } from '@modelcontextprotocol/sdk';
import componentsRegistry from '~/registry/components.json';

export const mcpServer = createMCPServer({
  name: 'vue-ui-composer',
  version: '1.0.0',
  
  tools: {
    list_components: {
      description: 'すべての利用可能なコンポーネントを一覧表示',
      handler: () => componentsRegistry.components.map(c => c.name)
    },
    
    get_component_schema: {
      description: '特定のコンポーネントの詳細スキーマを取得',
      parameters: {
        name: { type: 'string', description: 'コンポーネント名' }
      },
      handler: ({ name }) => {
        return componentsRegistry.components.find(c => c.name === name);
      }
    },
    
    search_patterns: {
      description: 'UI パターンを検索',
      parameters: {
        query: { type: 'string', description: '検索クエリ' }
      },
      handler: ({ query }) => {
        const pattern = componentsRegistry.patterns[query];
        return pattern ?? null;
      }
    },
    
    add_component: {
      description: 'プロジェクトにコンポーネントを追加',
      parameters: {
        name: { type: 'string', description: 'コンポーネント名' }
      },
      handler: async ({ name }) => {
        // CLI コマンドを実行してコンポーネントをコピー
        await execCommand(`npx vue-ui-composer add ${name}`);
        return { success: true, message: `${name} を追加しました` };
      }
    }
  }
});
```

**LLM での使用例（Claude/Cursor）**:

```
ユーザー: 「ログインフォームを作成してください」

Claude（MCP 経由）:
1. search_patterns("login-form") を実行
2. パターン定義から必要なコンポーネント一覧を取得
3. get_component_schema("FormField") で各コンポーネントの詳細取得
4. 完全な型安全コードを生成

生成結果:
<script setup lang="ts">
import { z } from 'zod';
import { useForm } from '~/composables/useForm';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const form = useForm(loginSchema);
// ...
</script>
```

---

### 6. Compound Component Pattern

**原則**: 複雑な UI（Dialog、Popover など）を階層的に構成

#### 設計パターン

```typescript
// composables/useDialog.ts
export const useDialog = () => {
  const isOpen = ref(false);
  
  const open = () => { isOpen.value = true; };
  const close = () => { isOpen.value = false; };
  const toggle = () => { isOpen.value = !isOpen.value; };
  
  return {
    isOpen: readonly(isOpen),
    open,
    close,
    toggle
  };
};
```

```vue
<!-- components/ui/Dialog.vue -->
<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/50" @click="close" />
        <div class="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { provide, inject, type InjectionKey } from 'vue';

const props = defineProps<{
  open?: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const isOpen = computed({
  get: () => props.open ?? false,
  set: (value) => emit('update:open', value)
});

const close = () => { isOpen.value = false; };

const DialogKey: InjectionKey<{ close: () => void }> = Symbol('dialog');
provide(DialogKey, { close });
</script>
```

```vue
<!-- components/ui/DialogTrigger.vue -->
<template>
  <slot :open="open" />
</template>

<script setup lang="ts">
const emit = defineEmits<{
  open: [];
}>();

const open = () => emit('open');
</script>
```

#### 使用例

```vue
<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger>
      <Button @click="isDialogOpen = true">ダイアログを開く</Button>
    </DialogTrigger>
    
    <DialogContent>
      <DialogHeader>
        <DialogTitle>確認</DialogTitle>
        <DialogDescription>この操作を実行しますか？</DialogDescription>
      </DialogHeader>
      
      <DialogFooter>
        <Button variant="outline" @click="isDialogOpen = false">キャンセル</Button>
        <Button @click="handleConfirm">確認</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
const isDialogOpen = ref(false);

const handleConfirm = () => {
  // 処理
  isDialogOpen.value = false;
};
</script>
```

---

## フォルダ構造

```
vue-ui-composer/
├── packages/
│   ├── core/                      # コアライブラリ
│   │   ├── composables/           # Composable 関数
│   │   │   ├── useButton.ts
│   │   │   ├── useForm.ts
│   │   │   ├── useDialog.ts
│   │   │   ├── useUIConfig.ts
│   │   │   └── index.ts
│   │   ├── components/            # UI コンポーネント
│   │   │   └── ui/
│   │   │       ├── Button.vue
│   │   │       ├── Input.vue
│   │   │       ├── Card.vue
│   │   │       ├── Dialog.vue
│   │   │       └── index.ts
│   │   ├── types/                 # 型定義
│   │   │   ├── components.ts
│   │   │   ├── composables.ts
│   │   │   └── index.ts
│   │   ├── utils/                 # ユーティリティ関数
│   │   │   ├── cn.ts              # クラス名マージ
│   │   │   ├── deepMerge.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── nuxt/                      # Nuxt モジュール
│   │   ├── module.ts              # Nuxt モジュール定義
│   │   ├── runtime/
│   │   │   ├── composables/
│   │   │   │   ├── useRoute.ts
│   │   │   │   ├── useBreadcrumbs.ts
│   │   │   │   └── useSeoMeta.ts
│   │   │   └── components/
│   │   │       └── UIProvider.vue
│   │   └── package.json
│   │
│   └── cli/                       # CLI ツール
│       ├── src/
│       │   ├── commands/
│       │   │   ├── add.ts         # コンポーネント追加
│       │   │   ├── init.ts        # プロジェクト初期化
│       │   │   └── index.ts
│       │   ├── utils/
│       │   │   ├── registry.ts    # レジストリ操作
│       │   │   └── templates.ts
│       │   └── index.ts
│       └── package.json
│
├── registry/                      # コンポーネントレジストリ
│   ├── components.json            # コンポーネントメタデータ
│   ├── patterns.json              # UI パターン定義
│   └── schemas/                   # JSON Schema
│       └── component.schema.json
│
├── mcp-server/                    # MCP Server
│   ├── src/
│   │   ├── server.ts              # MCP サーバー実装
│   │   ├── tools/
│   │   │   ├── components.ts
│   │   │   └── patterns.ts
│   │   └── index.ts
│   └── package.json
│
├── examples/                      # サンプルプロジェクト
│   ├── nuxt-app/
│   │   ├── pages/
│   │   ├── components/
│   │   └── nuxt.config.ts
│   └── vue-app/
│
├── docs/                          # ドキュメント
│   ├── getting-started.md
│   ├── components/
│   │   ├── button.md
│   │   ├── input.md
│   │   └── ...
│   ├── composables/
│   ├── patterns/
│   └── api-reference/
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 実装例

### 最小構成での実装（Phase 0）

#### 1. プロジェクト初期化

```bash
# CLI で初期化
npx vue-ui-composer init

# 対話形式で設定
? Tailwind CSS を使用しますか? Yes
? TypeScript を使用しますか? Yes
? インストールするコンポーネント: Button, Input, Card
```

#### 2. コンポーネント追加

```bash
# Button コンポーネントを追加
npx vue-ui-composer add button

# 複数コンポーネントを一度に追加
npx vue-ui-composer add button input card dialog
```

#### 3. 基本的な使用

```vue
<!-- app.vue -->
<template>
  <div>
    <Button variant="primary" size="md" @click="handleClick">
      クリック
    </Button>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('Button clicked!');
};
</script>
```

#### 4. フォームの実装

```vue
<!-- pages/register.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <FormField>
      <FormLabel for="name">名前</FormLabel>
      <FormInput
        id="name"
        v-model="form.values.name"
        :error="form.errors.name"
        @blur="form.validateField('name')"
      />
      <FormError v-if="form.errors.name">{{ form.errors.name }}</FormError>
    </FormField>
    
    <FormField>
      <FormLabel for="email">メールアドレス</FormLabel>
      <FormInput
        id="email"
        v-model="form.values.email"
        type="email"
        :error="form.errors.email"
        @blur="form.validateField('email')"
      />
      <FormError v-if="form.errors.email">{{ form.errors.email }}</FormError>
    </FormField>
    
    <FormField>
      <FormLabel for="password">パスワード</FormLabel>
      <FormInput
        id="password"
        v-model="form.values.password"
        type="password"
        :error="form.errors.password"
        @blur="form.validateField('password')"
      />
      <FormError v-if="form.errors.password">{{ form.errors.password }}</FormError>
    </FormField>
    
    <Button type="submit" :disabled="!form.isValid || form.isSubmitting">
      {{ form.isSubmitting ? '登録中...' : '登録' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { useForm } from '~/composables/useForm';

const registerSchema = z.object({
  name: z.string().min(2, '名前は2文字以上で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください')
});

const form = useForm(registerSchema);

const handleSubmit = () => {
  form.submit(async (data) => {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: data
    });
    navigateTo('/dashboard');
  });
};
</script>
```

---

## 開発ロードマップ

### Phase 0: 基盤構築（1-2ヶ月）

**目標**: 最小限の Composable + コンポーネントセットを提供

- **Composables**:
  - `useButton`, `useInput`, `useCard`, `useDialog`
- **Components**:
  - `Button`, `Input`, `Card`, `Dialog`, `Alert`
- **ツール**:
  - CLI 初期実装（`init`, `add` コマンド）
- **ドキュメント**:
  - Getting Started
  - コンポーネント個別ページ

**成果物**: npm パッケージ公開（@vue-ui-composer/core v0.1.0）

---

### Phase 1: MCP + Registry（1-2ヶ月）

**目標**: LLM が直接レジストリにアクセス可能に

- **Registry**:
  - `components.json` スキーマ定義
  - 全コンポーネントのメタデータ整備
- **MCP Server**:
  - `list_components`, `get_component_schema`, `add_component` 実装
  - Claude Desktop / Cursor 統合テスト
- **ドキュメント**:
  - MCP 使用ガイド
  - AI コーディングベストプラクティス

**成果物**: MCP Server 公開（@vue-ui-composer/mcp-server v1.0.0）

---

### Phase 2: Provider Pattern + Form（1ヶ月）

**目標**: UI 設定の一元化とフォーム管理の強化

- **Provider**:
  - `useUIProvider`, `useUI` 実装
  - グローバル設定とスコープ設定の両立
- **Form**:
  - `useForm` + Zod 統合
  - `FormField`, `FormLabel`, `FormInput`, `FormError` コンポーネント
  - バリデーションエラーの自動表示
- **ドキュメント**:
  - Provider 使用ガイド
  - Form パターン集

**成果物**: @vue-ui-composer/core v0.3.0

---

### Phase 3: Nuxt Deep Integration（1ヶ月）

**目標**: Nuxt SSR/i18n/Routing との完全統合

- **Nuxt Module**:
  - `@vue-ui-composer/nuxt` パッケージ
  - `defineRoute`, `useBreadcrumbs`, `useSeoMeta` 実装
  - SSR hydration 最適化
- **i18n 統合**:
  - `@nuxtjs/i18n` との統合
  - コンポーネントメッセージの多言語対応
- **ドキュメント**:
  - Nuxt 統合ガイド
  - SSR ベストプラクティス

**成果物**: @vue-ui-composer/nuxt v1.0.0

---

### Phase 4（オプション）: Design System Graph（3-6ヶ月）

**目標**: グラフベースのメタデータで LLM の理解を深化

- **Graph Schema**:
  - コンポーネント・トークン・パターンの関係性をグラフで表現
  - Neo4j / SQLite での永続化
- **LLM 統合**:
  - MCP から Graph クエリを実行
  - 「このページで使えるコンポーネント」を自動推薦
- **Figma 連携**:
  - Figma プラグインで Design System Graph と同期

**成果物**: @vue-ui-composer/graph v1.0.0

---

## shadcn/ui との比較

### 機能比較表

| 特性 | shadcn/ui | Vue UI Composer |
|------|-----------|-----------------|
| **フレームワーク** | React | Vue 3 / Nuxt 3 |
| **コード所有** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Composable API** | × (Hooks のみ) | ⭐⭐⭐⭐⭐ |
| **型安全性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (Zod統合) |
| **MCP 対応** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **SSR サポート** | △ (Next.js 依存) | ⭐⭐⭐⭐⭐ (Nuxt 統合) |
| **Form 管理** | △ (外部依存) | ⭐⭐⭐⭐⭐ (useForm 内蔵) |
| **i18n 統合** | × | ⭐⭐⭐⭐⭐ |
| **Provider Pattern** | × | ⭐⭐⭐⭐⭐ |
| **学習曲線** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **コンポーネント数** | 50+ | 20+（拡張予定） |

### shadcn/ui を超える3つのポイント

1. **Composable-First**: Vue 3 Composition API の本質を活かし、React Hooks では実現困難なロジック分離と再利用性を実現
2. **Nuxt Deep Integration**: SSR・File-based routing・i18n がライブラリレベルで統合され、フレームワークの力を最大限引き出せる
3. **Schema-Driven**: Zod + useForm で、バリデーション・型・LLM 入力がすべて同一スキーマから生成され、一貫性が保証される

---

## まとめ

Vue UI Composer は、shadcn/ui の「コード所有」「LLM フレンドリー」という強みを継承しつつ、Vue 3 Composition API と Nuxt 3 の特性を最大限活かした次世代 UI フレームワークです。

- **Composable-First** で、ロジックとUIを完全分離
- **Provider Pattern** で、UI 設定を一元管理
- **Zod + useForm** で、型安全なフォーム管理
- **MCP 対応** で、LLM が直接レジストリにアクセス
- **Nuxt Deep Integration** で、SSR・i18n・Routing を透過的に統合

4-6ヶ月の段階的実装により、実用的で拡張性の高いエコシステムを構築できます。
