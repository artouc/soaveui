<template>
    <CoreDialogDescription :class="computedClasses">
        <slot />
    </CoreDialogDescription>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DialogDescription as CoreDialogDescription } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["dialog__description", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dialog.css";
</style>
