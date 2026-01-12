import type { ComputedRef, Ref } from "vue"

export interface FormState<T> {
    values: T
    errors: Partial<Record<keyof T, string>>
    touched: Partial<Record<keyof T, boolean>>
    is_submitting: boolean
    is_dirty: boolean
}

/**
 * 配列フィールド操作のためのヘルパー型
 */
export interface FieldArrayHelpers<TItem> {
    fields: TItem[]
    append: (value: TItem) => void
    prepend: (value: TItem) => void
    insert: (index: number, value: TItem) => void
    remove: (index: number) => void
    move: (from_index: number, to_index: number) => void
    swap: (index_a: number, index_b: number) => void
    replace: (index: number, value: TItem) => void
    clear: () => void
}

/**
 * ファイルアップロード用の型
 */
export interface FileFieldValue {
    file: File | null
    preview_url: string | null
    is_uploading: boolean
    progress: number
    error: string | null
}

export interface FileFieldOptions {
    accept?: string
    max_size?: number
    on_upload?: (file: File) => Promise<string>
}

export interface FormReturn<T> {
    values: T
    errors: Readonly<Partial<Record<keyof T, string>>>
    touched: Readonly<Partial<Record<keyof T, boolean>>>
    is_valid: ComputedRef<boolean>
    is_submitting: ComputedRef<boolean>
    is_dirty: ComputedRef<boolean>
    validateField: (field: keyof T) => void
    validateAll: () => boolean
    reset: () => void
    setValues: (values: Partial<T>) => void
    setFieldValue: (field: keyof T, value: T[keyof T]) => void
    submit: (on_submit: (data: T) => Promise<void>) => Promise<void>
    getFieldArray: <K extends keyof T>(field: K) => T[K] extends Array<infer U> ? FieldArrayHelpers<U> : never
}

export interface FormFieldProps {
    name?: string
    class?: string
}

export interface FormLabelProps {
    for?: string
    class?: string
    required?: boolean
}

export interface FormInputProps {
    id?: string
    name?: string
    error?: string
    class?: string
}

export interface FormErrorProps {
    class?: string
}
