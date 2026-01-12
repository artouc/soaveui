<template>
    <div ref="root_ref">
        <slot :is_open="is_open" :open="open" :close="close" :toggle="toggle" />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from "vue"
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

const props = withDefaults(defineProps<{
    closeOnClickOutside?: boolean
}>(), {
    closeOnClickOutside: true
})

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
    if (!props.closeOnClickOutside || !is_open.value) return
    const target = event.target as Node
    if (root_ref.value && !root_ref.value.contains(target)) {
        close()
    }
}

provide(POPOVER_KEY, {
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
    name: "Popover"
})

defineExpose({
    is_open,
    open,
    close,
    toggle
})
</script>
