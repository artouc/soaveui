<template>
    <nav
        :aria-label="aria_label"
        :class="cn('flex items-center justify-center gap-1', props.class)"
        role="navigation"
    >
        <!-- First Page Button -->
        <button
            v-if="show_first_last"
            type="button"
            :class="button_classes"
            :disabled="!state.has_previous"
            :aria-label="first_label"
            @click="emit('first')"
        >
            <slot name="first-icon">
                <span aria-hidden="true">&laquo;</span>
            </slot>
        </button>

        <!-- Previous Page Button -->
        <button
            type="button"
            :class="button_classes"
            :disabled="!state.has_previous"
            :aria-label="previous_label"
            @click="emit('previous')"
        >
            <slot name="previous-icon">
                <span aria-hidden="true">&lsaquo;</span>
            </slot>
        </button>

        <!-- Page Numbers -->
        <template v-for="(page, index) in pages" :key="index">
            <span
                v-if="page === 'ellipsis'"
                :class="ellipsis_classes"
                aria-hidden="true"
            >
                <slot name="ellipsis">&hellip;</slot>
            </span>
            <button
                v-else
                type="button"
                :class="page_button_classes(page)"
                :aria-label="`${page_label} ${page}`"
                :aria-current="page === state.current_page ? 'page' : undefined"
                @click="emit('page', page)"
            >
                {{ page }}
            </button>
        </template>

        <!-- Next Page Button -->
        <button
            type="button"
            :class="button_classes"
            :disabled="!state.has_next"
            :aria-label="next_label"
            @click="emit('next')"
        >
            <slot name="next-icon">
                <span aria-hidden="true">&rsaquo;</span>
            </slot>
        </button>

        <!-- Last Page Button -->
        <button
            v-if="show_first_last"
            type="button"
            :class="button_classes"
            :disabled="!state.has_next"
            :aria-label="last_label"
            @click="emit('last')"
        >
            <slot name="last-icon">
                <span aria-hidden="true">&raquo;</span>
            </slot>
        </button>
    </nav>
</template>

<script setup lang="ts">
import { cn } from "@soave/ui"
import type { PaginationState } from "../../types"

export interface PaginationProps {
    state: PaginationState
    pages: (number | "ellipsis")[]
    size?: "sm" | "md" | "lg"
    show_first_last?: boolean
    aria_label?: string
    previous_label?: string
    next_label?: string
    first_label?: string
    last_label?: string
    page_label?: string
    class?: string
}

const props = withDefaults(defineProps<PaginationProps>(), {
    size: "md",
    show_first_last: true,
    aria_label: "Pagination",
    previous_label: "Go to previous page",
    next_label: "Go to next page",
    first_label: "Go to first page",
    last_label: "Go to last page",
    page_label: "Go to page"
})

const emit = defineEmits<{
    page: [page: number]
    previous: []
    next: []
    first: []
    last: []
}>()

const size_classes = {
    sm: "h-8 min-w-8 text-xs",
    md: "h-9 min-w-9 text-sm",
    lg: "h-10 min-w-10 text-base"
}

const button_classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium",
    "transition-colors focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    "disabled:pointer-events-none disabled:opacity-50",
    size_classes[props.size]
)

const ellipsis_classes = cn(
    "flex items-center justify-center",
    "text-muted-foreground",
    size_classes[props.size]
)

const page_button_classes = (page: number): string => {
    const is_current = page === props.state.current_page
    return cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        size_classes[props.size],
        is_current
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    )
}
</script>
