<template>
    <div class="relative">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, toRef } from "vue"
import type { SelectProps, SelectContext, SelectSize } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

interface Props extends SelectProps {
    modelValue?: string
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    size: "md" as SelectSize,
    disabled: false,
    placeholder: "Select...",
    unstyled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const is_open = ref(false)
const trigger_ref = ref<HTMLElement | null>(null)

const context: SelectContext = {
    model_value: toRef(() => props.modelValue),
    is_open,
    disabled: toRef(() => props.disabled),
    size: toRef(() => props.size ?? "md"),
    placeholder: toRef(() => props.placeholder ?? "Select..."),
    trigger_ref,
    updateValue: (value: string) => {
        emit("update:modelValue", value)
        is_open.value = false
    },
    open: () => {
        if (!props.disabled) {
            is_open.value = true
        }
    },
    close: () => {
        is_open.value = false
    },
    toggle: () => {
        if (!props.disabled) {
            is_open.value = !is_open.value
        }
    },
    setTriggerRef: (element: HTMLElement | null) => {
        trigger_ref.value = element
    }
}

provide(SELECT_KEY, context)
</script>
