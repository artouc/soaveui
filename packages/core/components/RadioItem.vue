<template>
    <button
        type="button"
        :disabled="composable.state.value.disabled"
        :data-state="composable.state.value.checked ? 'checked' : 'unchecked'"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
        @keydown="handleKeyDown"
    >
        <slot :checked="composable.state.value.checked" :disabled="composable.state.value.disabled" />
    </button>
</template>

<script setup lang="ts">
import { inject, toRef } from "vue"
import type { Ref, ComputedRef, InjectionKey } from "vue"
import { useRadioItem } from "../../composables/useRadio"

interface RadioGroupContext {
    model_value: Ref<string>
    disabled: ComputedRef<boolean>
    updateValue: (value: string) => void
}

const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol("radio-group")

const props = withDefaults(defineProps<{
    value: string
    size?: "sm" | "md" | "lg"
    disabled?: boolean
}>(), {
    size: "md",
    disabled: false
})

const context = inject<RadioGroupContext | null>(RADIO_GROUP_KEY, null)

if (!context) {
    throw new Error("RadioItem must be used within RadioGroup")
}

const composable = useRadioItem(toRef(() => props))

const handleClick = () => {
    if (!composable.state.value.disabled) {
        context.updateValue(props.value)
    }
}

const handleKeyDown = (event: KeyboardEvent) => {
    if (composable.state.value.disabled) return

    switch (event.key) {
        case "Enter":
        case " ":
            event.preventDefault()
            context.updateValue(props.value)
            break
    }
}

defineExpose({
    state: composable.state
})
</script>
