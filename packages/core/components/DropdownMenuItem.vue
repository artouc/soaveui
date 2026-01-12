<template>
    <div
        role="menuitem"
        tabindex="0"
        :data-disabled="disabled ? '' : undefined"
        @click="handleClick"
        @keydown.enter="handleClick"
        @keydown.space.prevent="handleClick"
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
    disabled?: boolean
    closeOnSelect?: boolean
}>(), {
    disabled: false,
    closeOnSelect: true
})

const emit = defineEmits<{
    select: []
}>()

const context = inject<DropdownMenuContext | null>(DROPDOWN_MENU_KEY, null)

const handleClick = () => {
    if (props.disabled) return
    emit("select")
    if (props.closeOnSelect) {
        context?.close()
    }
}

defineOptions({
    name: "DropdownMenuItem"
})
</script>
