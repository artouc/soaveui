import { computed, ref, readonly, type Ref } from "vue"
import type { FileInputProps, FileInputReturn, FileInputAriaAttributes, FileInfo, FileInputState } from "../types/file-input"

const FILE_ERRORS = {
    MAX_SIZE_EXCEEDED: (max: number) => `ファイルサイズが${formatFileSize(max)}を超えています`,
    MAX_FILES_EXCEEDED: (max: number) => `最大${max}ファイルまでアップロードできます`,
    INVALID_TYPE: "許可されていないファイル形式です"
} as const

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

const createPreviewUrl = (file: File): string | null => {
    if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file)
    }
    return null
}

/**
 * FileInputコンポーネントのロジックを提供するComposable
 * 状態とARIA属性のみを返す（スタイル情報なし）
 * スタイルは StyleAdapter または外部のスタイルパッケージが担当
 */
export const useFileInput = (
    props: Ref<FileInputProps>,
    input_ref: Ref<HTMLInputElement | null>
): FileInputReturn => {
    const is_dragging = ref(false)
    const files = ref<FileInfo[]>([])
    const error = ref<string | null>(null)

    const state = computed((): FileInputState => ({
        disabled: props.value.disabled ?? false,
        is_dragging: is_dragging.value,
        has_error: !!error.value,
        has_files: files.value.length > 0
    }))

    const aria_attributes = computed<FileInputAriaAttributes>(() => ({
        "aria-disabled": state.value.disabled || undefined,
        "aria-invalid": state.value.has_error || undefined
    }))

    const validateFile = (file: File): string | null => {
        const { accept, max_size } = props.value

        if (max_size && file.size > max_size) {
            return FILE_ERRORS.MAX_SIZE_EXCEEDED(max_size)
        }

        if (accept) {
            const accepted_types = accept.split(",").map(t => t.trim())
            const is_valid = accepted_types.some(type => {
                if (type.startsWith(".")) {
                    return file.name.toLowerCase().endsWith(type.toLowerCase())
                }
                if (type.endsWith("/*")) {
                    return file.type.startsWith(type.replace("/*", "/"))
                }
                return file.type === type
            })

            if (!is_valid) {
                return FILE_ERRORS.INVALID_TYPE
            }
        }

        return null
    }

    const handleFiles = (file_list: FileList | null): void => {
        if (!file_list || state.value.disabled) return

        error.value = null
        const { multiple, max_files } = props.value
        const new_files: FileInfo[] = []

        const files_to_process = Array.from(file_list)

        for (const file of files_to_process) {
            const validation_error = validateFile(file)
            if (validation_error) {
                error.value = validation_error
                return
            }

            new_files.push({
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                preview_url: createPreviewUrl(file)
            })
        }

        if (multiple) {
            const total = files.value.length + new_files.length
            if (max_files && total > max_files) {
                error.value = FILE_ERRORS.MAX_FILES_EXCEEDED(max_files)
                return
            }
            files.value.push(...new_files)
        } else {
            files.value.forEach(f => {
                if (f.preview_url) URL.revokeObjectURL(f.preview_url)
            })
            files.value = new_files.slice(0, 1)
        }
    }

    const handleDragEnter = (event: DragEvent): void => {
        event.preventDefault()
        if (!state.value.disabled) {
            is_dragging.value = true
        }
    }

    const handleDragLeave = (event: DragEvent): void => {
        event.preventDefault()
        is_dragging.value = false
    }

    const handleDrop = (event: DragEvent): void => {
        event.preventDefault()
        is_dragging.value = false
        if (!state.value.disabled) {
            handleFiles(event.dataTransfer?.files ?? null)
        }
    }

    const removeFile = (index: number): void => {
        const removed = files.value.splice(index, 1)[0]
        if (removed?.preview_url) {
            URL.revokeObjectURL(removed.preview_url)
        }
    }

    const clearFiles = (): void => {
        files.value.forEach(f => {
            if (f.preview_url) URL.revokeObjectURL(f.preview_url)
        })
        files.value = []
        error.value = null
    }

    const openFilePicker = (): void => {
        if (!state.value.disabled && input_ref.value) {
            input_ref.value.click()
        }
    }

    return {
        state: readonly(state),
        is_dragging,
        files,
        error,
        aria_attributes: readonly(aria_attributes),
        handleFiles,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        removeFile,
        clearFiles,
        openFilePicker
    }
}
