import { inject, provide, reactive, readonly, type InjectionKey } from "vue"
import type { DeepPartial } from "../types/utils"
import type { UIConfig, UIProviderContext, ButtonConfig, InputConfig, CardConfig, AlertConfig } from "../types/config"
import { DEFAULT_UI_CONFIG } from "../types/config"
import type { StyleAdapter } from "../adapters/types"
import { tailwindAdapter } from "../adapters/tailwind"
import { deepMerge } from "../utils/deepMerge"
import { COMPONENT_ERRORS } from "../constants/errors"
import { CONFIG_LOGS } from "../constants/logs"

/**
 * UIProviderContext用のInjectionKey
 */
export const UI_PROVIDER_KEY: InjectionKey<UIProviderContext> = Symbol("ui-provider")

/**
 * @deprecated UI_CONFIG_KEY は後方互換性のために残されています。UI_PROVIDER_KEY を使用してください。
 */
export const UI_CONFIG_KEY: InjectionKey<UIConfig> = Symbol("ui-config")

/**
 * UIProviderで設定とStyleAdapterを提供する
 * @param config - 部分的なUI設定（デフォルト値とマージされる）
 * @param adapter - 使用するStyleAdapter（デフォルト: tailwindAdapter）
 * @returns UIProviderContext
 */
export const useUIProvider = (
    config: DeepPartial<UIConfig> = {},
    adapter: StyleAdapter = tailwindAdapter
): UIProviderContext => {
    const merged_config = reactive(
        deepMerge(DEFAULT_UI_CONFIG, config)
    ) as UIConfig

    const context: UIProviderContext = {
        config: merged_config,
        adapter
    }

    provide(UI_PROVIDER_KEY, context)
    // 後方互換性のため、UI_CONFIG_KEYでも提供
    provide(UI_CONFIG_KEY, merged_config)

    if (import.meta.env.DEV) {
        console.debug(CONFIG_LOGS.PROVIDER_INITIALIZED, context)
    }

    return context
}

/**
 * コンポーネント固有の設定を取得する
 * @param component - コンポーネント名
 * @returns 読み取り専用の設定
 * @throws Provider未設定時はデフォルト設定を使用
 */
export function useUI(component: "button"): Readonly<ButtonConfig>
export function useUI(component: "input"): Readonly<InputConfig>
export function useUI(component: "card"): Readonly<CardConfig>
export function useUI(component: "alert"): Readonly<AlertConfig>
export function useUI<K extends keyof UIConfig>(component: K): Readonly<UIConfig[K]> {
    const context = inject(UI_PROVIDER_KEY, null)

    if (!context) {
        if (import.meta.env.DEV) {
            console.warn(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
        }
        return readonly(DEFAULT_UI_CONFIG[component]) as Readonly<UIConfig[K]>
    }

    return readonly(context.config[component]) as Readonly<UIConfig[K]>
}

/**
 * 全体のUI設定を取得する
 * @returns 読み取り専用の全体設定
 */
export const useUIConfig = (): Readonly<UIConfig> => {
    const context = inject(UI_PROVIDER_KEY, null)

    if (!context) {
        if (import.meta.env.DEV) {
            console.warn(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
        }
        return readonly(DEFAULT_UI_CONFIG)
    }

    return readonly(context.config)
}

/**
 * Style Adapter を取得する
 * @returns 現在設定されているStyleAdapter（デフォルト: tailwindAdapter）
 */
export const useStyleAdapter = (): StyleAdapter => {
    const context = inject(UI_PROVIDER_KEY, null)

    if (!context) {
        if (import.meta.env.DEV) {
            console.warn(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
        }
        return tailwindAdapter
    }

    return context.adapter
}
