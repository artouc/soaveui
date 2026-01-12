<template>
    <p
        v-if="show_error"
        :id="error_id"
        role="alert"
        aria-live="polite"
    >
        <slot>{{ error_message }}</slot>
    </p>
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

const props = defineProps<{
    error?: string
}>()

const context = inject(FORM_FIELD_KEY, null)
const error_id = computed(() => context?.error_id)
const error_message = computed(() => props.error ?? context?.error.value)
const show_error = computed(() => !!error_message.value)

defineOptions({
    name: "FormError"
})
</script>
