<template>
    <Teleport to="body">
        <Transition name="dialog">
            <div
                v-if="is_open"
                class="fixed inset-0 z-50 flex items-center justify-center"
            >
                <div
                    class="fixed inset-0 bg-black/80"
                    @click="handleOverlayClick"
                />
                <div
                    class="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg"
                    role="dialog"
                    aria-modal="true"
                >
                    <slot />
                    <button
                        v-if="show_close_button"
                        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
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
import { computed, provide, type InjectionKey } from "vue"

interface Props {
    open?: boolean
    modal?: boolean
    showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    modal: true,
    showCloseButton: true
})

const emit = defineEmits<{
    "update:open": [value: boolean]
}>()

const is_open = computed({
    get: () => props.open,
    set: (value) => emit("update:open", value)
})

const show_close_button = computed(() => props.showCloseButton)

const close = () => {
    is_open.value = false
}

const handleOverlayClick = () => {
    if (props.modal) {
        close()
    }
}

export interface DialogContext {
    close: () => void
}

export const DialogKey: InjectionKey<DialogContext> = Symbol("dialog")

provide(DialogKey, { close })
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
