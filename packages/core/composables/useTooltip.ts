import { ref, computed, onUnmounted, type Ref, type ComputedRef } from "vue"
import type { TooltipSide, TooltipAlign } from "../types/tooltip"

export interface UseTooltipProps {
    side?: TooltipSide
    align?: TooltipAlign
    delay_duration?: number
    skip_delay_duration?: number
    disabled?: boolean
}

export interface UseTooltipReturn {
    is_open: Ref<boolean>
    trigger_ref: Ref<HTMLElement | null>
    content_ref: Ref<HTMLElement | null>
    tooltip_id: string
    position_styles: ComputedRef<Record<string, string>>
    show: () => void
    hide: () => void
    handleMouseEnter: () => void
    handleMouseLeave: () => void
    handleFocus: () => void
    handleBlur: () => void
}

let tooltip_counter = 0

export function useTooltip(props: Ref<UseTooltipProps>): UseTooltipReturn {
    const is_open = ref(false)
    const trigger_ref = ref<HTMLElement | null>(null)
    const content_ref = ref<HTMLElement | null>(null)
    const tooltip_id = `tooltip-${++tooltip_counter}`

    let show_timeout: ReturnType<typeof setTimeout> | null = null
    let hide_timeout: ReturnType<typeof setTimeout> | null = null

    const clearTimeouts = (): void => {
        if (show_timeout) {
            clearTimeout(show_timeout)
            show_timeout = null
        }
        if (hide_timeout) {
            clearTimeout(hide_timeout)
            hide_timeout = null
        }
    }

    const show = (): void => {
        if (props.value.disabled) return
        clearTimeouts()
        is_open.value = true
    }

    const hide = (): void => {
        clearTimeouts()
        is_open.value = false
    }

    const handleMouseEnter = (): void => {
        if (props.value.disabled) return
        clearTimeouts()

        const delay = props.value.delay_duration ?? 200
        show_timeout = setTimeout(() => {
            is_open.value = true
        }, delay)
    }

    const handleMouseLeave = (): void => {
        clearTimeouts()

        const skip_delay = props.value.skip_delay_duration ?? 100
        hide_timeout = setTimeout(() => {
            is_open.value = false
        }, skip_delay)
    }

    const handleFocus = (): void => {
        if (props.value.disabled) return
        show()
    }

    const handleBlur = (): void => {
        hide()
    }

    const position_styles = computed<Record<string, string>>(() => {
        if (!trigger_ref.value || !is_open.value) {
            return {}
        }

        const side = props.value.side ?? "top"
        const align = props.value.align ?? "center"
        const offset = 8

        // Base positioning using CSS transforms
        const styles: Record<string, string> = {
            position: "absolute",
            zIndex: "50"
        }

        // Side positioning
        switch (side) {
            case "top":
                styles.bottom = "100%"
                styles.marginBottom = `${offset}px`
                break
            case "bottom":
                styles.top = "100%"
                styles.marginTop = `${offset}px`
                break
            case "left":
                styles.right = "100%"
                styles.marginRight = `${offset}px`
                break
            case "right":
                styles.left = "100%"
                styles.marginLeft = `${offset}px`
                break
        }

        // Alignment
        if (side === "top" || side === "bottom") {
            switch (align) {
                case "start":
                    styles.left = "0"
                    break
                case "center":
                    styles.left = "50%"
                    styles.transform = "translateX(-50%)"
                    break
                case "end":
                    styles.right = "0"
                    break
            }
        } else {
            switch (align) {
                case "start":
                    styles.top = "0"
                    break
                case "center":
                    styles.top = "50%"
                    styles.transform = "translateY(-50%)"
                    break
                case "end":
                    styles.bottom = "0"
                    break
            }
        }

        return styles
    })

    onUnmounted(() => {
        clearTimeouts()
    })

    return {
        is_open,
        trigger_ref,
        content_ref,
        tooltip_id,
        position_styles,
        show,
        hide,
        handleMouseEnter,
        handleMouseLeave,
        handleFocus,
        handleBlur
    }
}
