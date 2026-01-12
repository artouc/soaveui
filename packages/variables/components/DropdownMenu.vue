<template>
    <CoreDropdownMenu
        :side="side"
        :align="align"
    >
        <slot />
    </CoreDropdownMenu>
</template>

<script setup lang="ts">
import { DropdownMenu as CoreDropdownMenu } from "@soave/ui"
import type { DropdownSide, DropdownAlign } from "@soave/ui"

withDefaults(defineProps<{
    side?: DropdownSide
    align?: DropdownAlign
}>(), {
    side: "bottom",
    align: "start"
})
</script>

<style>
@import "../styles/dropdown.css";
</style>
