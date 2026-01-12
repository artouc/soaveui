import type { ComputedRef, Ref } from "vue"

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

export interface FileInputAriaAttributes {
    "aria-disabled"?: boolean
    "aria-invalid"?: boolean
}

export interface FileInputReturn {
    base_classes: ComputedRef<string>
    dropzone_classes: ComputedRef<string>
    is_disabled: ComputedRef<boolean>
    is_dragging: Ref<boolean>
    files: Ref<FileInfo[]>
    error: Ref<string | null>
    aria_attributes: ComputedRef<FileInputAriaAttributes>
    handleFiles: (file_list: FileList | null) => void
    handleDragEnter: (event: DragEvent) => void
    handleDragLeave: (event: DragEvent) => void
    handleDrop: (event: DragEvent) => void
    removeFile: (index: number) => void
    clearFiles: () => void
    openFilePicker: () => void
}
