<template>
    <CoreDropdownMenuContent :class="computedClasses">
        <slot />
    </CoreDropdownMenuContent>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DropdownMenuContent as CoreDropdownMenuContent } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["dropdown__content", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dropdown.css";
</style>
