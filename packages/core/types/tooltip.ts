export type TooltipSide = "top" | "right" | "bottom" | "left"
export type TooltipAlign = "start" | "center" | "end"

export interface TooltipProps {
    content: string
    side?: TooltipSide
    align?: TooltipAlign
    delay_duration?: number
    skip_delay_duration?: number
    disabled?: boolean
}

export interface TooltipReturn {
    is_open: boolean
    trigger_ref: HTMLElement | null
    content_styles: Record<string, string>
    show: () => void
    hide: () => void
    toggle: () => void
}

export interface TooltipAriaAttributes {
    role: "tooltip"
    id: string
}

export interface TooltipTriggerAriaAttributes {
    "aria-describedby": string
}
