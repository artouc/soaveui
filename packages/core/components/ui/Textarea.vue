<template>
    <textarea
        :id="id"
        :class="[computed_classes, props.class]"
        :disabled="composable.is_disabled.value"
        :readonly="composable.is_readonly.value"
        :placeholder="placeholder"
        :rows="rows"
        :value="modelValue"
        v-bind="composable.aria_attributes.value"
        @input="handleInput"
        @focus="composable.handleFocus"
        @blur="handleBlur"
    />
</template>

<script setup lang="ts">
import { toRef, computed } from "vue"
import { useTextarea } from "../../composables/useTextarea"
import { useStyleAdapter, useUI } from "../../composables/useUIConfig"
import type { TextareaProps } from "../../types/textarea"
import type { TextareaState } from "../../types/composables"

interface Props extends TextareaProps {
    id?: string
    modelValue?: string
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    rows: 3,
    resize: "vertical",
    disabled: false,
    readonly: false,
    unstyled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
    blur: [event: FocusEvent]
}>()

const ui_config = useUI("input")
const style_adapter = useStyleAdapter()
const composable = useTextarea(toRef(() => props))

// StyleAdapterからクラスを取得
const computed_classes = computed(() => {
    if (props.unstyled) {
        return ""
    }

    const state: TextareaState = {
        size: props.size ?? ui_config.default_size,
        disabled: composable.is_disabled.value,
        readonly: composable.is_readonly.value,
        error: props.error
    }

    return style_adapter.getClasses("textarea", state)
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit("update:modelValue", target.value)
}

const handleBlur = (event: FocusEvent) => {
    composable.handleBlur()
    emit("blur", event)
}
</script>
