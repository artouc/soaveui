<template>
    <Teleport to="body">
        <div
            :class="cn(container_classes, position_classes[position], props.class)"
            aria-label="Notifications"
        >
            <TransitionGroup
                name="toast"
                tag="div"
                :class="cn('flex flex-col', gap_class)"
            >
                <Toast
                    v-for="toast in visible_toasts"
                    :key="toast.id"
                    :title="toast.title"
                    :description="toast.description"
                    :variant="toast.variant"
                    :dismissible="toast.dismissible"
                    :action="toast.action"
                    @dismiss="handleDismiss(toast.id)"
                />
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { cn } from "../../utils/cn"
import { useToast } from "../../composables/useToast"
import Toast from "./Toast.vue"
import type { ToastPosition, Toast as ToastType } from "../../types/toast"

export interface Props {
    position?: ToastPosition
    max_toasts?: number
    gap?: number
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    position: "bottom-right",
    max_toasts: 5,
    gap: 8
})

const { toasts, dismiss } = useToast()

const internal_toasts = ref<ToastType[]>([])

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

const container_classes = "fixed z-[100] flex pointer-events-none p-4"

const position_classes: Record<ToastPosition, string> = {
    "top-left": "top-0 left-0 flex-col",
    "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col items-center",
    "top-right": "top-0 right-0 flex-col items-end",
    "bottom-left": "bottom-0 left-0 flex-col-reverse",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse items-center",
    "bottom-right": "bottom-0 right-0 flex-col-reverse items-end"
}

const gap_class = computed(() => `gap-${props.gap / 4}`)
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
