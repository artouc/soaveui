<template>
    <CoreSwitch
        v-model="model"
        :class="trackClasses"
        :size="size"
        :disabled="disabled"
        @change="emit('change', $event)"
    >
        <template #default="{ checked }">
            <span :class="thumbClasses" :data-state="checked ? 'checked' : 'unchecked'" />
        </template>
    </CoreSwitch>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Switch as CoreSwitch } from "@soave/ui"
import type { SwitchProps } from "@soave/ui"

interface StyledSwitchProps extends SwitchProps {
    class?: string
}

const props = withDefaults(defineProps<StyledSwitchProps>(), {
    size: "md",
    disabled: false
})

const model = defineModel<boolean>({ default: false })

const emit = defineEmits<{
    change: [checked: boolean]
}>()

const trackClasses = computed(() => {
    const base = "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"

    const sizes: Record<string, string> = {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14"
    }

    return [
        base,
        sizes[props.size ?? "md"],
        props.class
    ].filter(Boolean).join(" ")
})

const thumbClasses = computed(() => {
    const base = "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0"

    const sizes: Record<string, string> = {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4",
        md: "h-5 w-5 data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7"
    }

    return [
        base,
        sizes[props.size ?? "md"]
    ].join(" ")
})
</script>
