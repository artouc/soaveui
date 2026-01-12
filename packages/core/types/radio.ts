import type { ComputedRef, InjectionKey, Ref } from "vue"

export type RadioSize = "sm" | "md" | "lg"

export interface RadioGroupProps {
    disabled?: boolean
    orientation?: "horizontal" | "vertical"
    class?: string
    unstyled?: boolean
}

export interface RadioItemProps {
    value: string
    size?: RadioSize
    disabled?: boolean
    class?: string
    unstyled?: boolean
}

export interface RadioGroupContext {
    model_value: Ref<string>
    disabled: Ref<boolean>
    updateValue: (value: string) => void
}

export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol("radio-group")

export interface RadioAriaAttributes {
    role: "radio"
    "aria-checked": boolean
    "aria-disabled"?: boolean
}

export interface RadioItemReturn {
    base_classes: ComputedRef<string>
    indicator_classes: ComputedRef<string>
    is_checked: ComputedRef<boolean>
    is_disabled: ComputedRef<boolean>
    aria_attributes: ComputedRef<RadioAriaAttributes>
}
