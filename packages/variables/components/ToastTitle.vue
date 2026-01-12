<template>
    <CoreToastTitle :class="computedClasses">
        <slot />
    </CoreToastTitle>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ToastTitle as CoreToastTitle } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["toast__title", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/toast.css";
</style>
