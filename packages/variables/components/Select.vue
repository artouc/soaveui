<template>
    <CoreSelect
        :size="size"
        :disabled="disabled"
        :placeholder="placeholder"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <slot />
    </CoreSelect>
</template>

<script setup lang="ts">
import { Select as CoreSelect } from "@soave/ui"
import type { SelectSize } from "@soave/ui"

withDefaults(defineProps<{
    size?: SelectSize
    disabled?: boolean
    placeholder?: string
    modelValue?: string
}>(), {
    size: "md",
    disabled: false,
    placeholder: "Select..."
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()
</script>

<style>
@import "../styles/select.css";
</style>
