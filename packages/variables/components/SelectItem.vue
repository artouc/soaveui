<template>
    <CoreSelectItem
        :value="value"
        :disabled="disabled"
        :class="computedClasses"
    >
        <slot />
    </CoreSelectItem>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SelectItem as CoreSelectItem } from "@soave/ui"

const props = withDefaults(defineProps<{
    value: string
    disabled?: boolean
    class?: string
}>(), {
    disabled: false
})

const computedClasses = computed(() => {
    return [
        "select__item",
        props.disabled && "select__item--disabled",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/select.css";
</style>
