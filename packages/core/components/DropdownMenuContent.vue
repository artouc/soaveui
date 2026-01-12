<template>
    <div
        v-if="is_open"
        role="menu"
        tabindex="-1"
        :data-side="side"
        :data-align="align"
        @keydown="handleKeyDown"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue"
import type { Ref, InjectionKey } from "vue"

interface DropdownMenuContext {
    is_open: Ref<boolean>
    trigger_ref: Ref<HTMLElement | null>
    open: () => void
    close: () => void
    toggle: () => void
    setTriggerRef: (el: HTMLElement | null) => void
}

const DROPDOWN_MENU_KEY: InjectionKey<DropdownMenuContext> = Symbol("dropdown-menu")

const props = withDefaults(defineProps<{
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
}>(), {
    side: "bottom",
    align: "start"
})

const context = inject<DropdownMenuContext | null>(DROPDOWN_MENU_KEY, null)
const is_open = context?.is_open

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
        context?.close()
        context?.trigger_ref.value?.focus()
    }
}

defineOptions({
    name: "DropdownMenuContent"
})
</script>
