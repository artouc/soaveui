// CLAUDE.md規則: 全てのエラーメッセージは単一のファイル内に記述

export const FORM_ERRORS = {
    FIELD_NOT_FOUND: "指定されたフィールドがスキーマに存在しません",
    VALIDATION_FAILED: "バリデーションに失敗しました",
    SUBMIT_FAILED: "フォームの送信に失敗しました",
    SCHEMA_INVALID: "無効なスキーマが指定されました"
} as const

export const COMPONENT_ERRORS = {
    INVALID_VARIANT: "無効なvariantが指定されました",
    INVALID_SIZE: "無効なsizeが指定されました",
    PROVIDER_NOT_FOUND: "UIProviderが見つかりません。アプリケーションをUIProviderでラップしてください"
} as const

export const DIALOG_ERRORS = {
    ALREADY_OPEN: "ダイアログは既に開いています",
    ALREADY_CLOSED: "ダイアログは既に閉じています"
} as const

export const INPUT_ERRORS = {
    INVALID_TYPE: "無効なinputタイプが指定されました"
} as const

export type FormErrorKey = keyof typeof FORM_ERRORS
export type ComponentErrorKey = keyof typeof COMPONENT_ERRORS
export type DialogErrorKey = keyof typeof DIALOG_ERRORS
export type InputErrorKey = keyof typeof INPUT_ERRORS
