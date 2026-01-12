import type { ComputedRef } from "vue"

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive"

export interface AlertProps {
    variant?: AlertVariant
}

export interface AlertReturn {
    base_classes: ComputedRef<string>
    icon_name: ComputedRef<string>
}

export interface AlertTitleProps {
    class?: string
}

export interface AlertDescriptionProps {
    class?: string
}
