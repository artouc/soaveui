<template>
    <CoreSheetContent :class="computedClasses">
        <slot />
    </CoreSheetContent>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import { SheetContent as CoreSheetContent, SHEET_CONTEXT_KEY } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const context = inject(SHEET_CONTEXT_KEY, null)
const side = computed(() => context?.side ?? "right")

const computedClasses = computed(() => {
    return [
        "sheet__content",
        `sheet__content--${side.value}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/sheet.css";
</style>
