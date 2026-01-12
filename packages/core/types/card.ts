import type { ComputedRef } from "vue"

export type CardPadding = "sm" | "md" | "lg" | "none"

export interface CardProps {
    padding?: CardPadding
}

export interface CardReturn {
    base_classes: ComputedRef<string>
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
