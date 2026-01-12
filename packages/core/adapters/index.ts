// Style Adapter System
// 全ての Adapter をエクスポート

export type { StyleAdapter } from "./types"
export { registerAdapter, getAdapter, getRegisteredAdapters, ADAPTER_REGISTRY } from "./types"

export { tailwindAdapter } from "./tailwind"
export { cssVariablesAdapter } from "./css-variables"
export { headlessAdapter } from "./headless"

// 組み込み Adapter を自動登録
import { registerAdapter } from "./types"
import { tailwindAdapter } from "./tailwind"
import { cssVariablesAdapter } from "./css-variables"
import { headlessAdapter } from "./headless"

registerAdapter(tailwindAdapter)
registerAdapter(cssVariablesAdapter)
registerAdapter(headlessAdapter)
