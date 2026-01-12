<template>
    <Teleport to="body">
        <div
            v-if="context?.is_open.value"
            class="fixed inset-0 z-40"
            @click="context?.close()"
        />
        <div
            v-if="context?.is_open.value"
            :class="composable.base_classes.value"
            :data-state="context?.is_open.value ? 'open' : 'closed'"
            role="listbox"
        >
            <div class="p-1">
                <slot />
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { inject } from "vue"
import { useSelectContent } from "../../composables/useSelect"
import type { SelectContext } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

const context = inject<SelectContext>(SELECT_KEY)
const composable = useSelectContent()
</script>
