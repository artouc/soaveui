<template>
    <CoreFormInput
        :class="computedClasses"
        :id="id"
        :name="name"
        :error="error"
    >
        <slot />
    </CoreFormInput>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { FormInput as CoreFormInput } from "@soave/ui"

const props = defineProps<{
    id?: string
    name?: string
    error?: string
    class?: string
}>()

const computedClasses = computed(() => {
    return [
        "form-input",
        props.error && "form-input--error",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/form.css";
</style>
