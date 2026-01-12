<template>
    <button
        type="button"
        :class="composable.track_classes.value"
        :disabled="composable.is_disabled.value"
        :data-state="modelValue ? 'checked' : 'unchecked'"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
    >
        <span
            :class="composable.thumb_classes.value"
            :data-state="modelValue ? 'checked' : 'unchecked'"
        />
    </button>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useSwitch } from "../../composables/useSwitch"
import type { SwitchProps } from "../../types/switch"

interface Props extends SwitchProps {
    modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: boolean]
}>()

const checked = toRef(() => props.modelValue)
const composable = useSwitch(toRef(() => props), checked)

const handleClick = () => {
    if (!composable.is_disabled.value) {
        emit("update:modelValue", !props.modelValue)
    }
}
</script>
