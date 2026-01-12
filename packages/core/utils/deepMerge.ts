import type { DeepPartial } from "../types/utils"

/**
 * オブジェクトを深層マージするユーティリティ関数
 * sourceの値でtargetを上書きする（undefinedは無視）
 */
export const deepMerge = <T extends Record<string, unknown>>(
    target: T,
    source: DeepPartial<T>
): T => {
    const output = { ...target }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const source_value = source[key]
            const target_value = target[key]

            if (
                source_value !== null &&
                typeof source_value === "object" &&
                !Array.isArray(source_value) &&
                target_value !== null &&
                typeof target_value === "object" &&
                !Array.isArray(target_value)
            ) {
                output[key] = deepMerge(
                    target_value as Record<string, unknown>,
                    source_value as DeepPartial<Record<string, unknown>>
                ) as T[Extract<keyof T, string>]
            } else if (source_value !== undefined) {
                output[key] = source_value as T[Extract<keyof T, string>]
            }
        }
    }

    return output
}
