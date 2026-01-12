<template>
    <CoreSheetClose class="sheet__close">
        <slot>
            <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
        </slot>
    </CoreSheetClose>
</template>

<script setup lang="ts">
import { SheetClose as CoreSheetClose } from "@soave/ui"
</script>

<style>
@import "../styles/sheet.css";
</style>
