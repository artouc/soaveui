<template>
    <Input
        :id="id"
        :type="type"
        :size="size"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :error="error"
        :error_id="error_id"
        :model-value="modelValue"
        :class="props.class"
        @update:model-value="emit('update:modelValue', $event)"
        @blur="emit('blur', $event)"
    />
</template>

<script setup lang="ts">
import Input from "./Input.vue"
import type { InputType, InputSize } from "../../types/input"

interface Props {
    id?: string
    type?: InputType
    size?: InputSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: string
    error_id?: string
    modelValue?: string | number
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: "text",
    size: "md",
    disabled: false,
    readonly: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string | number]
    blur: [event: FocusEvent]
}>()
</script>
