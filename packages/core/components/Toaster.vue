<template>
    <Teleport to="body">
        <div
            :data-position="position"
            aria-live="polite"
            aria-label="Notifications"
        >
            <slot :toasts="toasts" :dismiss="dismiss" />
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

interface ToastItem {
    id: string
    title?: string
    description?: string
    variant?: "default" | "success" | "error" | "warning" | "info"
    duration?: number
}

const props = withDefaults(defineProps<{
    position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
    maxToasts?: number
}>(), {
    position: "bottom-right",
    maxToasts: 5
})

const toasts = ref<ToastItem[]>([])

const add = (toast: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const new_toast: ToastItem = { ...toast, id }

    toasts.value = [...toasts.value, new_toast].slice(-props.maxToasts)

    if (toast.duration !== 0) {
        const duration = toast.duration ?? 5000
        setTimeout(() => dismiss(id), duration)
    }

    return id
}

const dismiss = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
}

const dismissAll = () => {
    toasts.value = []
}

// Global toast event listener
const handleToastEvent = (event: CustomEvent<Omit<ToastItem, "id">>) => {
    add(event.detail)
}

onMounted(() => {
    window.addEventListener("soave:toast" as any, handleToastEvent)
})

onUnmounted(() => {
    window.removeEventListener("soave:toast" as any, handleToastEvent)
})

defineOptions({
    name: "Toaster"
})

defineExpose({
    toasts,
    add,
    dismiss,
    dismissAll
})
</script>
