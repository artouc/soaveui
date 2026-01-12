<template>
    <div :class="[computed_classes, props.class]">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useStyleAdapter } from "../../composables"
import type { CardFooterProps } from "../../types/card"

const props = withDefaults(defineProps<CardFooterProps>(), {
    unstyled: false
})

const style_adapter = useStyleAdapter()

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("card-footer", {})
})
</script>
