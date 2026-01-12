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
    const base = "rounded-lg border bg-card text-card-foreground shadow-sm"

    const paddings: Record<string, string> = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
    }

    return [
        base,
        paddings[props.padding ?? "md"],
        props.class
    ].filter(Boolean).join(" ")
})
</script>
