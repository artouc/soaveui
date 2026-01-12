<template>
    <div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useCard } from "../composables/useCard"

const props = withDefaults(defineProps<{
    padding?: "none" | "sm" | "md" | "lg"
}>(), {
    padding: "md"
})

// Composable is available for state access if needed
const composable = useCard(toRef(() => props))

// Export state for external access
defineExpose({
    state: composable.state
})
</script>
