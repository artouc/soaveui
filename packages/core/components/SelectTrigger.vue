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
import { useSelectTrigger } from "../../composables/useSelect"
import type { SelectContext } from "../../types/select"
import { SELECT_KEY } from "../../types/select"
import { COMPONENT_ERRORS } from "../../constants/errors"

const trigger_element = ref<HTMLElement | null>(null)
const context = inject<SelectContext | null>(SELECT_KEY, null)

if (!context) {
    throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
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
