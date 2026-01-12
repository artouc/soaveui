<template>
    <CoreCard
        :class="computedClasses"
        :padding="padding"
    >
        <slot />
    </CoreCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Card as CoreCard } from "@soave/ui"
import type { CardPadding } from "@soave/ui"

const props = withDefaults(defineProps<{
    padding?: CardPadding
    class?: string
}>(), {
    padding: "md"
})

const computedClasses = computed(() => {
    return [
        "card",
        `card--${props.padding}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/card.css";
</style>
