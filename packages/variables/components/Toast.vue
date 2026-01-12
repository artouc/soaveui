<template>
    <CoreToast
        :class="computedClasses"
        :id="id"
        :title="title"
        :description="description"
        :variant="variant"
        :duration="duration"
        :dismissible="dismissible"
        :action="action"
    >
        <slot />
    </CoreToast>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Toast as CoreToast } from "@soave/ui"
import type { ToastVariant, ToastAction } from "@soave/ui"

const props = withDefaults(defineProps<{
    id?: string
    title?: string
    description?: string
    variant?: ToastVariant
    duration?: number
    dismissible?: boolean
    action?: ToastAction
    class?: string
}>(), {
    variant: "default",
    duration: 5000,
    dismissible: true
})

const computedClasses = computed(() => {
    return [
        "toast",
        `toast--${props.variant}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/toast.css";
</style>
