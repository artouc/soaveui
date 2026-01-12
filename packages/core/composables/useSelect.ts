import { computed, inject, readonly, type Ref } from "vue"
import type {
    SelectContext,
    SelectTriggerReturn,
    SelectContentReturn,
    SelectItemReturn,
    SelectTriggerState,
    SelectContentState,
    SelectItemState
} from "../types/select"
import { SELECT_KEY } from "../types/select"
import { COMPONENT_ERRORS } from "../constants/errors"

/**
 * SelectTriggerコンポーネントのロジックを提供するComposable
 * 状態のみを返す（スタイル情報なし）
 */
export const useSelectTrigger = (): SelectTriggerReturn => {
    const context = inject<SelectContext | null>(SELECT_KEY, null)

    if (!context) {
        throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
    }

    const state = computed((): SelectTriggerState => ({
        size: context.size.value,
        disabled: context.disabled.value,
        is_open: context.is_open.value
    }))

    return {
        state: readonly(state)
    }
}

/**
 * SelectContentコンポーネントのロジックを提供するComposable
 * 状態のみを返す（スタイル情報なし）
 */
export const useSelectContent = (): SelectContentReturn => {
    const context = inject<SelectContext | null>(SELECT_KEY, null)

    if (!context) {
        throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
    }

    const state = computed((): SelectContentState => ({
        is_open: context.is_open.value
    }))

    return {
        state: readonly(state)
    }
}

/**
 * SelectItemコンポーネントのロジックを提供するComposable
 * 状態のみを返す（スタイル情報なし）
 */
export const useSelectItem = (
    props: Ref<{ value: string; disabled?: boolean }>
): SelectItemReturn => {
    const context = inject<SelectContext | null>(SELECT_KEY, null)

    if (!context) {
        throw new Error(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
    }

    const state = computed((): SelectItemState => ({
        selected: context.model_value.value === props.value.value,
        disabled: props.value.disabled ?? false
    }))

    return {
        state: readonly(state)
    }
}
