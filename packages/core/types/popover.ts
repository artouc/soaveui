export type PopoverSide = "top" | "right" | "bottom" | "left"
export type PopoverAlign = "start" | "center" | "end"

export interface PopoverProps {
    side?: PopoverSide
    align?: PopoverAlign
    modal?: boolean
}

export interface PopoverContext {
    is_open: boolean
    popover_id: string
    trigger_ref: HTMLElement | null
    open: () => void
    close: () => void
    toggle: () => void
}
