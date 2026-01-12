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
}

export interface CardTitleProps {
    class?: string
}

export interface CardDescriptionProps {
    class?: string
}

export interface CardContentProps {
    class?: string
}

export interface CardFooterProps {
    class?: string
}
