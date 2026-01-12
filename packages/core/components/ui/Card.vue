<template>
    <div :class="composable.base_classes.value">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useCard } from "../../composables/useCard"
import type { CardProps } from "../../types/card"

const props = defineProps<CardProps>()

const composable = useCard(toRef(() => props))
</script>
