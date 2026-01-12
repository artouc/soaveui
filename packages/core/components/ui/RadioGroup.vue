<template>
    <div
        role="radiogroup"
        :class="cn(
            'grid gap-2',
            orientation === 'horizontal' && 'grid-flow-col'
        )"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, toRef } from "vue"
import { cn } from "../../utils/cn"
import type { RadioGroupProps, RadioGroupContext } from "../../types/radio"
import { RADIO_GROUP_KEY } from "../../types/radio"

interface Props extends RadioGroupProps {
    modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    disabled: false,
    orientation: "vertical"
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const context: RadioGroupContext = {
    model_value: toRef(() => props.modelValue),
    disabled: toRef(() => props.disabled),
    updateValue: (value: string) => {
        emit("update:modelValue", value)
    }
}

provide(RADIO_GROUP_KEY, context)
</script>
