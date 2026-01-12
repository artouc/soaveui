<template>
    <CoreDialogFooter :class="computedClasses">
        <slot />
    </CoreDialogFooter>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DialogFooter as CoreDialogFooter } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["dialog__footer", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dialog.css";
</style>
