<template>
    <p :class="cn('text-sm text-muted-foreground', props.class)">
        <slot />
    </p>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { CardDescriptionProps } from "../../types/card"

const props = defineProps<CardDescriptionProps>()
</script>
