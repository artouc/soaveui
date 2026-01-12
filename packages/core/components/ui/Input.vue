<template>
    <input
        :id="id"
        :type="type"
        :class="[computed_classes, props.class]"
        :disabled="composable.is_disabled.value"
        :readonly="composable.is_readonly.value"
        :placeholder="placeholder"
        :value="modelValue"
        v-bind="composable.aria_attributes.value"
        @input="handleInput"
        @focus="composable.handleFocus"
        @blur="handleBlur"
    />
</template>

<script setup lang="ts">
import { toRef, computed } from "vue"
import { useInput } from "../../composables/useInput"
import { useStyleAdapter, useUI } from "../../composables/useUIConfig"
import type { InputProps, InputType } from "../../types/input"
import type { InputState } from "../../types/composables"

interface Props extends InputProps {
    id?: string
    modelValue?: string | number
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: "text" as InputType,
    disabled: false,
    readonly: false,
    unstyled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string | number]
    blur: [event: FocusEvent]
}>()

const ui_config = useUI("input")
const style_adapter = useStyleAdapter()
const composable = useInput(toRef(() => props))

// StyleAdapterからクラスを取得
const computed_classes = computed(() => {
    if (props.unstyled) {
        return ""
    }

    const state: InputState = {
        size: props.size ?? ui_config.default_size,
        disabled: composable.is_disabled.value,
        readonly: composable.is_readonly.value,
        error: props.error
    }

    return style_adapter.getClasses("input", state)
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit("update:modelValue", target.value)
}

const handleBlur = (event: FocusEvent) => {
    composable.handleBlur()
    emit("blur", event)
}
</script>
