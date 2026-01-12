<script setup lang="ts">
import type { DeepPartial } from "../../types/utils"
import type { UIConfig } from "../../types/config"
import type { StyleAdapter } from "../../adapters/types"
import { useUIProvider } from "../../composables/useUIConfig"
import { tailwindAdapter } from "../../adapters/tailwind"

interface UIProviderProps {
    config?: DeepPartial<UIConfig>
    adapter?: StyleAdapter
}

const props = withDefaults(defineProps<UIProviderProps>(), {
    config: () => ({}),
    adapter: () => tailwindAdapter
})

useUIProvider(props.config, props.adapter)
</script>

<template>
    <slot />
</template>
