<template>
    <input
        :type="composable.state.value.type"
        :value="modelValue"
        :disabled="composable.state.value.disabled"
        :readonly="composable.state.value.readonly"
        :placeholder="placeholder"
        :id="id"
        v-bind="composable.aria_attributes.value"
        @input="handleInput"
        @focus="composable.handleFocus"
        @blur="composable.handleBlur"
    />
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useInput } from "../../composables/useInput"
import type { InputType, InputSize } from "../../types/input"

const props = withDefaults(defineProps<{
    type?: InputType
    size?: InputSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: string
    error_id?: string
    id?: string
    modelValue?: string
}>(), {
    type: "text",
    size: "md",
    disabled: false,
    readonly: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const composable = useInput(toRef(() => props))

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit("update:modelValue", target.value)
}
</script>
