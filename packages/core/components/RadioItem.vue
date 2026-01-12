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
import { useRadioItem } from "../../composables/useRadio"
import type { RadioItemProps, RadioGroupContext } from "../../types/radio"
import { RADIO_GROUP_KEY } from "../../types/radio"
import { COMPONENT_ERRORS } from "../../constants/errors"

const props = withDefaults(defineProps<RadioItemProps>(), {
    size: "md",
    disabled: false
})

const context = inject<RadioGroupContext | null>(RADIO_GROUP_KEY, null)

if (!context) {
    throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
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
