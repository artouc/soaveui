<template>
    <span
        ref="trigger_element"
        :aria-describedby="is_open ? tooltip_id : undefined"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @focus="handleFocus"
        @blur="handleBlur"
    >
        <slot />
    </span>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect } from "vue"
import { TOOLTIP_CONTEXT_KEY } from "./Tooltip.vue"

const context = inject(TOOLTIP_CONTEXT_KEY)

if (!context) {
    throw new Error("TooltipTrigger must be used within a Tooltip component")
}

const {
    is_open,
    trigger_ref,
    tooltip_id,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur
} = context

const trigger_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    trigger_ref.value = trigger_element.value
})
</script>
