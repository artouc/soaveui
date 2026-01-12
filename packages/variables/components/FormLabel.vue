<template>
    <CoreFormLabel :class="computedClasses" :for="htmlFor" :required="required">
        <slot />
    </CoreFormLabel>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { FormLabel as CoreFormLabel } from "@soave/ui"

const props = defineProps<{
    for?: string
    required?: boolean
    class?: string
}>()

const htmlFor = computed(() => props.for)

const computedClasses = computed(() => {
    return [
        "form-label",
        props.required && "form-label--required",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/form.css";
</style>
