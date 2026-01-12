<template>
    <span
        ref="trigger_element"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @focus="handleMouseEnter"
        @blur="handleMouseLeave"
    >
        <slot />
    </span>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue"
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

const trigger_element = ref<HTMLElement | null>(null)
const context = inject<TooltipContext | null>(TOOLTIP_KEY, null)

const handleMouseEnter = () => {
    context?.open()
}

const handleMouseLeave = () => {
    context?.close()
}

onMounted(() => {
    context?.setTriggerRef(trigger_element.value)
})

defineOptions({
    name: "TooltipTrigger"
})
</script>
