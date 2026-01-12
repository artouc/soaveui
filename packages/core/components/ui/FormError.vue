<template>
    <p
        v-if="$slots.default"
        :id="id"
        :class="cn('text-sm font-medium text-destructive', props.class)"
    >
        <slot />
    </p>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { FormErrorProps } from "../../types/form"

interface Props extends FormErrorProps {
    id?: string
}

const props = defineProps<Props>()
</script>
