<template>
    <Transition name="tooltip">
        <div
            v-if="is_open"
            ref="content_element"
            :id="tooltip_id"
            role="tooltip"
            :style="position_styles"
            :class="cn(base_classes, props.class)"
            @mouseenter="handleContentMouseEnter"
            @mouseleave="handleContentMouseLeave"
        >
            <slot />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect } from "vue"
import { cn } from "../../utils/cn"
import { TOOLTIP_CONTEXT_KEY } from "./Tooltip.vue"

export interface Props {
    class?: string
}

const props = defineProps<Props>()

const context = inject(TOOLTIP_CONTEXT_KEY)

if (!context) {
    throw new Error("TooltipContent must be used within a Tooltip component")
}

const {
    is_open,
    content_ref,
    tooltip_id,
    position_styles,
    handleMouseEnter,
    handleMouseLeave
} = context

const content_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    content_ref.value = content_element.value
})

const handleContentMouseEnter = (): void => {
    // Keep tooltip open when hovering over content
    handleMouseEnter()
}

const handleContentMouseLeave = (): void => {
    handleMouseLeave()
}

const base_classes = cn(
    "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5",
    "text-xs text-primary-foreground shadow-md",
    "animate-in fade-in-0 zoom-in-95"
)
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
