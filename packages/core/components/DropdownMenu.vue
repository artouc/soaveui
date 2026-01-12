<template>
    <div ref="root_ref">
        <slot :is_open="is_open" :open="open" :close="close" :toggle="toggle" />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from "vue"
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

const root_ref = ref<HTMLElement | null>(null)
const trigger_ref = ref<HTMLElement | null>(null)
const is_open = ref(false)

const open = () => {
    is_open.value = true
}

const close = () => {
    is_open.value = false
}

const toggle = () => {
    is_open.value = !is_open.value
}

const setTriggerRef = (el: HTMLElement | null) => {
    trigger_ref.value = el
}

const handleClickOutside = (event: MouseEvent) => {
    if (!is_open.value) return
    const target = event.target as Node
    if (root_ref.value && !root_ref.value.contains(target)) {
        close()
    }
}

provide(DROPDOWN_MENU_KEY, {
    is_open,
    trigger_ref,
    open,
    close,
    toggle,
    setTriggerRef
})

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside)
})

defineOptions({
    name: "DropdownMenu"
})

defineExpose({
    is_open,
    open,
    close,
    toggle
})
</script>
