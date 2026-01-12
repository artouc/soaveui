// Headless Adapter（スタイル適用なし）
import type { StyleAdapter } from "./types"

/**
 * Headless Adapter
 * スタイル情報を一切返さない
 * ユーザーが完全にカスタムスタイルを適用したい場合に使用
 */
export const headlessAdapter: StyleAdapter = {
    name: "headless",
    description: "Headless モード（スタイル適用なし）",

    getClasses(_component: string, _state): string {
        // スタイル情報を返さない
        return ""
    }
}
