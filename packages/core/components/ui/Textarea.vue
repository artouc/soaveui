<template>
    <textarea
        :id="id"
        :class="composable.base_classes.value"
        :disabled="composable.is_disabled.value"
        :readonly="composable.is_readonly.value"
        :placeholder="placeholder"
        :rows="rows"
        :value="modelValue"
        v-bind="composable.aria_attributes.value"
        @input="handleInput"
        @focus="composable.handleFocus"
        @blur="handleBlur"
    />
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useTextarea } from "../../composables/useTextarea"
import type { TextareaProps } from "../../types/textarea"

interface Props extends TextareaProps {
    id?: string
    modelValue?: string
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

const composable = useTextarea(toRef(() => props))

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit("update:modelValue", target.value)
}

const handleBlur = (event: FocusEvent) => {
    composable.handleBlur()
    emit("blur", event)
}
</script>
