import { inject, provide, reactive, readonly, type InjectionKey } from "vue"
import type { DeepPartial } from "../types/utils"
import type { UIConfig, ButtonConfig, InputConfig, CardConfig, AlertConfig } from "../types/config"
import { DEFAULT_UI_CONFIG } from "../types/config"
import { deepMerge } from "../utils/deepMerge"
import { COMPONENT_ERRORS } from "../constants/errors"
import { CONFIG_LOGS } from "../constants/logs"

/**
 * UIConfig用のInjectionKey
 */
export const UI_CONFIG_KEY: InjectionKey<UIConfig> = Symbol("ui-config")

/**
 * UIProviderで設定を提供する
 * @param config - 部分的なUI設定（デフォルト値とマージされる）
 * @returns マージされたUI設定
 */
export const useUIProvider = (config: DeepPartial<UIConfig> = {}): UIConfig => {
    const merged_config = reactive(
        deepMerge(DEFAULT_UI_CONFIG, config)
    ) as UIConfig

    provide(UI_CONFIG_KEY, merged_config)

    if (import.meta.env.DEV) {
        console.debug(CONFIG_LOGS.PROVIDER_INITIALIZED, merged_config)
    }

    return merged_config
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
    const config = inject(UI_CONFIG_KEY, null)

    if (!config) {
        if (import.meta.env.DEV) {
            console.warn(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
        }
        return readonly(DEFAULT_UI_CONFIG[component]) as Readonly<UIConfig[K]>
    }

    return readonly(config[component]) as Readonly<UIConfig[K]>
}

/**
 * 全体のUI設定を取得する
 * @returns 読み取り専用の全体設定
 */
export const useUIConfig = (): Readonly<UIConfig> => {
    const config = inject(UI_CONFIG_KEY, null)

    if (!config) {
        if (import.meta.env.DEV) {
            console.warn(COMPONENT_ERRORS.PROVIDER_NOT_FOUND)
        }
        return readonly(DEFAULT_UI_CONFIG)
    }

    return readonly(config)
}
