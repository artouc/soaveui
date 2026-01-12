<template>
    <div class="relative inline-block" :class="props.class">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, type InjectionKey, type Ref } from "vue"
import { usePopover, type UsePopoverReturn } from "../../composables/usePopover"
import type { PopoverSide, PopoverAlign } from "../../types/popover"

export interface Props {
    side?: PopoverSide
    align?: PopoverAlign
    modal?: boolean
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    side: "bottom",
    align: "center",
    modal: false
})

export const POPOVER_CONTEXT_KEY: InjectionKey<UsePopoverReturn> = Symbol("popover-context")

const popover_props = ref({
    side: props.side,
    align: props.align,
    modal: props.modal
})

const popover = usePopover(popover_props as Ref<typeof popover_props.value>)

provide(POPOVER_CONTEXT_KEY, popover)
</script>
