<template>
    <h2 :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)">
        <slot />
    </h2>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { DialogTitleProps } from "../../types/dialog"

const props = defineProps<DialogTitleProps>()
</script>
