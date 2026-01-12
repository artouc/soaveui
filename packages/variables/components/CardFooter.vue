<template>
    <CoreCardFooter :class="computedClasses">
        <slot />
    </CoreCardFooter>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { CardFooter as CoreCardFooter } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["card__footer", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/card.css";
</style>
