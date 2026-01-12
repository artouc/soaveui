<template>
    <button
        ref="button_ref"
        type="button"
        :class="[computed_classes, props.class]"
        :disabled="is_disabled"
        :aria-expanded="context?.is_open.value"
        aria-haspopup="listbox"
        @click="handleClick"
    >
        <slot />
        <svg
            :class="icon_classes"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    </button>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, onUnmounted } from "vue"
import { useStyleAdapter } from "../../composables"
import type { SelectContext, SelectTriggerProps } from "../../types/select"
import { SELECT_KEY } from "../../types/select"
import type { SelectState } from "../../types/composables"

const props = withDefaults(defineProps<SelectTriggerProps>(), {
    unstyled: false
})

const context = inject<SelectContext>(SELECT_KEY)
const style_adapter = useStyleAdapter()
const button_ref = ref<HTMLButtonElement | null>(null)

const is_disabled = computed(() => context?.disabled.value ?? false)

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: SelectState = {
        size: context?.size.value ?? "md",
        disabled: is_disabled.value,
        is_open: context?.is_open.value ?? false
    }
    return style_adapter.getClasses("select", state)
})

const icon_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("select-trigger-icon", {})
})

onMounted(() => {
    context?.setTriggerRef(button_ref.value)
})

onUnmounted(() => {
    context?.setTriggerRef(null)
})

const handleClick = () => {
    context?.toggle()
}
</script>
