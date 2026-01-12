<template>
    <div
        role="alert"
        :data-variant="variant"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    variant?: "default" | "info" | "success" | "warning" | "destructive"
}>(), {
    variant: "default"
})

defineOptions({
    name: "Alert"
})
</script>
