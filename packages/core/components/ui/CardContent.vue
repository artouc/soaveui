<template>
    <div :class="cn('p-6 pt-0', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { CardContentProps } from "../../types/card"

const props = defineProps<CardContentProps>()
</script>
