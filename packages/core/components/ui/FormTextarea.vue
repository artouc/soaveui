<template>
    <Textarea
        :id="id"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :error="error"
        :error_id="error_id"
        :rows="rows"
        :resize="resize"
        :model-value="modelValue"
        :class="props.class"
        @update:model-value="emit('update:modelValue', $event)"
        @blur="emit('blur', $event)"
    />
</template>

<script setup lang="ts">
import Textarea from "./Textarea.vue"
import type { TextareaProps } from "../../types/textarea"

interface Props extends TextareaProps {
    id?: string
    modelValue?: string
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    rows: 3,
    resize: "vertical",
    disabled: false,
    readonly: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
    blur: [event: FocusEvent]
}>()
</script>
