<template>
    <Transition name="popover">
        <div
            v-if="is_open"
            ref="content_element"
            :id="popover_id"
            role="dialog"
            aria-modal="false"
            :style="position_styles"
            :class="cn(base_classes, props.class)"
            tabindex="-1"
        >
            <slot />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect, onMounted } from "vue"
import { cn } from "../../utils/cn"
import { POPOVER_CONTEXT_KEY } from "./Popover.vue"

export interface Props {
    class?: string
}

const props = defineProps<Props>()

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

const content_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    content_ref.value = content_element.value
})

onMounted(() => {
    if (is_open.value && content_element.value) {
        content_element.value.focus()
    }
})

const base_classes = cn(
    "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
    "animate-in fade-in-0 zoom-in-95"
)
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
