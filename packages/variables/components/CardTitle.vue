<template>
    <CoreCardTitle :class="computedClasses">
        <slot />
    </CoreCardTitle>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { CardTitle as CoreCardTitle } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["card__title", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/card.css";
</style>
