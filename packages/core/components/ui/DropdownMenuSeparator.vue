<template>
    <div
        role="separator"
        :class="cn('-mx-1 my-1 h-px bg-muted', props.class)"
    />
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"

export interface Props {
    class?: string
}

const props = defineProps<Props>()
</script>
