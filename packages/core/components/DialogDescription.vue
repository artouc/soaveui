<template>
    <p :id="id">
        <slot />
    </p>
</template>

<script setup lang="ts">
const props = defineProps<{
    id?: string
}>()

defineOptions({
    name: "DialogDescription"
})
</script>
