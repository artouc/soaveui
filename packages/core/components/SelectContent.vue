<template>
    <div
        v-if="composable.state.value.is_open"
        role="listbox"
        tabindex="-1"
        @keydown="handleKeyDown"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue"
import { useSelectContent } from "../../composables/useSelect"
import type { SelectContext } from "../../types/select"
import { SELECT_KEY } from "../../types/select"
import { COMPONENT_ERRORS } from "../../constants/errors"

const context = inject<SelectContext | null>(SELECT_KEY, null)

if (!context) {
    throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
}

const composable = useSelectContent()

const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
        case "Escape":
            event.preventDefault()
            context.close()
            context.trigger_ref.value?.focus()
            break
    }
}

defineExpose({
    state: composable.state
})
</script>
