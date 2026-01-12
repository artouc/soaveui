<template>
    <CoreButton
        :class="computedClasses"
        :variant="variant"
        :size="size"
        :disabled="disabled"
        :loading="loading"
        :type="type"
        @click="emit('click', $event)"
    >
        <slot />
    </CoreButton>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Button as CoreButton } from "@soave/ui"
import type { ButtonProps } from "@soave/ui"

interface StyledButtonProps extends ButtonProps {
    class?: string
}

const props = withDefaults(defineProps<StyledButtonProps>(), {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    type: "button"
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const computedClasses = computed(() => {
    const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

    const variants: Record<string, string> = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80"
    }

    const sizes: Record<string, string> = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8"
    }

    return [
        base,
        variants[props.variant ?? "primary"],
        sizes[props.size ?? "md"],
        props.disabled && "opacity-50 cursor-not-allowed disabled:pointer-events-none",
        props.loading && "cursor-wait",
        props.class
    ].filter(Boolean).join(" ")
})
</script>
