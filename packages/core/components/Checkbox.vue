<template>
    <button
        type="button"
        :disabled="composable.state.value.disabled"
        :data-state="dataState"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
        @keydown.space.prevent="handleClick"
    >
        <slot :checked="model" :indeterminate="composable.state.value.indeterminate" />
    </button>
</template>

<script setup lang="ts">
import { toRef, computed } from "vue"
import { useCheckbox } from "../../composables/useCheckbox"

const props = withDefaults(defineProps<{
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    indeterminate?: boolean
}>(), {
    size: "md",
    disabled: false,
    indeterminate: false
})

const model = defineModel<boolean>({ default: false })

const emit = defineEmits<{
    change: [checked: boolean]
}>()

const composable = useCheckbox(toRef(() => props), model)

const dataState = computed(() => {
    if (composable.state.value.indeterminate) return "indeterminate"
    return model.value ? "checked" : "unchecked"
})

const handleClick = () => {
    if (!composable.state.value.disabled) {
        model.value = !model.value
        emit("change", model.value)
    }
}
</script>
