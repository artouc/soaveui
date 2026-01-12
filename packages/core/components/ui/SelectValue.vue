<template>
    <span :class="!hasValue && 'text-muted-foreground'">
        <slot v-if="hasValue" />
        <template v-else>{{ context?.placeholder.value }}</template>
    </span>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import type { SelectContext } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

const context = inject<SelectContext>(SELECT_KEY)

const hasValue = computed(() => !!context?.model_value.value)
</script>
