// Style Adapter System の型定義
import type { ComponentState } from "../types/composables"

/**
 * Style Adapter インターフェース
 * コンポーネントの状態からスタイルクラスを生成する
 */
export interface StyleAdapter {
    /**
     * Adapter の識別名
     */
    name: "tailwind" | "css-variables" | "headless" | string

    /**
     * Adapter の説明
     */
    description?: string

    /**
     * コンポーネント名と状態からクラス文字列を生成
     * @param component コンポーネント名（"button", "input" など）
     * @param state コンポーネントの状態オブジェクト
     * @returns CSS クラス文字列
     */
    getClasses(component: string, state: ComponentState): string
}

/**
 * Adapter レジストリ
 */
export const ADAPTER_REGISTRY = new Map<string, StyleAdapter>()

/**
 * Adapter を登録
 */
export const registerAdapter = (adapter: StyleAdapter): void => {
    ADAPTER_REGISTRY.set(adapter.name, adapter)
}

/**
 * Adapter を取得
 */
export const getAdapter = (name: string): StyleAdapter | undefined => {
    return ADAPTER_REGISTRY.get(name)
}

/**
 * 全ての登録済み Adapter を取得
 */
export const getRegisteredAdapters = (): Map<string, StyleAdapter> => {
    return ADAPTER_REGISTRY
}
