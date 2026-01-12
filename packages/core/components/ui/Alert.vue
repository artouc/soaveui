<template>
    <div
        role="alert"
        :class="[computed_classes, props.class]"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useUI, useStyleAdapter } from "../../composables/useUIConfig"
import type { AlertVariant } from "../../types/alert"
import type { AlertState } from "../../types/composables"

interface Props {
    variant?: AlertVariant
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    unstyled: false
})

const ui_config = useUI("alert")
const style_adapter = useStyleAdapter()

// StyleAdapterからクラスを取得
const computed_classes = computed(() => {
    if (props.unstyled) {
        return ""
    }

    const state: AlertState = {
        variant: props.variant ?? ui_config.default_variant
    }

    return style_adapter.getClasses("alert", state)
})
</script>
