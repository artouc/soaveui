<template>
    <p :class="cn('text-sm text-muted-foreground', props.class)">
        <slot />
    </p>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"

export interface Props {
    class?: string
}

const props = defineProps<Props>()
</script>
