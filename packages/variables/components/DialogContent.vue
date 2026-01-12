<template>
    <CoreDialogContent :class="computedClasses">
        <slot />
    </CoreDialogContent>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DialogContent as CoreDialogContent } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["dialog__content", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dialog.css";
</style>
