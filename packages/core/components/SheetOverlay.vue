<template>
    <div
        aria-hidden="true"
        @click="handleClick"
    />
</template>

<script setup lang="ts">
import { inject } from "vue"
import type { Ref, InjectionKey } from "vue"

interface SheetContext {
    is_open: Ref<boolean>
    side: "top" | "right" | "bottom" | "left"
    close: () => void
}

const SHEET_KEY: InjectionKey<SheetContext> = Symbol("sheet")

const context = inject<SheetContext | null>(SHEET_KEY, null)

const handleClick = () => {
    context?.close()
}

defineOptions({
    name: "SheetOverlay"
})
</script>
