<template>
    <Transition name="dropdown">
        <div
            v-if="is_open"
            ref="content_element"
            :id="dropdown_id"
            role="menu"
            :aria-labelledby="`${dropdown_id}-trigger`"
            :style="position_styles"
            :class="[computed_classes, props.class]"
            tabindex="-1"
            @keydown="handleContentKeyDown"
        >
            <slot />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, ref, computed, watchEffect, nextTick, watch } from "vue"
import { useStyleAdapter } from "../../composables"
import type { DropdownContentProps } from "../../types/dropdown"
import { DROPDOWN_CONTEXT_KEY } from "../../types/dropdown"
import type { DropdownState } from "../../types/composables"

const props = withDefaults(defineProps<DropdownContentProps>(), {
    unstyled: false
})

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

const style_adapter = useStyleAdapter()
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

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: DropdownState = {
        is_open: is_open.value
    }
    return style_adapter.getClasses("dropdown", state)
})
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
