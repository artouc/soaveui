<template>
    <div
        role="radiogroup"
        :class="[computed_classes, props.class]"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, toRef, computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { RadioGroupProps, RadioGroupContext } from "../../types/radio"
import { RADIO_GROUP_KEY } from "../../types/radio"

interface Props extends RadioGroupProps {
    modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    disabled: false,
    orientation: "vertical",
    unstyled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("radio-group", { orientation: props.orientation })
})

const context: RadioGroupContext = {
    model_value: toRef(() => props.modelValue),
    disabled: toRef(() => props.disabled),
    updateValue: (value: string) => {
        emit("update:modelValue", value)
    }
}

provide(RADIO_GROUP_KEY, context)
</script>
