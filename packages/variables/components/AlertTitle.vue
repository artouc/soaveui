<template>
    <CoreAlertTitle :class="computedClasses">
        <slot />
    </CoreAlertTitle>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { AlertTitle as CoreAlertTitle } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["alert__title", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/alert.css";
</style>
