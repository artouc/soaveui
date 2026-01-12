<template>
    <CoreDialog
        :open="open"
        :modal="modal"
        :show-close-button="showCloseButton"
        @update:open="emit('update:open', $event)"
    >
        <slot />
    </CoreDialog>
</template>

<script setup lang="ts">
import { Dialog as CoreDialog } from "@soave/ui"

const props = withDefaults(defineProps<{
    open?: boolean
    modal?: boolean
    showCloseButton?: boolean
}>(), {
    open: false,
    modal: true,
    showCloseButton: true
})

const emit = defineEmits<{
    "update:open": [value: boolean]
}>()
</script>

<style>
@import "../styles/dialog.css";
</style>
