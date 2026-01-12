// CLAUDE.md規則: 全ての型は単一のディレクトリ内にファイルを作って記述
// Style Adapter System のための Composable 型定義

import type { Ref } from "vue"

/**
 * Button の状態
 */
export interface ButtonState {
    variant: "primary" | "secondary" | "ghost" | "outline" | "destructive"
    size: "sm" | "md" | "lg"
    disabled: boolean
    loading: boolean
}

/**
 * Input の状態
 */
export interface InputState {
    size: "sm" | "md" | "lg"
    disabled: boolean
    readonly: boolean
    error: string | undefined
}

/**
 * Dialog の状態
 */
export interface DialogState {
    is_open: boolean
}

/**
 * Card の状態
 */
export interface CardState {
    padding: "sm" | "md" | "lg" | "none"
}

/**
 * Checkbox の状態
 */
export interface CheckboxState {
    checked: boolean
    disabled: boolean
    indeterminate: boolean
}

/**
 * Radio の状態
 */
export interface RadioState {
    checked: boolean
    disabled: boolean
}

/**
 * Switch の状態
 */
export interface SwitchState {
    checked: boolean
    disabled: boolean
}

/**
 * Textarea の状態
 */
export interface TextareaState {
    size: "sm" | "md" | "lg"
    disabled: boolean
    readonly: boolean
    error: string | undefined
}

/**
 * Select の状態
 */
export interface SelectState {
    size: "sm" | "md" | "lg"
    disabled: boolean
    is_open: boolean
}

/**
 * Toast の状態
 */
export interface ToastState {
    variant: "default" | "success" | "error" | "warning" | "info"
}

/**
 * Tooltip の状態
 */
export interface TooltipState {
    is_open: boolean
    side: "top" | "right" | "bottom" | "left"
}

/**
 * Popover の状態
 */
export interface PopoverState {
    is_open: boolean
}

/**
 * Dropdown の状態
 */
export interface DropdownState {
    is_open: boolean
}

/**
 * Sheet の状態
 */
export interface SheetState {
    is_open: boolean
    side: "top" | "right" | "bottom" | "left"
}

/**
 * Alert の状態
 */
export interface AlertState {
    variant: "default" | "info" | "success" | "warning" | "destructive"
}

/**
 * 汎用的なコンポーネント状態
 */
export interface ComponentState {
    [key: string]: unknown
}

/**
 * Headless Composable の戻り値型
 * ロジック情報のみを返し、スタイル情報は返さない
 */
export interface HeadlessComposableReturn<T extends ComponentState> {
    state: Readonly<Ref<T>>
    aria_attributes: Readonly<Ref<Record<string, string | boolean | undefined>>>
}
