<template>
    <div
        :class="cn(base_classes, variant_classes[variant], props.class)"
        :role="aria_role"
        :aria-live="aria_live"
        aria-atomic="true"
    >
        <div class="flex-1 space-y-1">
            <div v-if="title" class="text-sm font-semibold">
                {{ title }}
            </div>
            <div v-if="description" class="text-sm opacity-90">
                {{ description }}
            </div>
        </div>

        <div v-if="action || dismissible" class="flex items-center gap-2 ml-4">
            <button
                v-if="action"
                type="button"
                :class="action_button_classes"
                @click="action.onClick"
            >
                {{ action.label }}
            </button>

            <button
                v-if="dismissible"
                type="button"
                :class="dismiss_button_classes"
                aria-label="Dismiss"
                @click="emit('dismiss')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../../utils/cn"
import type { ToastVariant, ToastAction } from "../../types/toast"

export interface Props {
    title?: string
    description?: string
    variant?: ToastVariant
    dismissible?: boolean
    action?: ToastAction
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    dismissible: true
})

const emit = defineEmits<{
    dismiss: []
}>()

const base_classes = "pointer-events-auto flex items-start gap-4 rounded-lg border p-4 shadow-lg transition-all"

const variant_classes: Record<ToastVariant, string> = {
    default: "bg-background text-foreground border-border",
    success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800",
    error: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800",
    info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800"
}

const aria_role = computed(() => {
    return props.variant === "error" ? "alert" : "status"
})

const aria_live = computed(() => {
    return props.variant === "error" ? "assertive" : "polite"
})

const action_button_classes = cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    "h-8 px-3 ring-offset-background transition-colors",
    "hover:bg-secondary focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2"
)

const dismiss_button_classes = cn(
    "inline-flex items-center justify-center rounded-md",
    "h-6 w-6 shrink-0 opacity-70 transition-opacity",
    "hover:opacity-100 focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring"
)
</script>
