<template>
    <div class="relative inline-block" :class="props.class">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, type InjectionKey, type Ref } from "vue"
import { useDropdown, type UseDropdownReturn } from "../../composables/useDropdown"
import type { DropdownSide, DropdownAlign } from "../../types/dropdown"

export interface Props {
    side?: DropdownSide
    align?: DropdownAlign
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    side: "bottom",
    align: "start"
})

export const DROPDOWN_CONTEXT_KEY: InjectionKey<UseDropdownReturn> = Symbol("dropdown-context")

const dropdown_props = ref({
    side: props.side,
    align: props.align
})

const dropdown = useDropdown(dropdown_props as Ref<typeof dropdown_props.value>)

provide(DROPDOWN_CONTEXT_KEY, dropdown)
</script>
