<template>
    <Teleport to="body">
        <Transition name="dialog">
            <div
                v-if="is_open"
                class="fixed inset-0 z-50 flex items-center justify-center"
            >
                <div
                    :class="overlay_classes"
                    @click="handleOverlayClick"
                />
                <div
                    :class="[computed_classes, props.class]"
                    role="dialog"
                    aria-modal="true"
                >
                    <slot />
                    <button
                        v-if="show_close_button"
                        :class="close_button_classes"
                        @click="close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="h-4 w-4"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                        <span class="sr-only">閉じる</span>
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, provide } from "vue"
import { useStyleAdapter } from "../../composables"
import type { DialogProps } from "../../types/dialog"
import { DIALOG_KEY } from "../../types/dialog"
import type { DialogState } from "../../types/composables"

interface DialogComponentProps extends DialogProps {
    class?: string
}

const props = withDefaults(defineProps<DialogComponentProps>(), {
    open: false,
    modal: true,
    showCloseButton: true,
    unstyled: false
})

const emit = defineEmits<{
    "update:open": [value: boolean]
}>()

const style_adapter = useStyleAdapter()

const is_open = computed({
    get: () => props.open,
    set: (value) => emit("update:open", value)
})

const show_close_button = computed(() => props.showCloseButton)

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: DialogState = {
        is_open: is_open.value
    }
    return style_adapter.getClasses("dialog", state)
})

const overlay_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("dialog-overlay", {})
})

const close_button_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("dialog-close", {})
})

const close = () => {
    is_open.value = false
}

const handleOverlayClick = () => {
    if (props.modal) {
        close()
    }
}

provide(DIALOG_KEY, { close })
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
    transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
}
</style>
