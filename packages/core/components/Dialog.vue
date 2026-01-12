<template>
    <Teleport to="body">
        <div
            v-if="is_open"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
            :aria-describedby="descriptionId"
        >
            <!-- Overlay -->
            <div
                @click="handleOverlayClick"
                @keydown.escape="close"
            />
            <!-- Content -->
            <div
                ref="content_ref"
                tabindex="-1"
                @keydown.escape="close"
            >
                <slot :close="close" />
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, provide } from "vue"
import type { Ref, InjectionKey } from "vue"
import { useDialog } from "../composables/useDialog"

interface DialogContext {
    is_open: Ref<boolean>
    close: () => void
    titleId?: string
    descriptionId?: string
}

const DIALOG_KEY: InjectionKey<DialogContext> = Symbol("dialog")

const props = withDefaults(defineProps<{
    closeOnOverlay?: boolean
    closeOnEscape?: boolean
    titleId?: string
    descriptionId?: string
}>(), {
    closeOnOverlay: true,
    closeOnEscape: true
})

const model = defineModel<boolean>("open", { default: false })

const content_ref = ref<HTMLElement | null>(null)
const dialog = useDialog()
const { is_open, open, close, toggle } = dialog

// Sync with v-model
watch(model, (value) => {
    if (value) {
        open()
    } else {
        close()
    }
}, { immediate: true })

watch(is_open, (value) => {
    model.value = value
})

const handleOverlayClick = () => {
    if (props.closeOnOverlay) {
        close()
    }
}

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && props.closeOnEscape && is_open.value) {
        close()
    }
}

// Provide context for child components
const context: DialogContext = {
    is_open,
    close,
    titleId: props.titleId,
    descriptionId: props.descriptionId
}
provide(DIALOG_KEY, context)

onMounted(() => {
    document.addEventListener("keydown", handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener("keydown", handleKeyDown)
})

defineExpose({
    is_open,
    open,
    close,
    toggle
})
</script>
