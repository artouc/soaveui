<template>
    <div
        v-if="is_open"
        role="tooltip"
        :data-side="side"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue"
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
    side?: "top" | "right" | "bottom" | "left"
}>(), {
    side: "top"
})

const context = inject<TooltipContext | null>(TOOLTIP_KEY, null)
const is_open = context?.is_open

defineOptions({
    name: "TooltipContent"
})
</script>
