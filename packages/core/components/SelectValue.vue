<template>
    <span>
        <slot :value="selected_value" :placeholder="placeholder">
            {{ display_text }}
        </slot>
    </span>
</template>

<script setup lang="ts">
import { inject, computed } from "vue"
import type { Ref, ComputedRef, InjectionKey } from "vue"

interface SelectContext {
    model_value: Ref<string>
    is_open: Ref<boolean>
    disabled: ComputedRef<boolean>
    size: ComputedRef<"sm" | "md" | "lg">
    placeholder: ComputedRef<string>
    trigger_ref: Ref<HTMLElement | null>
    updateValue: (value: string) => void
    open: () => void
    close: () => void
    toggle: () => void
    setTriggerRef: (element: HTMLElement | null) => void
}

const SELECT_KEY: InjectionKey<SelectContext> = Symbol("select")

const props = defineProps<{
    placeholder?: string
}>()

const context = inject<SelectContext | null>(SELECT_KEY, null)

const selected_value = computed(() => context?.model_value.value ?? "")
const placeholder = computed(() => props.placeholder ?? context?.placeholder.value ?? "Select...")
const display_text = computed(() => selected_value.value || placeholder.value)

defineOptions({
    name: "SelectValue"
})
</script>
