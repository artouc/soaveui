export type SheetSide = "top" | "right" | "bottom" | "left"

export interface SheetProps {
    open?: boolean
    side?: SheetSide
    showCloseButton?: boolean
    class?: string
    unstyled?: boolean
}

export interface SheetHeaderProps {
    class?: string
    unstyled?: boolean
}

export interface SheetTitleProps {
    class?: string
    unstyled?: boolean
}

export interface SheetDescriptionProps {
    class?: string
    unstyled?: boolean
}

export interface SheetFooterProps {
    class?: string
    unstyled?: boolean
}

export interface SheetContext {
    is_open: boolean
    side: SheetSide
    open: () => void
    close: () => void
}
