import type { ComputedRef, InjectionKey, Ref, DeepReadonly } from "vue"

export type SelectSize = "sm" | "md" | "lg"

export interface SelectProps {
    size?: SelectSize
    disabled?: boolean
    placeholder?: string
    unstyled?: boolean
}

export interface SelectTriggerProps {
    class?: string
    unstyled?: boolean
}

export interface SelectContentProps {
    class?: string
    unstyled?: boolean
}

export interface SelectItemProps {
    value: string
    disabled?: boolean
    class?: string
    unstyled?: boolean
}

export interface SelectValueProps {
    class?: string
    unstyled?: boolean
}

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

export interface SelectContext {
    model_value: Ref<string>
    is_open: Ref<boolean>
    disabled: Ref<boolean>
    size: Ref<SelectSize>
    placeholder: Ref<string>
    trigger_ref: Ref<HTMLElement | null>
    updateValue: (value: string) => void
    open: () => void
    close: () => void
    toggle: () => void
    setTriggerRef: (element: HTMLElement | null) => void
}

export const SELECT_KEY: InjectionKey<SelectContext> = Symbol("select")

/**
 * セレクトトリガーの状態（StyleAdapterに渡す用）
 */
export interface SelectTriggerState {
    size: SelectSize
    disabled: boolean
    is_open: boolean
}

/**
 * セレクトコンテンツの状態（StyleAdapterに渡す用）
 */
export interface SelectContentState {
    is_open: boolean
}

/**
 * セレクトアイテムの状態（StyleAdapterに渡す用）
 */
export interface SelectItemState {
    selected: boolean
    disabled: boolean
}

export interface SelectTriggerReturn {
    state: DeepReadonly<ComputedRef<SelectTriggerState>>
}

export interface SelectContentReturn {
    state: DeepReadonly<ComputedRef<SelectContentState>>
}

export interface SelectItemReturn {
    state: DeepReadonly<ComputedRef<SelectItemState>>
}
