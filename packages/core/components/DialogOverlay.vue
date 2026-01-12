<template>
    <div
        aria-hidden="true"
        @click="$emit('click')"
    />
</template>

<script setup lang="ts">
defineEmits<{
    click: []
}>()

defineOptions({
    name: "DialogOverlay"
})
</script>
