import { ref, readonly } from "vue"
import type { DialogReturn } from "../types/dialog"

/**
 * Dialogコンポーネントの状態管理を提供するComposable
 * open/close/toggle操作と状態を管理
 */
export const useDialog = (): DialogReturn => {
    const is_open = ref(false)

    const open = () => {
        is_open.value = true
    }

    const close = () => {
        is_open.value = false
    }

    const toggle = () => {
        is_open.value = !is_open.value
    }

    return {
        is_open: readonly(is_open),
        open,
        close,
        toggle
    }
}
