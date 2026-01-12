<template>
    <h2 :class="[computed_classes, props.class]">
        <slot />
    </h2>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { DialogTitleProps } from "../../types/dialog"

const props = withDefaults(defineProps<DialogTitleProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("dialog-title", {})
})
</script>
