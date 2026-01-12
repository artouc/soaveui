<template>
    <textarea
        :id="textarea_id"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :rows="rows"
        :aria-invalid="has_error"
        :aria-describedby="has_error ? aria_error_id : undefined"
        @input="handleInput"
    />
</template>

<script setup lang="ts">
import { inject, computed } from "vue"
import type { InjectionKey, ComputedRef } from "vue"

interface FormFieldContext {
    field_id: string
    error_id: string
    has_error: ComputedRef<boolean>
    error: ComputedRef<string | undefined>
}

const FORM_FIELD_KEY: InjectionKey<FormFieldContext> = Symbol("form-field")

const props = withDefaults(defineProps<{
    modelValue?: string
    disabled?: boolean
    readonly?: boolean
    placeholder?: string
    rows?: number
    id?: string
}>(), {
    disabled: false,
    readonly: false,
    rows: 3
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const context = inject(FORM_FIELD_KEY, null)
const textarea_id = computed(() => props.id ?? context?.field_id)
const has_error = computed(() => context?.has_error.value ?? false)
const aria_error_id = computed(() => context?.error_id)

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit("update:modelValue", target.value)
}

defineOptions({
    name: "FormTextarea"
})
</script>
