<template>
    <span :class="[computed_classes, props.class]">
        <slot v-if="hasValue" />
        <template v-else>{{ context?.placeholder.value }}</template>
    </span>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import { useStyleAdapter } from "../../composables"
import type { SelectContext, SelectValueProps } from "../../types/select"
import { SELECT_KEY } from "../../types/select"

const props = withDefaults(defineProps<SelectValueProps>(), {
    unstyled: false
})

const context = inject<SelectContext>(SELECT_KEY)
const style_adapter = useStyleAdapter()

const hasValue = computed(() => !!context?.model_value.value)

const computed_classes = computed(() => {
    if (props.unstyled) return ""
    return style_adapter.getClasses("select-value", { hasValue: hasValue.value })
})
</script>
