<template>
    <Transition name="popover">
        <div
            v-if="is_open"
            ref="content_element"
            :id="popover_id"
            role="dialog"
            aria-modal="false"
            :style="position_styles"
            :class="[computed_classes, props.class]"
            tabindex="-1"
        >
            <slot />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, ref, computed, watchEffect, onMounted } from "vue"
import { useStyleAdapter } from "../../composables"
import type { PopoverContentProps } from "../../types/popover"
import { POPOVER_CONTEXT_KEY } from "../../types/popover"
import type { PopoverState } from "../../types/composables"

const props = withDefaults(defineProps<PopoverContentProps>(), {
    unstyled: false
})

const context = inject(POPOVER_CONTEXT_KEY)

if (!context) {
    throw new Error("PopoverContent must be used within a Popover component")
}

const {
    is_open,
    content_ref,
    popover_id,
    position_styles
} = context

const style_adapter = useStyleAdapter()
const content_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    content_ref.value = content_element.value
})

onMounted(() => {
    if (is_open.value && content_element.value) {
        content_element.value.focus()
    }
})

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: PopoverState = {
        is_open: is_open.value
    }
    return style_adapter.getClasses("popover", state)
})
</script>

<style scoped>
.popover-enter-active,
.popover-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.popover-enter-from,
.popover-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
