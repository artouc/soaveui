<template>
    <h3 :class="[computed_classes, props.class]">
        <slot />
    </h3>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { CardTitleProps } from "../../types/card"

const props = withDefaults(defineProps<CardTitleProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("card-title", {})
})
</script>
