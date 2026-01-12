<template>
    <div class="relative inline-block" :class="props.class">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, type Ref } from "vue"
import { useDropdown } from "../../composables/useDropdown"
import type { DropdownSide, DropdownAlign } from "../../types/dropdown"
import { DROPDOWN_CONTEXT_KEY } from "../../types/dropdown"

interface Props {
    side?: DropdownSide
    align?: DropdownAlign
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    side: "bottom",
    align: "start"
})

const dropdown_props = ref({
    side: props.side,
    align: props.align
})

const dropdown = useDropdown(dropdown_props as Ref<typeof dropdown_props.value>)

provide(DROPDOWN_CONTEXT_KEY, dropdown)
</script>
