import type { ButtonVariant, ButtonSize } from "./button"
import type { InputSize } from "./input"
import type { CardPadding } from "./card"
import type { AlertVariant } from "./alert"

/**
 * UIコンポーネントのグローバル設定
 */
export interface UIConfig {
    button: ButtonConfig
    input: InputConfig
    card: CardConfig
    alert: AlertConfig
}

export interface ButtonConfig {
    default_variant: ButtonVariant
    default_size: ButtonSize
}

export interface InputConfig {
    default_size: InputSize
}

export interface CardConfig {
    default_padding: CardPadding
}

export interface AlertConfig {
    default_variant: AlertVariant
}

/**
 * デフォルト設定
 */
export const DEFAULT_UI_CONFIG: UIConfig = {
    button: {
        default_variant: "primary",
        default_size: "md"
    },
    input: {
        default_size: "md"
    },
    card: {
        default_padding: "md"
    },
    alert: {
        default_variant: "default"
    }
}
