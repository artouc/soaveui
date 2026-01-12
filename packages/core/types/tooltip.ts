import type { InjectionKey } from "vue"
import type { UseTooltipReturn } from "../composables/useTooltip"

export type TooltipSide = "top" | "right" | "bottom" | "left"
export type TooltipAlign = "start" | "center" | "end"

export interface TooltipProps {
    content: string
    side?: TooltipSide
    align?: TooltipAlign
    delay_duration?: number
    skip_delay_duration?: number
    disabled?: boolean
    class?: string
    unstyled?: boolean
}

export interface TooltipContentProps {
    class?: string
    unstyled?: boolean
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

export const TOOLTIP_CONTEXT_KEY: InjectionKey<UseTooltipReturn> = Symbol("tooltip-context")
