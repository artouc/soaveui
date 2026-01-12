<template>
    <div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useCard } from "../../composables/useCard"
import type { CardProps } from "../../types/card"

const props = withDefaults(defineProps<CardProps>(), {
    padding: "md"
})

// Composable is available for state access if needed
const composable = useCard(toRef(() => props))

// Export state for external access
defineExpose({
    state: composable.state
})
</script>
