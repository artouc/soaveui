<template>
    <tr
        :class="cn(
            'border-b transition-colors hover:bg-muted/50',
            selected && 'bg-muted',
            props.class
        )"
        :data-state="selected ? 'selected' : undefined"
    >
        <slot />
    </tr>
</template>

<script setup lang="ts">
import { cn } from "@soave/ui"

export interface TableRowProps {
    selected?: boolean
    class?: string
}

const props = withDefaults(defineProps<TableRowProps>(), {
    selected: false
})
</script>
