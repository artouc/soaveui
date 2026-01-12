<template>
    <CoreCardDescription :class="computedClasses">
        <slot />
    </CoreCardDescription>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { CardDescription as CoreCardDescription } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["card__description", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/card.css";
</style>
