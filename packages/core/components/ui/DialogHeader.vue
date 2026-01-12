<template>
    <div :class="cn('flex flex-col space-y-1.5 text-center sm:text-left', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { DialogHeaderProps } from "../../types/dialog"

const props = defineProps<DialogHeaderProps>()
</script>
