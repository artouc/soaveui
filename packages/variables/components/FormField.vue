<template>
    <CoreFormField :class="computedClasses" :name="name">
        <slot />
    </CoreFormField>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { FormField as CoreFormField } from "@soave/ui"

const props = defineProps<{
    name?: string
    class?: string
}>()

const computedClasses = computed(() => {
    return ["form-field", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/form.css";
</style>
