<template>
    <Transition name="dropdown">
        <div
            v-if="is_open"
            ref="content_element"
            :id="dropdown_id"
            role="menu"
            :aria-labelledby="`${dropdown_id}-trigger`"
            :style="position_styles"
            :class="cn(base_classes, props.class)"
            tabindex="-1"
            @keydown="handleContentKeyDown"
        >
            <slot />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect, nextTick, watch } from "vue"
import { cn } from "../../utils/cn"
import { DROPDOWN_CONTEXT_KEY } from "./DropdownMenu.vue"

export interface Props {
    class?: string
}

const props = defineProps<Props>()

const context = inject(DROPDOWN_CONTEXT_KEY)

if (!context) {
    throw new Error("DropdownMenuContent must be used within a DropdownMenu component")
}

const {
    is_open,
    content_ref,
    dropdown_id,
    position_styles,
    handleContentKeyDown
} = context

const content_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    content_ref.value = content_element.value
})

watch(is_open, async (open) => {
    if (open) {
        await nextTick()
        content_element.value?.focus()
    }
})

const base_classes = cn(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1",
    "text-popover-foreground shadow-md outline-none",
    "animate-in fade-in-0 zoom-in-95"
)
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
