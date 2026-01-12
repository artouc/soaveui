<template>
    <div :class="[computed_classes, props.class]">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { toRef, computed } from "vue"
import { useCard } from "../../composables/useCard"
import { useStyleAdapter, useUI } from "../../composables/useUIConfig"
import type { CardProps } from "../../types/card"
import type { CardState } from "../../types/composables"

interface CardComponentProps extends CardProps {
    class?: string
    unstyled?: boolean
}

const props = withDefaults(defineProps<CardComponentProps>(), {
    unstyled: false
})

const ui_config = useUI("card")
const style_adapter = useStyleAdapter()
const composable = useCard(toRef(() => props))

// StyleAdapterからクラスを取得
const computed_classes = computed(() => {
    if (props.unstyled) {
        return ""
    }

    const state: CardState = {
        padding: props.padding ?? ui_config.default_padding
    }

    return style_adapter.getClasses("card", state)
})
</script>
