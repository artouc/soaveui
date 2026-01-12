<template>
    <div
        :class="cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', props.class)"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"

export interface Props {
    inset?: boolean
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    inset: false
})
</script>
