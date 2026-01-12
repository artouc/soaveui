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
import type { Ref, ComputedRef, InjectionKey } from "vue"

interface RadioGroupContext {
    model_value: Ref<string>
    disabled: ComputedRef<boolean>
    updateValue: (value: string) => void
}

const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol("radio-group")

const props = withDefaults(defineProps<{
    disabled?: boolean
    orientation?: "horizontal" | "vertical"
}>(), {
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
