export type DropdownSide = "top" | "right" | "bottom" | "left"
export type DropdownAlign = "start" | "center" | "end"

export interface DropdownProps {
    side?: DropdownSide
    align?: DropdownAlign
    class?: string
    unstyled?: boolean
}

export interface DropdownContentProps {
    class?: string
    unstyled?: boolean
}

export interface DropdownItemProps {
    disabled?: boolean
    destructive?: boolean
    class?: string
    unstyled?: boolean
}

export interface DropdownContext {
    is_open: boolean
    dropdown_id: string
    active_item_index: number
    items_count: number
    trigger_ref: HTMLElement | null
    open: () => void
    close: () => void
    toggle: () => void
    registerItem: () => number
    setActiveItem: (index: number) => void
}

export interface DropdownItemContext {
    index: number
    is_active: boolean
    is_disabled: boolean
}
