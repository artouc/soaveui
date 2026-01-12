import { ref, readonly, type DeepReadonly } from "vue"
import type { Toast, ToastProps, ToastReturn } from "../types/toast"

const toasts = ref<Toast[]>([])
let toast_counter = 0

const generateId = (): string => {
    toast_counter++
    return `toast-${toast_counter}-${Date.now()}`
}

export function useToast(): ToastReturn {
    const add = (props: ToastProps): string => {
        const id = props.id ?? generateId()

        const toast: Toast = {
            id,
            title: props.title,
            description: props.description,
            variant: props.variant ?? "default",
            duration: props.duration ?? 5000,
            dismissible: props.dismissible ?? true,
            action: props.action,
            created_at: Date.now()
        }

        toasts.value = [...toasts.value, toast]

        // Auto dismiss after duration (if duration > 0)
        if (toast.duration > 0) {
            setTimeout(() => {
                dismiss(id)
            }, toast.duration)
        }

        return id
    }

    const dismiss = (id: string): void => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const dismissAll = (): void => {
        toasts.value = []
    }

    const update = (id: string, props: Partial<ToastProps>): void => {
        toasts.value = toasts.value.map(toast => {
            if (toast.id === id) {
                return {
                    ...toast,
                    ...props,
                    id: toast.id,
                    created_at: toast.created_at
                }
            }
            return toast
        })
    }

    return {
        toasts: toasts.value as DeepReadonly<Toast[]>,
        add,
        dismiss,
        dismissAll,
        update
    }
}

// Convenience functions for common toast types
export const toast = {
    default: (props: Omit<ToastProps, "variant">) => useToast().add({ ...props, variant: "default" }),
    success: (props: Omit<ToastProps, "variant">) => useToast().add({ ...props, variant: "success" }),
    error: (props: Omit<ToastProps, "variant">) => useToast().add({ ...props, variant: "error" }),
    warning: (props: Omit<ToastProps, "variant">) => useToast().add({ ...props, variant: "warning" }),
    info: (props: Omit<ToastProps, "variant">) => useToast().add({ ...props, variant: "info" }),
    dismiss: (id: string) => useToast().dismiss(id),
    dismissAll: () => useToast().dismissAll()
}
