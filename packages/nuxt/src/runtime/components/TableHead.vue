<template>
    <th
        :class="cn(
            'h-10 px-4 text-left align-middle font-medium text-muted-foreground',
            '[&:has([role=checkbox])]:pr-0',
            sortable && 'cursor-pointer select-none hover:text-foreground',
            props.class
        )"
        :aria-sort="sort_direction ? (sort_direction === 'asc' ? 'ascending' : 'descending') : undefined"
        @click="handleClick"
    >
        <div class="flex items-center gap-2">
            <slot />
            <span v-if="sortable && sort_direction" aria-hidden="true">
                {{ sort_direction === "asc" ? "↑" : "↓" }}
            </span>
        </div>
    </th>
</template>

<script setup lang="ts">
import { cn } from "@soave/ui"

export interface TableHeadProps {
    sortable?: boolean
    sort_direction?: "asc" | "desc" | null
    class?: string
}

const props = withDefaults(defineProps<TableHeadProps>(), {
    sortable: false,
    sort_direction: null
})

const emit = defineEmits<{
    sort: []
}>()

const handleClick = (): void => {
    if (props.sortable) {
        emit("sort")
    }
}
</script>
