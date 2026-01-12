<script setup lang="ts">
import type { DeepPartial } from "../../types/utils"
import type { UIConfig } from "../../types/config"
import { useUIProvider } from "../../composables/useUIConfig"

interface UIProviderProps {
    config?: DeepPartial<UIConfig>
}

const props = withDefaults(defineProps<UIProviderProps>(), {
    config: () => ({})
})

useUIProvider(props.config)
</script>

<template>
    <slot />
</template>
