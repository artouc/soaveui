<template>
    <div :class="cn('text-sm [&_p]:leading-relaxed', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { AlertDescriptionProps } from "../../types/alert"

const props = defineProps<AlertDescriptionProps>()
</script>
