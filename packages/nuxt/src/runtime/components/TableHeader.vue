<template>
    <thead :class="cn('[&_tr]:border-b', props.class)">
        <slot />
    </thead>
</template>

<script setup lang="ts">
import { cn } from "@soave/ui"

export interface TableHeaderProps {
    class?: string
}

const props = defineProps<TableHeaderProps>()
</script>
