<template>
    <button
        ref="trigger_element"
        type="button"
        :aria-expanded="is_open"
        :aria-controls="popover_id"
        :aria-haspopup="true"
        @click="handleTriggerClick"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect } from "vue"
import { POPOVER_CONTEXT_KEY } from "../../types/popover"

const context = inject(POPOVER_CONTEXT_KEY)

if (!context) {
    throw new Error("PopoverTrigger must be used within a Popover component")
}

const {
    is_open,
    trigger_ref,
    popover_id,
    handleTriggerClick
} = context

const trigger_element = ref<HTMLElement | null>(null)

watchEffect(() => {
    trigger_ref.value = trigger_element.value
})
</script>
