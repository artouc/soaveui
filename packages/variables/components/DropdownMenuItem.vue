<template>
    <CoreDropdownMenuItem
        :class="computedClasses"
        :disabled="disabled"
        :destructive="destructive"
        @click="emit('click', $event)"
    >
        <slot />
    </CoreDropdownMenuItem>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { DropdownMenuItem as CoreDropdownMenuItem } from "@soave/ui"

const props = withDefaults(defineProps<{
    disabled?: boolean
    destructive?: boolean
    class?: string
}>(), {
    disabled: false,
    destructive: false
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const computedClasses = computed(() => {
    return [
        "dropdown__item",
        props.disabled && "dropdown__item--disabled",
        props.destructive && "dropdown__item--destructive",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/dropdown.css";
</style>
