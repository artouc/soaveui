<template>
    <CoreCardContent :class="computedClasses">
        <slot />
    </CoreCardContent>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { CardContent as CoreCardContent } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["card__content", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/card.css";
</style>
