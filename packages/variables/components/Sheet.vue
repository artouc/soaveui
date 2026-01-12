<template>
    <CoreSheet
        :open="open"
        :side="side"
        :show-close-button="showCloseButton"
        @update:open="emit('update:open', $event)"
    >
        <slot />
    </CoreSheet>
</template>

<script setup lang="ts">
import { Sheet as CoreSheet } from "@soave/ui"
import type { SheetSide } from "@soave/ui"

withDefaults(defineProps<{
    open?: boolean
    side?: SheetSide
    showCloseButton?: boolean
}>(), {
    open: false,
    side: "right",
    showCloseButton: true
})

const emit = defineEmits<{
    "update:open": [value: boolean]
}>()
</script>

<style>
@import "../styles/sheet.css";
</style>
