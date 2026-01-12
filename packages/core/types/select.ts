import type { ComputedRef, InjectionKey, Ref } from "vue"

export type SelectSize = "sm" | "md" | "lg"

export interface SelectProps {
    size?: SelectSize
    disabled?: boolean
    placeholder?: string
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

export interface SelectTriggerReturn {
    base_classes: ComputedRef<string>
    is_disabled: ComputedRef<boolean>
}

export interface SelectContentReturn {
    base_classes: ComputedRef<string>
}

export interface SelectItemReturn {
    base_classes: ComputedRef<string>
    is_selected: ComputedRef<boolean>
    is_disabled: ComputedRef<boolean>
}
