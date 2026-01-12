<template>
    <CoreSelectValue :class="computedClasses">
        <slot />
    </CoreSelectValue>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SelectValue as CoreSelectValue } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["select__value", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/select.css";
</style>
