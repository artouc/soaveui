<template>
    <Teleport to="body">
        <Transition name="sheet-overlay">
            <div
                v-if="is_open"
                :class="overlay_classes"
                @click="handleOverlayClick"
            />
        </Transition>

        <Transition :name="transition_name">
            <div
                v-if="is_open"
                ref="sheet_element"
                role="dialog"
                aria-modal="true"
                :class="[computed_classes, props.class]"
                tabindex="-1"
                @keydown.escape="close"
            >
                <slot />

                <button
                    v-if="show_close_button"
                    type="button"
                    :class="close_button_classes"
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
import { ref, computed, watch, provide, onMounted, onUnmounted } from "vue"
import { useStyleAdapter } from "../../composables"
import type { SheetSide, SheetContext, SheetProps } from "../../types/sheet"
import { SHEET_CONTEXT_KEY } from "../../types/sheet"
import type { SheetState } from "../../types/composables"

interface Props extends SheetProps {}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    side: "right",
    showCloseButton: true,
    unstyled: false
})

const emit = defineEmits<{
    "update:open": [value: boolean]
}>()


const style_adapter = useStyleAdapter()
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

const side = computed(() => props.side ?? "right")
const show_close_button = computed(() => props.showCloseButton)
const transition_name = computed(() => `sheet-${side.value}`)

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: SheetState = {
        is_open: is_open.value,
        side: side.value
    }
    return style_adapter.getClasses("sheet", state)
})

const overlay_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("sheet-overlay", {})
})

const close_button_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("sheet-close", {})
})

provide(SHEET_CONTEXT_KEY, {
    is_open: is_open.value,
    side: side.value,
    open,
    close
})
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
