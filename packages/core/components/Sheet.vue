<template>
    <Teleport to="body">
        <div
            v-if="is_open"
            :data-side="side"
        >
            <slot :close="close" :is_open="is_open" />
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, provide, onMounted, onUnmounted } from "vue"
import type { Ref, InjectionKey } from "vue"

interface SheetContext {
    is_open: Ref<boolean>
    side: "top" | "right" | "bottom" | "left"
    close: () => void
}

const SHEET_KEY: InjectionKey<SheetContext> = Symbol("sheet")

const props = withDefaults(defineProps<{
    side?: "top" | "right" | "bottom" | "left"
    closeOnOverlay?: boolean
    closeOnEscape?: boolean
}>(), {
    side: "right",
    closeOnOverlay: true,
    closeOnEscape: true
})

const model = defineModel<boolean>("open", { default: false })

const is_open = ref(false)

const open = () => {
    is_open.value = true
}

const close = () => {
    is_open.value = false
}

watch(model, (value) => {
    is_open.value = value
}, { immediate: true })

watch(is_open, (value) => {
    model.value = value
})

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && props.closeOnEscape && is_open.value) {
        close()
    }
}

provide(SHEET_KEY, {
    is_open,
    side: props.side,
    close
})

onMounted(() => {
    document.addEventListener("keydown", handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener("keydown", handleKeyDown)
})

defineOptions({
    name: "Sheet"
})

defineExpose({
    is_open,
    open,
    close
})
</script>
