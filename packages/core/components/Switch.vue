<template>
    <button
        type="button"
        :disabled="composable.state.value.disabled"
        :data-state="model ? 'checked' : 'unchecked'"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
    >
        <slot :checked="model">
            <span :data-state="model ? 'checked' : 'unchecked'" />
        </slot>
    </button>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useSwitch } from "../../composables/useSwitch"
import type { SwitchProps } from "../../types/switch"

const props = withDefaults(defineProps<SwitchProps>(), {
    size: "md",
    disabled: false
})

const model = defineModel<boolean>({ default: false })

const emit = defineEmits<{
    change: [checked: boolean]
}>()

const composable = useSwitch(toRef(() => props), model)

const handleClick = () => {
    if (!composable.state.value.disabled) {
        model.value = !model.value
        emit("change", model.value)
    }
}

defineExpose({
    state: composable.state
})
</script>
