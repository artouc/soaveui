<template>
    <p :class="[computed_classes, props.class]">
        <slot />
    </p>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { DialogDescriptionProps } from "../../types/dialog"

const props = withDefaults(defineProps<DialogDescriptionProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("dialog-description", {})
})
</script>
