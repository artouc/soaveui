<template>
    <button
        type="button"
        :class="composable.base_classes.value"
        :disabled="composable.is_disabled.value"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
    >
        <span
            v-if="composable.is_checked.value"
            :class="composable.indicator_classes.value"
        >
            <svg
                class="fill-current"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="6" />
            </svg>
        </span>
    </button>
</template>

<script setup lang="ts">
import { inject, toRef } from "vue"
import { useRadioItem } from "../../composables/useRadio"
import type { RadioItemProps, RadioGroupContext } from "../../types/radio"
import { RADIO_GROUP_KEY } from "../../types/radio"

const props = withDefaults(defineProps<RadioItemProps>(), {
    disabled: false
})

const context = inject<RadioGroupContext>(RADIO_GROUP_KEY)
const composable = useRadioItem(toRef(() => props))

const handleClick = () => {
    if (!composable.is_disabled.value && context) {
        context.updateValue(props.value)
    }
}
</script>
