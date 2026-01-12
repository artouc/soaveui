<template>
    <h5 :class="[computed_classes, props.class]">
        <slot />
    </h5>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { AlertTitleProps } from "../../types/alert"

const props = withDefaults(defineProps<AlertTitleProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("alert-title", {})
})
</script>
