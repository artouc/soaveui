<template>
    <button
        :class="[computed_classes, props.class]"
        :disabled="composable.is_disabled.value"
        v-bind="composable.aria_attributes.value"
        @click="handleClick"
    >
        <slot name="icon-left" />
        <span v-if="composable.is_loading.value" class="animate-spin">
            <slot name="loading">
                <svg
                    class="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </slot>
        </span>
        <slot />
        <slot name="icon-right" />
    </button>
</template>

<script setup lang="ts">
import { toRef, computed } from "vue"
import { useButton } from "../../composables/useButton"
import { useStyleAdapter, useUI } from "../../composables/useUIConfig"
import type { ButtonProps } from "../../types/button"
import type { ButtonState } from "../../types/composables"

interface ButtonComponentProps extends ButtonProps {
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<ButtonComponentProps>(), {
    disabled: false,
    loading: false,
    unstyled: false
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const ui_config = useUI("button")
const style_adapter = useStyleAdapter()
const composable = useButton(toRef(() => props))

// StyleAdapterからクラスを取得
const computed_classes = computed(() => {
    if (props.unstyled) {
        return ""
    }

    const state: ButtonState = {
        variant: props.variant ?? ui_config.default_variant,
        size: props.size ?? ui_config.default_size,
        disabled: composable.is_disabled.value,
        loading: composable.is_loading.value
    }

    return style_adapter.getClasses("button", state)
})

const handleClick = (event: MouseEvent) => {
    if (!composable.is_disabled.value && !composable.is_loading.value) {
        emit("click", event)
    }
}
</script>
