<template>
    <div :class="[computed_classes, props.class]">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { DialogFooterProps } from "../../types/dialog"

const props = withDefaults(defineProps<DialogFooterProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("dialog-footer", {})
})
</script>
