<template>
    <slot :open="open" />
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

const open = () => {
    if (context) {
        context.is_open.value = true
    }
}

defineOptions({
    name: "SheetTrigger"
})
</script>
