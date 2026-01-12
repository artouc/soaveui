<template>
    <button
        type="button"
        aria-label="Close"
        @click="$emit('click')"
    >
        <slot>
            &times;
        </slot>
    </button>
</template>

<script setup lang="ts">
defineEmits<{
    click: []
}>()

defineOptions({
    name: "ToastClose"
})
</script>
