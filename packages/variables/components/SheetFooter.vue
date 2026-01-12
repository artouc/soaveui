<template>
    <CoreSheetFooter :class="computedClasses">
        <slot />
    </CoreSheetFooter>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SheetFooter as CoreSheetFooter } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["sheet__footer", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/sheet.css";
</style>
