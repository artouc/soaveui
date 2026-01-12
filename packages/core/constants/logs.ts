// CLAUDE.md規則: 全てのログメッセージは単一のファイル内に記述

export const FORM_LOGS = {
    FIELD_VALIDATED: (field: string) => `フィールド "${field}" のバリデーションが完了しました`,
    FORM_SUBMITTED: "フォームが送信されました",
    FORM_RESET: "フォームがリセットされました",
    VALIDATION_STARTED: "バリデーションを開始します"
} as const

export const COMPONENT_LOGS = {
    DIALOG_OPENED: "ダイアログが開かれました",
    DIALOG_CLOSED: "ダイアログが閉じられました",
    BUTTON_CLICKED: "ボタンがクリックされました",
    INPUT_FOCUSED: "入力フィールドにフォーカスが当たりました",
    INPUT_BLURRED: "入力フィールドからフォーカスが外れました"
} as const

export const CONFIG_LOGS = {
    PROVIDER_INITIALIZED: "UIProviderが初期化されました",
    CONFIG_UPDATED: "UI設定が更新されました"
} as const
