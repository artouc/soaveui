<template>
    <div ref="root_ref">
        <slot
            :is_open="context.is_open.value"
            :selected_value="model"
            :open="context.open"
            :close="context.close"
            :toggle="context.toggle"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, watch, onMounted, onUnmounted, computed } from "vue"
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

const props = withDefaults(defineProps<{
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    placeholder?: string
}>(), {
    size: "md",
    disabled: false,
    placeholder: ""
})

const model = defineModel<string>({ default: "" })

const root_ref = ref<HTMLElement | null>(null)
const trigger_ref = ref<HTMLElement | null>(null)
const is_open = ref(false)

const open = () => {
    if (!props.disabled) {
        is_open.value = true
    }
}

const close = () => {
    is_open.value = false
}

const toggle = () => {
    if (is_open.value) {
        close()
    } else {
        open()
    }
}

const updateValue = (value: string) => {
    model.value = value
    close()
}

const setTriggerRef = (element: HTMLElement | null) => {
    trigger_ref.value = element
}

const handleClickOutside = (event: MouseEvent) => {
    if (!is_open.value) return
    const target = event.target as Node
    if (root_ref.value && !root_ref.value.contains(target)) {
        close()
    }
}

const context: SelectContext = {
    model_value: model,
    is_open,
    disabled: computed(() => props.disabled),
    size: computed(() => props.size ?? "md"),
    placeholder: computed(() => props.placeholder ?? ""),
    trigger_ref,
    updateValue,
    open,
    close,
    toggle,
    setTriggerRef
}

provide(SELECT_KEY, context)

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside)
})

defineExpose({
    is_open,
    open,
    close,
    toggle
})
</script>
