<template>
    <td
        :class="cn(
            'p-4 align-middle [&:has([role=checkbox])]:pr-0',
            props.class
        )"
    >
        <slot />
    </td>
</template>

<script setup lang="ts">
import { cn } from "@soave/ui"

export interface TableCellProps {
    class?: string
}

const props = defineProps<TableCellProps>()
</script>
