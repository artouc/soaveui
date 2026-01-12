<template>
    <button
        type="button"
        :class="[computed_classes, props.class]"
        :disabled="is_disabled"
        role="radio"
        :aria-checked="is_checked"
        :aria-disabled="is_disabled || undefined"
        @click="handleClick"
    >
        <span
            v-if="is_checked"
            :class="indicator_classes"
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
import { inject, computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { RadioItemProps, RadioGroupContext } from "../../types/radio"
import { RADIO_GROUP_KEY } from "../../types/radio"
import type { RadioState } from "../../types/composables"

const props = withDefaults(defineProps<RadioItemProps>(), {
    disabled: false,
    unstyled: false
})

const context = inject<RadioGroupContext>(RADIO_GROUP_KEY)
const style_adapter = useStyleAdapter()

const is_checked = computed(() => context?.model_value.value === props.value)
const is_disabled = computed(() => props.disabled || context?.disabled.value || false)

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    const state: RadioState = {
        checked: is_checked.value,
        disabled: is_disabled.value
    }
    return style_adapter.getClasses("radio", state)
})

const indicator_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("radio-indicator", {})
})

const handleClick = () => {
    if (!is_disabled.value && context) {
        context.updateValue(props.value)
    }
}
</script>
