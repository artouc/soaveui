<template>
    <CoreFormTextarea :class="computedClasses">
        <slot />
    </CoreFormTextarea>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { FormTextarea as CoreFormTextarea } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["form-textarea", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/form.css";
</style>
