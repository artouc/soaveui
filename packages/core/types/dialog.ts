import type { Ref, DeepReadonly } from "vue"

export interface DialogProps {
    open?: boolean
    modal?: boolean
}

export interface DialogReturn {
    is_open: DeepReadonly<Ref<boolean>>
    open: () => void
    close: () => void
    toggle: () => void
}

export interface DialogContentProps {
    class?: string
}

export interface DialogHeaderProps {
    class?: string
}

export interface DialogTitleProps {
    class?: string
}

export interface DialogDescriptionProps {
    class?: string
}

export interface DialogFooterProps {
    class?: string
}

export interface DialogTriggerProps {
    as_child?: boolean
}
