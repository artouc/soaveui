<template>
    <Teleport to="body">
        <div
            :class="[computed_classes, props.class]"
            aria-label="Notifications"
        >
            <TransitionGroup
                name="toast"
                tag="div"
                class="flex flex-col gap-2"
            >
                <Toast
                    v-for="toast in visible_toasts"
                    :key="toast.id"
                    :title="toast.title"
                    :description="toast.description"
                    :variant="toast.variant"
                    :dismissible="toast.dismissible"
                    :action="toast.action"
                    :unstyled="unstyled"
                    @dismiss="handleDismiss(toast.id)"
                />
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { useStyleAdapter } from "../../composables"
import { useToast } from "../../composables/useToast"
import Toast from "./Toast.vue"
import type { ToastPosition, ToastItem } from "../../types/toast"

export interface Props {
    position?: ToastPosition
    max_toasts?: number
    gap?: number
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    position: "bottom-right",
    max_toasts: 5,
    gap: 8,
    unstyled: false
})

const { toasts, dismiss } = useToast()
const style_adapter = useStyleAdapter()

const internal_toasts = ref<ToastItem[]>([])

watchEffect(() => {
    internal_toasts.value = [...toasts]
})

const visible_toasts = computed(() => {
    const sorted = [...internal_toasts.value].sort((a, b) => b.created_at - a.created_at)
    return sorted.slice(0, props.max_toasts)
})

const handleDismiss = (id: string): void => {
    dismiss(id)
}

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("toaster", { position: props.position })
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.toast-move {
    transition: transform 0.3s ease;
}
</style>
