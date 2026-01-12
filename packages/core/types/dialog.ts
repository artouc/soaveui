import type { Ref, DeepReadonly, InjectionKey } from "vue"

export interface DialogContext {
    close: () => void
}

export const DIALOG_KEY: InjectionKey<DialogContext> = Symbol("dialog")

export interface DialogProps {
    open?: boolean
    modal?: boolean
    showCloseButton?: boolean
    unstyled?: boolean
}

export interface DialogReturn {
    is_open: DeepReadonly<Ref<boolean>>
    open: () => void
    close: () => void
    toggle: () => void
}

export interface DialogContentProps {
    class?: string
    unstyled?: boolean
}

export interface DialogHeaderProps {
    class?: string
    unstyled?: boolean
}

export interface DialogTitleProps {
    class?: string
    unstyled?: boolean
}

export interface DialogDescriptionProps {
    class?: string
    unstyled?: boolean
}

export interface DialogFooterProps {
    class?: string
    unstyled?: boolean
}

export interface DialogTriggerProps {
    as_child?: boolean
}
