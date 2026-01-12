<template>
    <Teleport to="body">
        <div
            v-if="context?.is_open.value"
            class="fixed inset-0 z-40"
            @click="context?.close()"
        />
        <div
            v-if="context?.is_open.value"
            :class="[computed_classes, props.class]"
            :style="content_style"
            :data-state="context?.is_open.value ? 'open' : 'closed'"
            data-side="bottom"
            role="listbox"
        >
            <div class="p-1">
                <slot />
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { inject, computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { SelectContext, SelectContentProps } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

const props = withDefaults(defineProps<SelectContentProps>(), {
    unstyled: false
})

const context = inject<SelectContext>(SELECT_KEY)
const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("select-content", {})
})

const content_style = computed(() => {
    const trigger_element = context?.trigger_ref.value
    if (!trigger_element) {
        return {}
    }

    const rect = trigger_element.getBoundingClientRect()
    return {
        position: "fixed" as const,
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`
    }
})
</script>
