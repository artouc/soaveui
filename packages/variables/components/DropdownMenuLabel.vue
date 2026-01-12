<template>
    <CoreDropdownMenuLabel :class="computedClasses">
        <slot />
    </CoreDropdownMenuLabel>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DropdownMenuLabel as CoreDropdownMenuLabel } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["dropdown__label", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dropdown.css";
</style>
