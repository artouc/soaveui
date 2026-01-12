<template>
    <CoreAlertDescription :class="computedClasses">
        <slot />
    </CoreAlertDescription>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { AlertDescription as CoreAlertDescription } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["alert__description", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/alert.css";
</style>
