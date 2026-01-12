<template>
    <div class="input-container">
        <CoreInput
            :class="computedClasses"
            :type="type"
            :size="size"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :error="error"
            :error_id="errorId"
            :id="id"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
        />
        <div
            v-if="error"
            :id="errorId"
            class="input-error"
        >
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Input as CoreInput } from "@soave/ui"
import type { InputProps } from "@soave/ui"

interface StyledInputProps extends InputProps {
    modelValue?: string
    class?: string
    id?: string
}

const props = withDefaults(defineProps<StyledInputProps>(), {
    type: "text",
    size: "md",
    disabled: false,
    readonly: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const errorId = computed(() => props.id ? `${props.id}-error` : undefined)

const computedClasses = computed(() => {
    return [
        "input",
        `input--${props.size}`,
        props.error && "input--error",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/input.css";
</style>
