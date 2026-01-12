<template>
    <div
        :class="composable.base_classes.value"
        :data-disabled="composable.is_disabled.value ? '' : undefined"
        role="option"
        :aria-selected="composable.is_selected.value"
        @click="handleClick"
    >
        <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <svg
                v-if="composable.is_selected.value"
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
import { inject, toRef } from "vue"
import { useSelectItem } from "../../composables/useSelect"
import type { SelectContext } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

interface Props {
    value: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false
})

const context = inject<SelectContext>(SELECT_KEY)
const composable = useSelectItem(toRef(() => props))

const handleClick = () => {
    if (!composable.is_disabled.value && context) {
        context.updateValue(props.value)
    }
}
</script>
