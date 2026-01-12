<template>
    <button
        type="button"
        :class="composable.base_classes.value"
        :disabled="composable.is_disabled.value"
        :data-state="dataState"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
    >
        <span
            v-if="modelValue || composable.is_indeterminate.value"
            :class="composable.indicator_classes.value"
        >
            <svg
                v-if="composable.is_indeterminate.value"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
            >
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue"
import { useCheckbox } from "../../composables/useCheckbox"
import type { CheckboxProps } from "../../types/checkbox"

interface Props extends CheckboxProps {
    modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
    indeterminate: false
})

const emit = defineEmits<{
    "update:modelValue": [value: boolean]
}>()

const checked = toRef(() => props.modelValue)
const composable = useCheckbox(toRef(() => props), checked)

const dataState = computed(() => {
    if (props.indeterminate) return "indeterminate"
    return props.modelValue ? "checked" : "unchecked"
})

const handleClick = () => {
    if (!composable.is_disabled.value) {
        emit("update:modelValue", !props.modelValue)
    }
}
</script>
