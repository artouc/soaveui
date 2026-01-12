<template>
    <input
        :id="id"
        :type="type"
        :class="composable.base_classes.value"
        :disabled="composable.is_disabled.value"
        :readonly="composable.is_readonly.value"
        :placeholder="placeholder"
        :value="modelValue"
        v-bind="composable.aria_attributes.value"
        @input="handleInput"
        @focus="composable.handleFocus"
        @blur="handleBlur"
    />
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useInput } from "../../composables/useInput"
import type { InputProps, InputType } from "../../types/input"

interface Props extends InputProps {
    id?: string
    modelValue?: string | number
}

const props = withDefaults(defineProps<Props>(), {
    type: "text" as InputType,
    disabled: false,
    readonly: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string | number]
    blur: [event: FocusEvent]
}>()

const composable = useInput(toRef(() => props))

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit("update:modelValue", target.value)
}

const handleBlur = (event: FocusEvent) => {
    composable.handleBlur()
    emit("blur", event)
}
</script>
