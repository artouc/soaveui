<template>
    <div class="textarea-container">
        <CoreTextarea
            :class="computedClasses"
            :size="size"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :error="error"
            :error_id="errorId"
            :rows="rows"
            :resize="resize"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
        />
        <div
            v-if="error"
            :id="errorId"
            class="textarea-error"
        >
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Textarea as CoreTextarea } from "@soave/ui"
import type { TextareaSize, TextareaResize } from "@soave/ui"

const props = withDefaults(defineProps<{
    size?: TextareaSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: string
    error_id?: string
    id?: string
    rows?: number
    resize?: TextareaResize
    modelValue?: string
    class?: string
}>(), {
    size: "md",
    disabled: false,
    readonly: false,
    rows: 3,
    resize: "vertical"
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const errorId = computed(() => props.id ? `${props.id}-error` : undefined)

const computedClasses = computed(() => {
    return [
        "textarea",
        `textarea--${props.size}`,
        props.error && "textarea--error",
        `textarea--resize-${props.resize}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/textarea.css";
</style>
