<template>
    <CoreSelectTrigger :class="computedClasses">
        <slot />
        <svg
            class="select__chevron"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <polyline points="4 6 8 10 12 6" />
        </svg>
    </CoreSelectTrigger>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SelectTrigger as CoreSelectTrigger } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["select__trigger", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/select.css";
</style>
