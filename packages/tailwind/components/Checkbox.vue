<template>
    <CoreCheckbox
        v-model="model"
        :class="computedClasses"
        :size="size"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="emit('change', $event)"
    >
        <template #default="{ checked, indeterminate: isIndeterminate }">
            <span :class="indicatorClasses">
                <svg
                    v-if="checked && !isIndeterminate"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                    v-else-if="isIndeterminate"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                >
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </span>
        </template>
    </CoreCheckbox>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Checkbox as CoreCheckbox } from "@soave/ui"
import type { CheckboxProps } from "@soave/ui"

interface StyledCheckboxProps extends CheckboxProps {
    class?: string
}

const props = withDefaults(defineProps<StyledCheckboxProps>(), {
    size: "md",
    disabled: false,
    indeterminate: false
})

const model = defineModel<boolean>({ default: false })

const emit = defineEmits<{
    change: [checked: boolean]
}>()

const computedClasses = computed(() => {
    const base = "peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"

    const sizes: Record<string, string> = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
    }

    return [
        base,
        sizes[props.size ?? "md"],
        props.class
    ].filter(Boolean).join(" ")
})

const indicatorClasses = computed(() => {
    const sizes: Record<string, string> = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    }

    return [
        "flex items-center justify-center text-current",
        sizes[props.size ?? "md"]
    ].join(" ")
})
</script>
