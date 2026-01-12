<template>
    <button
        :disabled="composable.state.value.disabled || composable.state.value.loading"
        :type="composable.state.value.type"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useButton } from "../composables/useButton"

const props = withDefaults(defineProps<{
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    loading?: boolean
    type?: "button" | "submit" | "reset"
}>(), {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    type: "button"
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const composable = useButton(toRef(() => props))

const handleClick = (event: MouseEvent) => {
    if (!composable.state.value.disabled && !composable.state.value.loading) {
        emit("click", event)
    }
}
</script>
