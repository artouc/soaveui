<template>
    <CoreTooltipContent :class="computedClasses">
        <slot />
    </CoreTooltipContent>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { TooltipContent as CoreTooltipContent } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["tooltip__content", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/tooltip.css";
</style>
