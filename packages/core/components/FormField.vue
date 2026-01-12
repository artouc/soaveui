<template>
    <div>
        <slot
            :id="field_id"
            :error_id="error_id"
            :has_error="!!error"
        />
    </div>
</template>

<script setup lang="ts">
import { provide, computed } from "vue"
import type { InjectionKey, ComputedRef } from "vue"

interface FormFieldContext {
    field_id: string
    error_id: string
    has_error: ComputedRef<boolean>
    error: ComputedRef<string | undefined>
}

const FORM_FIELD_KEY: InjectionKey<FormFieldContext> = Symbol("form-field")

const props = defineProps<{
    name: string
    error?: string
}>()

const field_id = computed(() => `field-${props.name}`)
const error_id = computed(() => `field-${props.name}-error`)
const has_error = computed(() => !!props.error)
const error = computed(() => props.error)

provide(FORM_FIELD_KEY, {
    field_id: field_id.value,
    error_id: error_id.value,
    has_error,
    error
})

defineOptions({
    name: "FormField"
})
</script>
