<template>
    <textarea
        :value="modelValue"
        :disabled="composable.state.value.disabled"
        :readonly="composable.state.value.readonly"
        :placeholder="placeholder"
        :rows="rows"
        :id="id"
        v-bind="composable.aria_attributes.value"
        @input="handleInput"
        @focus="composable.handleFocus"
        @blur="composable.handleBlur"
    />
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useTextarea } from "../../composables/useTextarea"
import type { TextareaProps } from "../../types/textarea"

interface HeadlessTextareaProps extends TextareaProps {
    modelValue?: string
    id?: string
}

const props = withDefaults(defineProps<HeadlessTextareaProps>(), {
    size: "md",
    disabled: false,
    readonly: false,
    rows: 3,
    resize: "vertical"
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const composable = useTextarea(toRef(() => props))

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit("update:modelValue", target.value)
}

defineExpose({
    state: composable.state,
    is_focused: composable.is_focused
})
</script>
