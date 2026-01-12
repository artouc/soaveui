<template>
    <div :class="cn('flex items-center p-6 pt-0', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { CardFooterProps } from "../../types/card"

const props = defineProps<CardFooterProps>()
</script>
