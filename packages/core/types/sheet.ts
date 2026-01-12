export type SheetSide = "top" | "right" | "bottom" | "left"

export interface SheetProps {
    open?: boolean
    side?: SheetSide
}

export interface SheetContext {
    is_open: boolean
    side: SheetSide
    open: () => void
    close: () => void
}
