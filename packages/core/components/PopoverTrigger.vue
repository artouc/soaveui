<template>
    <button
        ref="trigger_element"
        type="button"
        :aria-expanded="is_open"
        aria-haspopup="dialog"
        @click="toggle"
    >
        <slot :is_open="is_open" />
    </button>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue"
import type { Ref, InjectionKey } from "vue"

interface PopoverContext {
    is_open: Ref<boolean>
    trigger_ref: Ref<HTMLElement | null>
    open: () => void
    close: () => void
    toggle: () => void
    setTriggerRef: (el: HTMLElement | null) => void
}

const POPOVER_KEY: InjectionKey<PopoverContext> = Symbol("popover")

const trigger_element = ref<HTMLElement | null>(null)
const context = inject<PopoverContext | null>(POPOVER_KEY, null)

const is_open = context?.is_open ?? ref(false)

const toggle = () => {
    context?.toggle()
}

onMounted(() => {
    context?.setTriggerRef(trigger_element.value)
})

defineOptions({
    name: "PopoverTrigger"
})
</script>
