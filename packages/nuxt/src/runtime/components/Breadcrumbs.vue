<template>
    <nav :aria-label="aria_label" :class="cn(base_classes, props.class)">
        <ol class="flex items-center gap-2">
            <li
                v-for="(item, index) in items"
                :key="index"
                class="flex items-center gap-2"
            >
                <component
                    :is="item.href && !item.current ? 'a' : 'span'"
                    :href="item.href"
                    :class="item_classes(item)"
                    :aria-current="item.current ? 'page' : undefined"
                    :aria-disabled="item.disabled ? 'true' : undefined"
                >
                    <slot name="icon" :item="item" :index="index">
                        <component
                            v-if="item.icon"
                            :is="item.icon"
                            class="h-4 w-4"
                        />
                    </slot>
                    <slot name="item" :item="item" :index="index">
                        {{ item.label }}
                    </slot>
                </component>

                <slot v-if="index < items.length - 1" name="separator">
                    <span
                        :class="separator_classes"
                        aria-hidden="true"
                    >
                        {{ separator }}
                    </span>
                </slot>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { cn } from "@soave/ui"
import type { BreadcrumbItem } from "../../types"

export interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    separator?: string
    aria_label?: string
    class?: string
}

const props = withDefaults(defineProps<BreadcrumbsProps>(), {
    separator: "/",
    aria_label: "Breadcrumb"
})

const base_classes = "flex"

const separator_classes = computed(() =>
    cn("text-muted-foreground select-none")
)

const item_classes = (item: BreadcrumbItem): string => {
    const base = "text-sm transition-colors"
    const current_state = item.current
        ? "text-foreground font-medium pointer-events-none"
        : "text-muted-foreground hover:text-foreground"
    const disabled_state = item.disabled && !item.current
        ? "opacity-50 pointer-events-none"
        : ""
    const link_state = item.href && !item.current
        ? "hover:underline underline-offset-4"
        : ""

    return cn(base, current_state, disabled_state, link_state)
}
</script>
