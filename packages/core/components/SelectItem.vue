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
import { useSelectItem } from "../../composables/useSelect"
import type { SelectContext, SelectItemProps } from "../../types/select"
import { SELECT_KEY } from "../../types/select"
import { COMPONENT_ERRORS } from "../../constants/errors"

const props = withDefaults(defineProps<SelectItemProps>(), {
    disabled: false
})

const context = inject<SelectContext | null>(SELECT_KEY, null)

if (!context) {
    throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
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
