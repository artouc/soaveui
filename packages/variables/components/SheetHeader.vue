<template>
    <CoreSheetHeader :class="computedClasses">
        <slot />
    </CoreSheetHeader>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SheetHeader as CoreSheetHeader } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["sheet__header", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/sheet.css";
</style>
