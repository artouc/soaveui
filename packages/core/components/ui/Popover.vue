<template>
    <div class="relative inline-block" :class="props.class">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, type Ref } from "vue"
import { usePopover } from "../../composables/usePopover"
import type { PopoverSide, PopoverAlign } from "../../types/popover"
import { POPOVER_CONTEXT_KEY } from "../../types/popover"

interface Props {
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

const popover_props = ref({
    side: props.side,
    align: props.align,
    modal: props.modal
})

const popover = usePopover(popover_props as Ref<typeof popover_props.value>)

provide(POPOVER_CONTEXT_KEY, popover)
</script>
