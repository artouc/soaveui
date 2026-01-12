<template>
    <CoreSheetDescription :class="computedClasses">
        <slot />
    </CoreSheetDescription>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SheetDescription as CoreSheetDescription } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["sheet__description", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/sheet.css";
</style>
