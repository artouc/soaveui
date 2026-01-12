<template>
    <div class="textarea-container">
        <CoreTextarea
            :class="computedClasses"
            :size="size"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :error="error"
            :error_id="errorId"
            :rows="rows"
            :resize="resize"
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
import { Textarea as CoreTextarea } from "@soave/ui"
import type { TextareaProps } from "@soave/ui"

interface StyledTextareaProps extends TextareaProps {
    modelValue?: string
    class?: string
    id?: string
}

const props = withDefaults(defineProps<StyledTextareaProps>(), {
    size: "md",
    disabled: false,
    readonly: false,
    rows: 3,
    resize: "vertical"
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
}>()

const errorId = computed(() => props.id ? `${props.id}-error` : undefined)

const computedClasses = computed(() => {
    const base = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

    const resizes: Record<string, string> = {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize"
    }

    return [
        base,
        resizes[props.resize ?? "vertical"],
        props.error && "border-destructive focus-visible:ring-destructive",
        props.disabled && "bg-muted opacity-50",
        props.readonly && "bg-muted",
        props.class
    ].filter(Boolean).join(" ")
})
</script>
