<template>
    <label :for="for_id">
        <slot />
    </label>
</template>

<script setup lang="ts">
import { inject } from "vue"
import type { InjectionKey, ComputedRef } from "vue"

interface FormFieldContext {
    field_id: string
    error_id: string
    has_error: ComputedRef<boolean>
    error: ComputedRef<string | undefined>
}

const FORM_FIELD_KEY: InjectionKey<FormFieldContext> = Symbol("form-field")

const props = defineProps<{
    for?: string
}>()

const context = inject(FORM_FIELD_KEY, null)
const for_id = props.for ?? context?.field_id

defineOptions({
    name: "FormLabel"
})
</script>
