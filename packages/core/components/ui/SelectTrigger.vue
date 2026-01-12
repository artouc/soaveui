<template>
    <button
        ref="button_ref"
        type="button"
        :class="composable.base_classes.value"
        :disabled="composable.is_disabled.value"
        :aria-expanded="context?.is_open.value"
        aria-haspopup="listbox"
        @click="handleClick"
    >
        <slot />
        <svg
            class="h-4 w-4 opacity-50"
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
import { inject, ref, onMounted, onUnmounted } from "vue"
import { useSelectTrigger } from "../../composables/useSelect"
import type { SelectContext } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

const context = inject<SelectContext>(SELECT_KEY)
const composable = useSelectTrigger()
const button_ref = ref<HTMLButtonElement | null>(null)

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
