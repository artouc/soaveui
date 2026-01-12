<template>
    <div class="relative inline-block" :class="props.class">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, toRef, type InjectionKey, type Ref } from "vue"
import { useTooltip, type UseTooltipReturn } from "../../composables/useTooltip"
import type { TooltipSide, TooltipAlign } from "../../types/tooltip"

export interface Props {
    side?: TooltipSide
    align?: TooltipAlign
    delay_duration?: number
    skip_delay_duration?: number
    disabled?: boolean
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    side: "top",
    align: "center",
    delay_duration: 200,
    skip_delay_duration: 100,
    disabled: false
})

export const TOOLTIP_CONTEXT_KEY: InjectionKey<UseTooltipReturn> = Symbol("tooltip-context")

const tooltip_props = ref({
    side: props.side,
    align: props.align,
    delay_duration: props.delay_duration,
    skip_delay_duration: props.skip_delay_duration,
    disabled: props.disabled
})

const tooltip = useTooltip(tooltip_props as Ref<typeof tooltip_props.value>)

provide(TOOLTIP_CONTEXT_KEY, tooltip)
</script>
