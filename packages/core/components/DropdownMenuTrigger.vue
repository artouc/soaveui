<template>
    <button
        ref="trigger_element"
        type="button"
        :aria-expanded="is_open"
        aria-haspopup="menu"
        @click="toggle"
    >
        <slot :is_open="is_open" />
    </button>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue"
import type { Ref, InjectionKey } from "vue"

interface DropdownMenuContext {
    is_open: Ref<boolean>
    trigger_ref: Ref<HTMLElement | null>
    open: () => void
    close: () => void
    toggle: () => void
    setTriggerRef: (el: HTMLElement | null) => void
}

const DROPDOWN_MENU_KEY: InjectionKey<DropdownMenuContext> = Symbol("dropdown-menu")

const trigger_element = ref<HTMLElement | null>(null)
const context = inject<DropdownMenuContext | null>(DROPDOWN_MENU_KEY, null)

const is_open = context?.is_open ?? ref(false)

const toggle = () => {
    context?.toggle()
}

onMounted(() => {
    context?.setTriggerRef(trigger_element.value)
})

defineOptions({
    name: "DropdownMenuTrigger"
})
</script>
