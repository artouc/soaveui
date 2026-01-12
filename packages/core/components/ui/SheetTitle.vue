<template>
    <h2 :class="cn('text-lg font-semibold text-foreground', props.class)">
        <slot />
    </h2>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"

export interface Props {
    class?: string
}

const props = defineProps<Props>()
</script>
