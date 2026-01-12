<template>
    <tbody :class="cn('[&_tr:last-child]:border-0', props.class)">
        <slot />
    </tbody>
</template>

<script setup lang="ts">
import { cn } from "@soave/ui"

export interface TableBodyProps {
    class?: string
}

const props = defineProps<TableBodyProps>()
</script>
