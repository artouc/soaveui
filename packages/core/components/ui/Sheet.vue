<template>
    <Teleport to="body">
        <Transition name="sheet-overlay">
            <div
                v-if="is_open"
                class="fixed inset-0 z-50 bg-black/80"
                @click="handleOverlayClick"
            />
        </Transition>

        <Transition :name="transition_name">
            <div
                v-if="is_open"
                ref="sheet_element"
                role="dialog"
                aria-modal="true"
                :class="cn(base_classes, side_classes[side], props.class)"
                tabindex="-1"
                @keydown.escape="close"
            >
                <slot />

                <button
                    v-if="show_close_button"
                    type="button"
                    class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Close"
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
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, onMounted, onUnmounted, type InjectionKey } from "vue"
import { cn } from "../../utils/cn"
import type { SheetSide, SheetContext } from "../../types/sheet"

export interface Props {
    open?: boolean
    side?: SheetSide
    show_close_button?: boolean
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    side: "right",
    show_close_button: true
})

const emit = defineEmits<{
    "update:open": [value: boolean]
}>()

export const SHEET_CONTEXT_KEY: InjectionKey<SheetContext> = Symbol("sheet-context")

const is_open = ref(props.open)
const sheet_element = ref<HTMLElement | null>(null)

watch(() => props.open, (value) => {
    is_open.value = value
})

const open = (): void => {
    is_open.value = true
    emit("update:open", true)
}

const close = (): void => {
    is_open.value = false
    emit("update:open", false)
}

const handleOverlayClick = (): void => {
    close()
}

const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && is_open.value) {
        close()
    }
}

onMounted(() => {
    document.addEventListener("keydown", handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener("keydown", handleKeyDown)
})

watch(is_open, (open) => {
    if (open) {
        document.body.style.overflow = "hidden"
    } else {
        document.body.style.overflow = ""
    }
})

const side = computed(() => props.side)

const transition_name = computed(() => `sheet-${side.value}`)

provide(SHEET_CONTEXT_KEY, {
    is_open: is_open.value,
    side: side.value,
    open,
    close
})

const base_classes = "fixed z-50 gap-4 bg-background p-6 shadow-lg"

const side_classes: Record<SheetSide, string> = {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
}
</script>

<style scoped>
.sheet-overlay-enter-active,
.sheet-overlay-leave-active {
    transition: opacity 0.3s ease;
}

.sheet-overlay-enter-from,
.sheet-overlay-leave-to {
    opacity: 0;
}

.sheet-right-enter-active,
.sheet-right-leave-active,
.sheet-left-enter-active,
.sheet-left-leave-active,
.sheet-top-enter-active,
.sheet-top-leave-active,
.sheet-bottom-enter-active,
.sheet-bottom-leave-active {
    transition: transform 0.3s ease;
}

.sheet-right-enter-from,
.sheet-right-leave-to {
    transform: translateX(100%);
}

.sheet-left-enter-from,
.sheet-left-leave-to {
    transform: translateX(-100%);
}

.sheet-top-enter-from,
.sheet-top-leave-to {
    transform: translateY(-100%);
}

.sheet-bottom-enter-from,
.sheet-bottom-leave-to {
    transform: translateY(100%);
}
</style>
