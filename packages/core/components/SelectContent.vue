<template>
    <div
        v-if="composable.state.value.is_open"
        role="listbox"
        tabindex="-1"
        @keydown="handleKeyDown"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue"
import type { Ref, ComputedRef, InjectionKey } from "vue"
import { useSelectContent } from "../composables/useSelect"

interface SelectContext {
    model_value: Ref<string>
    is_open: Ref<boolean>
    disabled: ComputedRef<boolean>
    size: ComputedRef<"sm" | "md" | "lg">
    placeholder: ComputedRef<string>
    trigger_ref: Ref<HTMLElement | null>
    updateValue: (value: string) => void
    open: () => void
    close: () => void
    toggle: () => void
    setTriggerRef: (element: HTMLElement | null) => void
}

const SELECT_KEY: InjectionKey<SelectContext> = Symbol("select")

const context = inject<SelectContext | null>(SELECT_KEY, null)

if (!context) {
    throw new Error("SelectContent must be used within Select")
}

const composable = useSelectContent()

const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
        case "Escape":
            event.preventDefault()
            context.close()
            context.trigger_ref.value?.focus()
            break
    }
}

defineExpose({
    state: composable.state
})
</script>
