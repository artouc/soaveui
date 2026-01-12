<template>
    <slot :open="open" />
</template>

<script setup lang="ts">
import { inject } from "vue"
import type { Ref, InjectionKey } from "vue"

interface DialogContext {
    is_open: Ref<boolean>
    close: () => void
    titleId?: string
    descriptionId?: string
}

const DIALOG_KEY: InjectionKey<DialogContext> = Symbol("dialog")

const context = inject<DialogContext | null>(DIALOG_KEY, null)

const open = () => {
    if (context) {
        context.is_open.value = true
    }
}

defineOptions({
    name: "DialogTrigger"
})
</script>
