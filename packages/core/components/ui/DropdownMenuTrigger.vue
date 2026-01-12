<template>
    <button
        ref="trigger_element"
        type="button"
        :aria-expanded="is_open"
        :aria-controls="dropdown_id"
        :aria-haspopup="true"
        @click="handleTriggerClick"
        @keydown="handleTriggerKeyDown"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect } from "vue"
import { DROPDOWN_CONTEXT_KEY } from "../../types/dropdown"

const context = inject(DROPDOWN_CONTEXT_KEY)

if (!context) {
    throw new Error("DropdownMenuTrigger must be used within a DropdownMenu component")
}

const {
    is_open,
    trigger_ref,
    dropdown_id,
    handleTriggerClick,
    handleTriggerKeyDown
} = context

const trigger_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    trigger_ref.value = trigger_element.value
})
</script>
