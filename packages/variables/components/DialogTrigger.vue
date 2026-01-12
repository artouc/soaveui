<template>
    <CoreDialogTrigger :as_child="asChild">
        <slot />
    </CoreDialogTrigger>
</template>

<script setup lang="ts">
import { DialogTrigger as CoreDialogTrigger } from "@soave/ui"

defineProps<{
    asChild?: boolean
}>()
</script>
