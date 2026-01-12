<template>
    <div
        :class="[computed_classes, props.class]"
        :data-disabled="is_disabled ? '' : undefined"
        role="option"
        :aria-selected="is_selected"
        @click="handleClick"
    >
        <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <svg
                v-if="is_selected"
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </span>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject, computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { SelectContext, SelectItemProps } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

const props = withDefaults(defineProps<SelectItemProps>(), {
    disabled: false,
    unstyled: false
})

const context = inject<SelectContext>(SELECT_KEY)
const style_adapter = useStyleAdapter()

const is_selected = computed(() => context?.model_value.value === props.value)
const is_disabled = computed(() => props.disabled)

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("select-item", {})
})

const handleClick = () => {
    if (!is_disabled.value && context) {
        context.updateValue(props.value)
    }
}
</script>
