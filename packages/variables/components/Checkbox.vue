<template>
    <CoreCheckbox
        :class="computedClasses"
        :size="size"
        :disabled="disabled"
        :indeterminate="indeterminate"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #default="{ checked, indeterminate: isIndeterminate }">
            <span class="checkbox__indicator">
                <svg
                    v-if="isIndeterminate"
                    class="checkbox__icon"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="4" y1="8" x2="12" y2="8" />
                </svg>
                <svg
                    v-else-if="checked"
                    class="checkbox__icon"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="3.5 8 6.5 11 12.5 5" />
                </svg>
            </span>
        </template>
    </CoreCheckbox>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Checkbox as CoreCheckbox } from "@soave/ui"
import type { CheckboxSize } from "@soave/ui"

const props = withDefaults(defineProps<{
    size?: CheckboxSize
    disabled?: boolean
    indeterminate?: boolean
    modelValue?: boolean
    class?: string
}>(), {
    size: "md",
    disabled: false,
    indeterminate: false,
    modelValue: false
})

const emit = defineEmits<{
    "update:modelValue": [value: boolean]
}>()

const computedClasses = computed(() => {
    return [
        "checkbox",
        `checkbox--${props.size}`,
        props.disabled && "checkbox--disabled",
        props.modelValue && "checkbox--checked",
        props.indeterminate && "checkbox--indeterminate",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/checkbox.css";
</style>
