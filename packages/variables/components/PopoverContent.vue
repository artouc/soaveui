<template>
    <CorePopoverContent :class="computedClasses">
        <slot />
    </CorePopoverContent>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { PopoverContent as CorePopoverContent } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["popover__content", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/popover.css";
</style>
