<template>
    <CoreCardHeader :class="computedClasses">
        <slot />
    </CoreCardHeader>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { CardHeader as CoreCardHeader } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["card__header", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/card.css";
</style>
