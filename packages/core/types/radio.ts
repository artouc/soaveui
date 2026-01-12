import type { ComputedRef, InjectionKey, Ref, DeepReadonly } from "vue"

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

/**
 * ラジオボタンの状態（StyleAdapterに渡す用）
 */
export interface RadioItemState {
    size: RadioSize
    disabled: boolean
    checked: boolean
}

export interface RadioAriaAttributes {
    role: "radio"
    "aria-checked": boolean
    "aria-disabled"?: boolean
}

/**
 * useRadioItem の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface RadioItemReturn {
    state: DeepReadonly<ComputedRef<RadioItemState>>
    aria_attributes: DeepReadonly<ComputedRef<RadioAriaAttributes>>
}
