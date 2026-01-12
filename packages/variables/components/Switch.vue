<template>
    <CoreSwitch
        :class="computedClasses"
        :size="size"
        :disabled="disabled"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <span class="switch__thumb" />
    </CoreSwitch>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Switch as CoreSwitch } from "@soave/ui"
import type { SwitchSize } from "@soave/ui"

const props = withDefaults(defineProps<{
    size?: SwitchSize
    disabled?: boolean
    modelValue?: boolean
    class?: string
}>(), {
    size: "md",
    disabled: false,
    modelValue: false
})

const emit = defineEmits<{
    "update:modelValue": [value: boolean]
}>()

const computedClasses = computed(() => {
    return [
        "switch",
        `switch--${props.size}`,
        props.disabled && "switch--disabled",
        props.modelValue && "switch--checked",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/switch.css";
</style>
