<template>
    <div
        role="alert"
        :class="cn(
            'relative w-full rounded-lg border p-4',
            variant_classes,
            props.class
        )"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../../utils/cn"
import { useUI } from "../../composables/useUIConfig"
import type { AlertVariant } from "../../types/alert"

interface Props {
    variant?: AlertVariant
    class?: string
}

const props = defineProps<Props>()

const ui_config = useUI("alert")

const variant_classes = computed(() => {
    const variant_map: Record<AlertVariant, string> = {
        default: "bg-background text-foreground",
        info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600",
        success: "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600",
        destructive: "border-destructive/50 text-destructive bg-destructive/10 [&>svg]:text-destructive"
    }
    return variant_map[props.variant ?? ui_config.default_variant]
})
</script>
