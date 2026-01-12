import { computed, readonly, type Ref } from "vue"
import type { CardProps, CardReturn, CardState } from "../types/card"
import { useUI } from "./useUIConfig"

/**
 * Cardコンポーネントのロジックを提供するComposable
 * 状態のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useCard = (props: Ref<CardProps>): CardReturn => {
    const ui_config = useUI("card")

    const state = computed((): CardState => ({
        padding: props.value.padding ?? ui_config.default_padding
    }))

    return {
        state: readonly(state)
    }
}
