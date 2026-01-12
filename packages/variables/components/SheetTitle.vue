<template>
    <CoreSheetTitle :class="computedClasses">
        <slot />
    </CoreSheetTitle>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SheetTitle as CoreSheetTitle } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["sheet__title", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/sheet.css";
</style>
