import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * クラス名をマージするユーティリティ関数
 * clsxで条件付きクラスを処理し、tailwind-mergeで競合を解決
 */
export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs))
}
