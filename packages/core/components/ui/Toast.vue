<template>
    <div
        :class="[computed_classes, props.class]"
        :role="aria_role"
        :aria-live="aria_live"
        aria-atomic="true"
    >
        <div class="flex-1 space-y-1">
            <div v-if="title" :class="title_classes">
                {{ title }}
            </div>
            <div v-if="description" :class="description_classes">
                {{ description }}
            </div>
        </div>

        <div v-if="action || dismissible" class="flex items-center gap-2 ml-4">
            <button
                v-if="action"
                type="button"
                :class="action_classes"
                @click="action.onClick"
            >
                {{ action.label }}
            </button>

            <button
                v-if="dismissible"
                type="button"
                :class="dismiss_classes"
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
import { useStyleAdapter } from "../../composables"
import type { ToastVariant, ToastAction } from "../../types/toast"
import type { ToastState } from "../../types/composables"

export interface Props {
    title?: string
    description?: string
    variant?: ToastVariant
    dismissible?: boolean
    action?: ToastAction
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    dismissible: true,
    unstyled: false
})

const emit = defineEmits<{
    dismiss: []
}>()

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: ToastState = {
        variant: props.variant
    }
    return style_adapter.getClasses("toast", state)
})

const title_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("toast-title", {})
})

const description_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("toast-description", {})
})

const action_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("toast-action", {})
})

const dismiss_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("toast-dismiss", {})
})

const aria_role = computed(() => {
    return props.variant === "error" ? "alert" : "status"
})

const aria_live = computed(() => {
    return props.variant === "error" ? "assertive" : "polite"
})
</script>
