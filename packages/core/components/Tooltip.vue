<template>
    <div ref="root_ref">
        <slot :is_open="is_open" />
    </div>
</template>

<script setup lang="ts">
import { ref, provide } from "vue"
import type { Ref, InjectionKey } from "vue"

interface TooltipContext {
    is_open: Ref<boolean>
    trigger_ref: Ref<HTMLElement | null>
    delay: number
    open: () => void
    close: () => void
    setTriggerRef: (el: HTMLElement | null) => void
}

const TOOLTIP_KEY: InjectionKey<TooltipContext> = Symbol("tooltip")

const props = withDefaults(defineProps<{
    delay?: number
}>(), {
    delay: 200
})

const root_ref = ref<HTMLElement | null>(null)
const trigger_ref = ref<HTMLElement | null>(null)
const is_open = ref(false)
let timeout_id: ReturnType<typeof setTimeout> | null = null

const open = () => {
    if (timeout_id) clearTimeout(timeout_id)
    timeout_id = setTimeout(() => {
        is_open.value = true
    }, props.delay)
}

const close = () => {
    if (timeout_id) clearTimeout(timeout_id)
    is_open.value = false
}

const setTriggerRef = (el: HTMLElement | null) => {
    trigger_ref.value = el
}

provide(TOOLTIP_KEY, {
    is_open,
    trigger_ref,
    delay: props.delay,
    open,
    close,
    setTriggerRef
})

defineOptions({
    name: "Tooltip"
})

defineExpose({
    is_open,
    open,
    close
})
</script>
