import type { ComputedRef } from "vue"

export type SwitchSize = "sm" | "md" | "lg"

export interface SwitchProps {
    size?: SwitchSize
    disabled?: boolean
}

export interface SwitchAriaAttributes {
    role: "switch"
    "aria-checked": boolean
    "aria-disabled"?: boolean
}

export interface SwitchReturn {
    track_classes: ComputedRef<string>
    thumb_classes: ComputedRef<string>
    is_disabled: ComputedRef<boolean>
    aria_attributes: ComputedRef<SwitchAriaAttributes>
}
