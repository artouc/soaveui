<template>
    <CoreAlert
        :class="computedClasses"
        :variant="variant"
    >
        <slot />
    </CoreAlert>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Alert as CoreAlert } from "@soave/ui"
import type { AlertVariant } from "@soave/ui"

const props = withDefaults(defineProps<{
    variant?: AlertVariant
    class?: string
}>(), {
    variant: "default"
})

const computedClasses = computed(() => {
    return [
        "alert",
        `alert--${props.variant}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/alert.css";
</style>
