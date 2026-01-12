<template>
    <div
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: "SheetContent"
})
</script>
