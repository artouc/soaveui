import { ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from "vue"
import type { DropdownSide, DropdownAlign } from "../types/dropdown"

export interface UseDropdownProps {
    side?: DropdownSide
    align?: DropdownAlign
}

export interface UseDropdownReturn {
    is_open: Ref<boolean>
    trigger_ref: Ref<HTMLElement | null>
    content_ref: Ref<HTMLElement | null>
    dropdown_id: string
    active_item_index: Ref<number>
    items_count: Ref<number>
    position_styles: ComputedRef<Record<string, string>>
    open: () => void
    close: () => void
    toggle: () => void
    handleTriggerClick: () => void
    handleTriggerKeyDown: (event: KeyboardEvent) => void
    handleContentKeyDown: (event: KeyboardEvent) => void
    registerItem: () => number
    setActiveItem: (index: number) => void
}

let dropdown_counter = 0

export function useDropdown(props: Ref<UseDropdownProps>): UseDropdownReturn {
    const is_open = ref(false)
    const trigger_ref = ref<HTMLElement | null>(null)
    const content_ref = ref<HTMLElement | null>(null)
    const dropdown_id = `dropdown-${++dropdown_counter}`
    const active_item_index = ref(-1)
    const items_count = ref(0)
    let item_counter = 0

    const open = (): void => {
        is_open.value = true
        active_item_index.value = 0
    }

    const close = (): void => {
        is_open.value = false
        active_item_index.value = -1
    }

    const toggle = (): void => {
        if (is_open.value) {
            close()
        } else {
            open()
        }
    }

    const handleTriggerClick = (): void => {
        toggle()
    }

    const handleTriggerKeyDown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "Enter":
            case " ":
            case "ArrowDown":
                event.preventDefault()
                open()
                break
            case "ArrowUp":
                event.preventDefault()
                open()
                active_item_index.value = items_count.value - 1
                break
        }
    }

    const handleContentKeyDown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault()
                active_item_index.value = Math.min(active_item_index.value + 1, items_count.value - 1)
                break
            case "ArrowUp":
                event.preventDefault()
                active_item_index.value = Math.max(active_item_index.value - 1, 0)
                break
            case "Home":
                event.preventDefault()
                active_item_index.value = 0
                break
            case "End":
                event.preventDefault()
                active_item_index.value = items_count.value - 1
                break
            case "Escape":
                event.preventDefault()
                close()
                trigger_ref.value?.focus()
                break
            case "Tab":
                close()
                break
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

    const registerItem = (): number => {
        const index = item_counter++
        items_count.value = item_counter
        return index
    }

    const setActiveItem = (index: number): void => {
        active_item_index.value = index
    }

    const position_styles = computed<Record<string, string>>(() => {
        if (!trigger_ref.value || !is_open.value) {
            return {}
        }

        const side = props.value.side ?? "bottom"
        const align = props.value.align ?? "start"
        const offset = 4

        const styles: Record<string, string> = {
            position: "absolute",
            zIndex: "50"
        }

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
    })

    onUnmounted(() => {
        document.removeEventListener("mousedown", handleClickOutside)
    })

    return {
        is_open,
        trigger_ref,
        content_ref,
        dropdown_id,
        active_item_index,
        items_count,
        position_styles,
        open,
        close,
        toggle,
        handleTriggerClick,
        handleTriggerKeyDown,
        handleContentKeyDown,
        registerItem,
        setActiveItem
    }
}
