<template>
    <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :data-variant="variant"
        :data-state="is_visible ? 'open' : 'closed'"
    >
        <slot :close="close" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const props = withDefaults(defineProps<{
    variant?: "default" | "success" | "error" | "warning" | "info"
    duration?: number
    closable?: boolean
}>(), {
    variant: "default",
    duration: 5000,
    closable: true
})

const emit = defineEmits<{
    close: []
}>()

const is_visible = ref(true)
let timeout_id: ReturnType<typeof setTimeout> | null = null

const close = () => {
    is_visible.value = false
    emit("close")
}

onMounted(() => {
    if (props.duration > 0) {
        timeout_id = setTimeout(close, props.duration)
    }
})

onUnmounted(() => {
    if (timeout_id) {
        clearTimeout(timeout_id)
    }
})

defineOptions({
    name: "Toast"
})

defineExpose({
    close
})
</script>
