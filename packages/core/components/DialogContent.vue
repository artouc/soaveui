<template>
    <div
        ref="content_ref"
        role="document"
        tabindex="-1"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const content_ref = ref<HTMLElement | null>(null)

defineOptions({
    name: "DialogContent"
})

defineExpose({
    content_ref
})
</script>
