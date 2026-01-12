import { computed, inject, type Ref } from "vue"
import { cn } from "../utils/cn"
import type {
    SelectProps,
    SelectContext,
    SelectTriggerReturn,
    SelectContentReturn,
    SelectItemReturn,
    SelectSize
} from "../types/select"
import { SELECT_KEY } from "../types/select"
import { COMPONENT_ERRORS } from "../constants/errors"

/**
 * SelectTriggerコンポーネントのロジックを提供するComposable
 */
export const useSelectTrigger = (): SelectTriggerReturn => {
    const context = inject<SelectContext | null>(SELECT_KEY, null)

    if (!context) {
        throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
    }

    const is_disabled = computed(() => context.disabled.value)

    const size_classes = computed(() => {
        const size_map: Record<SelectSize, string> = {
            sm: "h-9 text-sm",
            md: "h-10",
            lg: "h-11 text-lg"
        }
        return size_map[context.size.value]
    })

    const base_classes = computed(() =>
        cn(
            "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1",
            size_classes.value
        )
    )

    return {
        base_classes,
        is_disabled
    }
}

/**
 * SelectContentコンポーネントのロジックを提供するComposable
 */
export const useSelectContent = (): SelectContentReturn => {
    const base_classes = computed(() =>
        cn(
            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        )
    )

    return {
        base_classes
    }
}

/**
 * SelectItemコンポーネントのロジックを提供するComposable
 */
export const useSelectItem = (
    props: Ref<{ value: string; disabled?: boolean }>
): SelectItemReturn => {
    const context = inject<SelectContext | null>(SELECT_KEY, null)

    if (!context) {
        throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
    }

    const is_selected = computed(() => context.model_value.value === props.value.value)
    const is_disabled = computed(() => props.value.disabled ?? false)

    const base_classes = computed(() =>
        cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2",
            "text-sm outline-none",
            "focus:bg-accent focus:text-accent-foreground",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            is_selected.value && "bg-accent text-accent-foreground"
        )
    )

    return {
        base_classes,
        is_selected,
        is_disabled
    }
}
