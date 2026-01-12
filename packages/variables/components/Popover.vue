<template>
    <CorePopover
        :side="side"
        :align="align"
        :modal="modal"
    >
        <slot />
    </CorePopover>
</template>

<script setup lang="ts">
import { Popover as CorePopover } from "@soave/ui"
import type { PopoverSide, PopoverAlign } from "@soave/ui"

withDefaults(defineProps<{
    side?: PopoverSide
    align?: PopoverAlign
    modal?: boolean
}>(), {
    side: "bottom",
    align: "center",
    modal: false
})
</script>

<style>
@import "../styles/popover.css";
</style>
