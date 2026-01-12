<template>
    <CoreFormError :class="computedClasses">
        <slot />
    </CoreFormError>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { FormError as CoreFormError } from "@soave/ui"

const props = defineProps<{
    class?: string
}>()

const computedClasses = computed(() => {
    return ["form-error", props.class].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/form.css";
</style>
