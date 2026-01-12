<template>
    <CoreRadioItem
        :value="value"
        :size="size"
        :disabled="disabled"
        :class="computedClasses"
    >
        <template #default="{ checked }">
            <span class="radio__indicator">
                <span v-if="checked" class="radio__dot" />
            </span>
        </template>
    </CoreRadioItem>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { RadioItem as CoreRadioItem } from "@soave/ui"
import type { RadioSize } from "@soave/ui"

const props = withDefaults(defineProps<{
    value: string
    size?: RadioSize
    disabled?: boolean
    class?: string
}>(), {
    size: "md",
    disabled: false
})

const computedClasses = computed(() => {
    return [
        "radio",
        `radio--${props.size}`,
        props.disabled && "radio--disabled",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/radio.css";
</style>
