<template>
    <Transition name="tooltip">
        <div
            v-if="is_open"
            ref="content_element"
            :id="tooltip_id"
            role="tooltip"
            :style="position_styles"
            :class="[computed_classes, props.class]"
            @mouseenter="handleContentMouseEnter"
            @mouseleave="handleContentMouseLeave"
        >
            <slot />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, ref, computed, watchEffect } from "vue"
import { useStyleAdapter } from "../../composables"
import { TOOLTIP_CONTEXT_KEY } from "./Tooltip.vue"
import type { TooltipContentProps } from "../../types/tooltip"
import type { TooltipState } from "../../types/composables"

const props = withDefaults(defineProps<TooltipContentProps>(), {
    unstyled: false
})

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

const style_adapter = useStyleAdapter()
const content_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    content_ref.value = content_element.value
})

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: TooltipState = {
        is_open: is_open.value,
        side: "top"
    }
    return style_adapter.getClasses("tooltip", state)
})

const handleContentMouseEnter = (): void => {
    handleMouseEnter()
}

const handleContentMouseLeave = (): void => {
    handleMouseLeave()
}
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
