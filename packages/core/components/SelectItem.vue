<template>
    <div
        role="option"
        :aria-selected="composable.state.value.selected"
        :aria-disabled="composable.state.value.disabled"
        :data-state="composable.state.value.selected ? 'selected' : undefined"
        :data-disabled="composable.state.value.disabled ? '' : undefined"
        @click="handleClick"
        @keydown.enter="handleClick"
        @keydown.space.prevent="handleClick"
    >
        <slot :selected="composable.state.value.selected" :disabled="composable.state.value.disabled" />
    </div>
</template>

<script setup lang="ts">
import { inject, toRef } from "vue"
import type { Ref, ComputedRef, InjectionKey } from "vue"
import { useSelectItem } from "../composables/useSelect"

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

const props = withDefaults(defineProps<{
    value: string
    disabled?: boolean
}>(), {
    disabled: false
})

const context = inject<SelectContext | null>(SELECT_KEY, null)

if (!context) {
    throw new Error("SelectItem must be used within Select")
}

const composable = useSelectItem(toRef(() => ({ value: props.value, disabled: props.disabled })))

const handleClick = () => {
    if (!composable.state.value.disabled) {
        context.updateValue(props.value)
    }
}

defineExpose({
    state: composable.state
})
</script>
