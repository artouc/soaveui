import { ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from "vue"
import type { PopoverSide, PopoverAlign } from "../types/popover"

export interface UsePopoverProps {
    side?: PopoverSide
    align?: PopoverAlign
    modal?: boolean
}

export interface UsePopoverReturn {
    is_open: Ref<boolean>
    trigger_ref: Ref<HTMLElement | null>
    content_ref: Ref<HTMLElement | null>
    popover_id: string
    position_styles: ComputedRef<Record<string, string>>
    open: () => void
    close: () => void
    toggle: () => void
    handleTriggerClick: () => void
    handleKeyDown: (event: KeyboardEvent) => void
}

let popover_counter = 0

export function usePopover(props: Ref<UsePopoverProps>): UsePopoverReturn {
    const is_open = ref(false)
    const trigger_ref = ref<HTMLElement | null>(null)
    const content_ref = ref<HTMLElement | null>(null)
    const popover_id = `popover-${++popover_counter}`

    const open = (): void => {
        is_open.value = true
    }

    const close = (): void => {
        is_open.value = false
    }

    const toggle = (): void => {
        is_open.value = !is_open.value
    }

    const handleTriggerClick = (): void => {
        toggle()
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Escape" && is_open.value) {
            close()
            trigger_ref.value?.focus()
        }
    }

    const handleClickOutside = (event: MouseEvent): void => {
        if (!is_open.value) return

        const target = event.target as Node
        const trigger = trigger_ref.value
        const content = content_ref.value

        if (trigger && trigger.contains(target)) return
        if (content && content.contains(target)) return

        close()
    }

    const position_styles = computed<Record<string, string>>(() => {
        if (!trigger_ref.value || !is_open.value) {
            return {}
        }

        const side = props.value.side ?? "bottom"
        const align = props.value.align ?? "center"
        const offset = 8

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

    onMounted(() => {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
    })

    onUnmounted(() => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleKeyDown)
    })

    return {
        is_open,
        trigger_ref,
        content_ref,
        popover_id,
        position_styles,
        open,
        close,
        toggle,
        handleTriggerClick,
        handleKeyDown
    }
}
