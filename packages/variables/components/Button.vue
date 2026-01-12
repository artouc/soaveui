<template>
    <CoreButton
        :class="computedClasses"
        :variant="variant"
        :size="size"
        :disabled="disabled"
        :loading="loading"
        :type="type"
        @click="emit('click', $event)"
    >
        <slot />
    </CoreButton>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Button as CoreButton } from "@soave/ui"
import type { ButtonVariant, ButtonSize, ButtonType } from "@soave/ui"

const props = withDefaults(defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    type?: ButtonType
    class?: string
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

const computedClasses = computed(() => {
    return [
        "button",
        `button--${props.variant}`,
        `button--${props.size}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/button.css";
</style>
