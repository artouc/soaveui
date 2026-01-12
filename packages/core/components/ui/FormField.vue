<template>
    <div :class="cn('space-y-2', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { FormFieldProps } from "../../types/form"

const props = defineProps<FormFieldProps>()
</script>
