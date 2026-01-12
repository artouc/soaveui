<template>
    <CoreToaster
        :class="computedClasses"
        :position="position"
        :max_toasts="maxToasts"
        :gap="gap"
    >
        <template #default="{ toasts }">
            <Toast
                v-for="toast in toasts"
                :key="toast.id"
                :id="toast.id"
                :title="toast.title"
                :description="toast.description"
                :variant="toast.variant"
                :duration="toast.duration"
                :dismissible="toast.dismissible"
                :action="toast.action"
            />
        </template>
    </CoreToaster>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Toaster as CoreToaster } from "@soave/ui"
import type { ToastPosition } from "@soave/ui"
import Toast from "./Toast.vue"

const props = withDefaults(defineProps<{
    position?: ToastPosition
    maxToasts?: number
    gap?: number
    class?: string
}>(), {
    position: "bottom-right",
    maxToasts: 5,
    gap: 8
})

const computedClasses = computed(() => {
    return [
        "toaster",
        `toaster--${props.position}`,
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/toast.css";
</style>
