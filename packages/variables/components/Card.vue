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
import type { CardProps } from "@soave/ui"

interface StyledCardProps extends CardProps {
    class?: string
}

const props = withDefaults(defineProps<StyledCardProps>(), {
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
