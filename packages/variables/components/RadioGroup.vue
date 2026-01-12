<template>
    <CoreRadioGroup
        :class="computedClasses"
        :disabled="disabled"
        :orientation="orientation"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <slot />
    </CoreRadioGroup>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { RadioGroup as CoreRadioGroup } from "@soave/ui"

const props = withDefaults(defineProps<{
    disabled?: boolean
    orientation?: "horizontal" | "vertical"
    modelValue?: string
    class?: string
}>(), {
    disabled: false,
    orientation: "vertical"
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const computedClasses = computed(() => {
    return [
        "radio-group",
        `radio-group--${props.orientation}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/radio.css";
</style>
