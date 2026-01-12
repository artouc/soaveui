<template>
    <div
        role="menuitem"
        :tabindex="disabled ? -1 : 0"
        :class="cn(item_classes, props.class)"
        :aria-disabled="disabled"
        :data-highlighted="is_active ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @keydown.enter="handleClick"
        @keydown.space.prevent="handleClick"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject, computed, onMounted } from "vue"
import { cn } from "../../utils/cn"
import { DROPDOWN_CONTEXT_KEY } from "./DropdownMenu.vue"

export interface Props {
    disabled?: boolean
    destructive?: boolean
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    destructive: false
})

const emit = defineEmits<{
    select: []
}>()

const context = inject(DROPDOWN_CONTEXT_KEY)

if (!context) {
    throw new Error("DropdownMenuItem must be used within a DropdownMenu component")
}

const { active_item_index, close, registerItem, setActiveItem } = context

let item_index = -1

onMounted(() => {
    if (!props.disabled) {
        item_index = registerItem()
    }
})

const is_active = computed(() => {
    return active_item_index.value === item_index && !props.disabled
})

const handleClick = (): void => {
    if (props.disabled) return
    emit("select")
    close()
}

const handleMouseEnter = (): void => {
    if (!props.disabled && item_index >= 0) {
        setActiveItem(item_index)
    }
}

const item_classes = computed(() => cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
    "transition-colors focus:bg-accent focus:text-accent-foreground",
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    props.destructive && "text-destructive focus:text-destructive"
))
</script>
