<template>
    <CoreDialogTitle :class="computedClasses">
        <slot />
    </CoreDialogTitle>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DialogTitle as CoreDialogTitle } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["dialog__title", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dialog.css";
</style>
