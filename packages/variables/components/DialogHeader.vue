<template>
    <CoreDialogHeader :class="computedClasses">
        <slot />
    </CoreDialogHeader>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DialogHeader as CoreDialogHeader } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["dialog__header", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dialog.css";
</style>
