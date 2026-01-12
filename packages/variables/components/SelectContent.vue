<template>
    <CoreSelectContent :class="computedClasses">
        <slot />
    </CoreSelectContent>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SelectContent as CoreSelectContent } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["select__content", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/select.css";
</style>
