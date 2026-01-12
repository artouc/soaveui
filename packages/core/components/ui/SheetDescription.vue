<template>
    <p :class="[computed_classes, props.class]">
        <slot />
    </p>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { SheetDescriptionProps } from "../../types/sheet"

const props = withDefaults(defineProps<SheetDescriptionProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("sheet-description", {})
})
</script>
