<template>
    <button
        ref="trigger_element"
        type="button"
        :disabled="composable.state.value.disabled"
        :aria-expanded="composable.state.value.is_open"
        aria-haspopup="listbox"
        @click="handleClick"
        @keydown="handleKeyDown"
    >
        <slot :is_open="composable.state.value.is_open" :disabled="composable.state.value.disabled" />
    </button>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue"
import type { Ref, ComputedRef, InjectionKey } from "vue"
import { useSelectTrigger } from "../composables/useSelect"

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

const trigger_element = ref<HTMLElement | null>(null)
const context = inject<SelectContext | null>(SELECT_KEY, null)

if (!context) {
    throw new Error("SelectTrigger must be used within Select")
}

const composable = useSelectTrigger()

const handleClick = () => {
    if (!composable.state.value.disabled) {
        context.toggle()
    }
}

const handleKeyDown = (event: KeyboardEvent) => {
    if (composable.state.value.disabled) return

    switch (event.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
            event.preventDefault()
            context.open()
            break
        case "ArrowUp":
            event.preventDefault()
            context.open()
            break
    }
}

onMounted(() => {
    context.setTriggerRef(trigger_element.value)
})

defineExpose({
    state: composable.state
})
</script>
