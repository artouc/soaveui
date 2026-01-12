<template>
    <div
        role="radiogroup"
        :aria-orientation="orientation"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, computed } from "vue"
import type { RadioGroupProps, RadioGroupContext } from "../../types/radio"
import { RADIO_GROUP_KEY } from "../../types/radio"

const props = withDefaults(defineProps<RadioGroupProps>(), {
    disabled: false,
    orientation: "vertical"
})

const model = defineModel<string>({ default: "" })

const updateValue = (value: string) => {
    if (!props.disabled) {
        model.value = value
    }
}

const context: RadioGroupContext = {
    model_value: model,
    disabled: computed(() => props.disabled),
    updateValue
}

provide(RADIO_GROUP_KEY, context)
</script>
