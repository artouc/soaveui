<template>
    <button
        type="button"
        :class="[computed_classes, props.class]"
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
import { toRef, computed } from "vue"
import { useSwitch } from "../../composables/useSwitch"
import { useStyleAdapter } from "../../composables/useUIConfig"
import type { SwitchProps } from "../../types/switch"
import type { SwitchState } from "../../types/composables"

interface Props extends SwitchProps {
    modelValue?: boolean
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
    unstyled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: boolean]
}>()

const style_adapter = useStyleAdapter()
const checked = toRef(() => props.modelValue)
const composable = useSwitch(toRef(() => props), checked)

// StyleAdapterからクラスを取得
const computed_classes = computed(() => {
    if (props.unstyled) {
        return ""
    }

    const state: SwitchState = {
        checked: props.modelValue,
        disabled: composable.is_disabled.value
    }

    return style_adapter.getClasses("switch", state)
})

const handleClick = () => {
    if (!composable.is_disabled.value) {
        emit("update:modelValue", !props.modelValue)
    }
}
</script>
