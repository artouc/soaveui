// @soave/tailwind
// Tailwind CSS styled components for soave UI
// These components depend on @soave/ui for core functionality

export * from "./components"

// Re-export types from core for convenience
export type {
    ButtonProps,
    ButtonVariant,
    ButtonSize,
    InputProps,
    InputSize,
    InputType,
    TextareaProps,
    TextareaSize,
    CardProps,
    CardPadding,
    CheckboxProps,
    CheckboxSize,
    SwitchProps,
    SwitchSize
} from "@soave/ui"
