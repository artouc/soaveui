<template>
    <CoreTooltip
        :content="content"
        :side="side"
        :align="align"
        :delay_duration="delayDuration"
        :skip_delay_duration="skipDelayDuration"
        :disabled="disabled"
    >
        <slot />
    </CoreTooltip>
</template>

<script setup lang="ts">
import { Tooltip as CoreTooltip } from "@soave/ui"
import type { TooltipSide, TooltipAlign } from "@soave/ui"

withDefaults(defineProps<{
    content: string
    side?: TooltipSide
    align?: TooltipAlign
    delayDuration?: number
    skipDelayDuration?: number
    disabled?: boolean
}>(), {
    side: "top",
    align: "center",
    delayDuration: 700,
    skipDelayDuration: 300,
    disabled: false
})
</script>

<style>
@import "../styles/tooltip.css";
</style>
