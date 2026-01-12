import type { ComputedRef, DeepReadonly } from "vue"

export type CardPadding = "sm" | "md" | "lg" | "none"

export interface CardProps {
    padding?: CardPadding
}

/**
 * カードの状態（StyleAdapterに渡す用）
 */
export interface CardState {
    padding: CardPadding
}

/**
 * useCard の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface CardReturn {
    state: DeepReadonly<ComputedRef<CardState>>
}

export interface CardHeaderProps {
    class?: string
    unstyled?: boolean
}

export interface CardTitleProps {
    class?: string
    unstyled?: boolean
}

export interface CardDescriptionProps {
    class?: string
    unstyled?: boolean
}

export interface CardContentProps {
    class?: string
    unstyled?: boolean
}

export interface CardFooterProps {
    class?: string
    unstyled?: boolean
}
