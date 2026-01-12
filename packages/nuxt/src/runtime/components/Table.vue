<template>
    <div :class="cn('relative w-full overflow-auto', wrapper_class)">
        <table :class="cn('w-full caption-bottom text-sm', props.class)">
            <slot />
        </table>
    </div>
</template>

<script setup lang="ts">
import { cn } from "@soave/ui"

export interface TableProps {
    class?: string
    wrapper_class?: string
}

const props = defineProps<TableProps>()
</script>
