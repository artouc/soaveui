<template>
    <CoreToastDescription :class="computedClasses">
        <slot />
    </CoreToastDescription>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ToastDescription as CoreToastDescription } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["toast__description", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/toast.css";
</style>
