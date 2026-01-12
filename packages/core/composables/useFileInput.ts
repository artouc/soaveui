import { computed, ref, type Ref } from "vue"
import { cn } from "../utils/cn"
import type { FileInputProps, FileInputReturn, FileInputAriaAttributes, FileInfo } from "../types/file-input"

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
 */
export const useFileInput = (
    props: Ref<FileInputProps>,
    input_ref: Ref<HTMLInputElement | null>
): FileInputReturn => {
    const is_disabled = computed(() => props.value.disabled ?? false)
    const is_dragging = ref(false)
    const files = ref<FileInfo[]>([])
    const error = ref<string | null>(null)

    const base_classes = computed(() =>
        cn(
            "relative",
            is_disabled.value && "opacity-50 cursor-not-allowed"
        )
    )

    const dropzone_classes = computed(() =>
        cn(
            "flex flex-col items-center justify-center w-full p-6",
            "border-2 border-dashed rounded-lg",
            "transition-colors cursor-pointer",
            "hover:border-primary hover:bg-primary/5",
            is_dragging.value && "border-primary bg-primary/10",
            error.value && "border-destructive",
            is_disabled.value && "pointer-events-none"
        )
    )

    const aria_attributes = computed<FileInputAriaAttributes>(() => ({
        "aria-disabled": is_disabled.value || undefined,
        "aria-invalid": !!error.value || undefined
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
        if (!file_list || is_disabled.value) return

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
        if (!is_disabled.value) {
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
        if (!is_disabled.value) {
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
        if (!is_disabled.value && input_ref.value) {
            input_ref.value.click()
        }
    }

    return {
        base_classes,
        dropzone_classes,
        is_disabled,
        is_dragging,
        files,
        error,
        aria_attributes,
        handleFiles,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        removeFile,
        clearFiles,
        openFilePicker
    }
}
