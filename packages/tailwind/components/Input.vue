<template>
    <div class="input-container">
        <CoreInput
            :class="computedClasses"
            :type="type"
            :size="size"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :error="error"
            :error_id="errorId"
            :id="id"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
        />
        <div
            v-if="error"
            :id="errorId"
            class="text-sm text-destructive mt-2"
        >
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Input as CoreInput } from "@soave/ui"
import type { InputProps } from "@soave/ui"

interface StyledInputProps extends InputProps {
    modelValue?: string
    class?: string
    id?: string
}

const props = withDefaults(defineProps<StyledInputProps>(), {
    type: "text",
    size: "md",
    disabled: false,
    readonly: false
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const errorId = computed(() => props.id ? `${props.id}-error` : undefined)

const computedClasses = computed(() => {
    const base = "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"

    const sizes: Record<string, string> = {
        sm: "h-9 text-xs",
        md: "h-10 text-sm",
        lg: "h-11 text-base"
    }

    return [
        base,
        sizes[props.size ?? "md"],
        props.error && "border-destructive focus-visible:ring-destructive",
        props.disabled && "bg-muted opacity-50 cursor-not-allowed disabled:pointer-events-none",
        props.readonly && "bg-muted",
        props.class
    ].filter(Boolean).join(" ")
})
</script>
