<template>
    <div :class="cn('flex flex-col space-y-1.5 p-6', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { CardHeaderProps } from "../../types/card"

const props = defineProps<CardHeaderProps>()
</script>
