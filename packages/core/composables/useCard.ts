import { computed, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { CardProps, CardReturn } from "../types/card"
import { useUI } from "./useUIConfig"

/**
 * Cardコンポーネントのロジックを提供するComposable
 * paddingに基づいてクラスを生成
 * Providerから設定されたデフォルト値を使用
 */
export const useCard = (props: Ref<CardProps>): CardReturn => {
    const ui_config = useUI("card")

    const padding_classes = computed(() => {
        const padding_map: Record<NonNullable<CardProps["padding"]>, string> = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8"
        }
        return padding_map[props.value.padding ?? ui_config.default_padding]
    })

    const base_classes = computed(() =>
        cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            padding_classes.value
        )
    )

    return {
        base_classes
    }
}
