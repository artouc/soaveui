<template>
    <p :class="[computed_classes, props.class]">
        <slot />
    </p>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { CardDescriptionProps } from "../../types/card"

const props = withDefaults(defineProps<CardDescriptionProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("card-description", {})
})
</script>
