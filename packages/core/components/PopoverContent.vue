<template>
    <div
        v-if="is_open"
        role="dialog"
        tabindex="-1"
        :data-side="side"
        :data-align="align"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue"
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
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
}>(), {
    side: "bottom",
    align: "center"
})

const context = inject<PopoverContext | null>(POPOVER_KEY, null)
const is_open = context?.is_open

defineOptions({
    name: "PopoverContent"
})
</script>
