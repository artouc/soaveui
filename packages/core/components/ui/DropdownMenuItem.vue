<template>
    <div
        role="menuitem"
        :tabindex="disabled ? -1 : 0"
        :class="[computed_classes, props.class]"
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
import { useStyleAdapter } from "../../composables"
import type { DropdownItemProps } from "../../types/dropdown"
import { DROPDOWN_CONTEXT_KEY } from "../../types/dropdown"

const props = withDefaults(defineProps<DropdownItemProps>(), {
    disabled: false,
    destructive: false,
    unstyled: false
})

const emit = defineEmits<{
    select: []
}>()

const context = inject(DROPDOWN_CONTEXT_KEY)

if (!context) {
    throw new Error("DropdownMenuItem must be used within a DropdownMenu component")
}

const { active_item_index, close, registerItem, setActiveItem } = context
const style_adapter = useStyleAdapter()

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

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("dropdown-item", {})
})
</script>
