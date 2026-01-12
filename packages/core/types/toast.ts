export type ToastVariant = "default" | "success" | "error" | "warning" | "info"
export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

export interface ToastProps {
    id?: string
    title?: string
    description?: string
    variant?: ToastVariant
    duration?: number
    dismissible?: boolean
    action?: ToastAction
    class?: string
    unstyled?: boolean
}

export interface ToastAction {
    label: string
    onClick: () => void
}

export interface ToastItem extends Required<Pick<ToastProps, "id" | "variant" | "duration" | "dismissible">> {
    title?: string
    description?: string
    action?: ToastAction
    created_at: number
}

export interface ToasterProps {
    position?: ToastPosition
    max_toasts?: number
    gap?: number
}

export interface ToastReturn {
    toasts: ToastItem[]
    add: (props: ToastProps) => string
    dismiss: (id: string) => void
    dismissAll: () => void
    update: (id: string, props: Partial<ToastProps>) => void
}

export interface ToastAriaAttributes {
    role: "alert" | "status"
    "aria-live": "assertive" | "polite"
    "aria-atomic": "true"
}
