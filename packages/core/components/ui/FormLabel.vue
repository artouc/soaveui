<template>
    <label
        :for="props.for"
        :class="cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            props.class
        )"
    >
        <slot />
        <span v-if="props.required" class="text-destructive ml-1">*</span>
    </label>
</template>

<script setup lang="ts">
import { cn } from "../../utils/cn"
import type { FormLabelProps } from "../../types/form"

const props = defineProps<FormLabelProps>()
</script>
