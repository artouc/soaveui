import type { ComputedRef, Ref, DeepReadonly } from "vue"

export interface FileInputProps {
    accept?: string
    multiple?: boolean
    disabled?: boolean
    max_size?: number
    max_files?: number
}

export interface FileInfo {
    file: File
    name: string
    size: number
    type: string
    preview_url: string | null
}

/**
 * ファイル入力の状態（StyleAdapterに渡す用）
 */
export interface FileInputState {
    disabled: boolean
    is_dragging: boolean
    has_error: boolean
    has_files: boolean
}

export interface FileInputAriaAttributes {
    "aria-disabled"?: boolean
    "aria-invalid"?: boolean
}

/**
 * useFileInput の戻り値（ヘッドレス - スタイル情報なし）
 */
export interface FileInputReturn {
    state: DeepReadonly<ComputedRef<FileInputState>>
    is_dragging: Ref<boolean>
    files: Ref<FileInfo[]>
    error: Ref<string | null>
    aria_attributes: DeepReadonly<ComputedRef<FileInputAriaAttributes>>
    handleFiles: (file_list: FileList | null) => void
    handleDragEnter: (event: DragEvent) => void
    handleDragLeave: (event: DragEvent) => void
    handleDrop: (event: DragEvent) => void
    removeFile: (index: number) => void
    clearFiles: () => void
    openFilePicker: () => void
}
