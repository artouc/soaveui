<template>
    <div :class="cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { DialogFooterProps } from "../../types/dialog"

const props = defineProps<DialogFooterProps>()
</script>
