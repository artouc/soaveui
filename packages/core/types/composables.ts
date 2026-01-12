// CLAUDE.md規則: 全ての型は単一のディレクトリ内にファイルを作って記述
// Style Adapter System のための Composable 型定義

import type { Ref } from "vue"

/**
 * 汎用的なコンポーネント状態（基底型）
 */
export interface ComponentState {
    [key: string]: unknown
}

/**
 * Button の状態
 */
export interface ButtonState extends ComponentState {
    variant: "primary" | "secondary" | "ghost" | "outline" | "destructive"
    size: "sm" | "md" | "lg"
    disabled: boolean
    loading: boolean
    type: "button" | "submit" | "reset"
}

/**
 * Input の状態
 */
export interface InputState extends ComponentState {
    type: "text" | "email" | "password" | "number" | "tel" | "url" | "search"
    size: "sm" | "md" | "lg"
    disabled: boolean
    readonly: boolean
    has_error: boolean
}

/**
 * Dialog の状態
 */
export interface DialogState extends ComponentState {
    is_open: boolean
}

/**
 * Card の状態
 */
export interface CardState extends ComponentState {
    padding: "sm" | "md" | "lg" | "none"
}

/**
 * Checkbox の状態
 */
export interface CheckboxState extends ComponentState {
    size: "sm" | "md" | "lg"
    checked: boolean
    disabled: boolean
    indeterminate: boolean
}

/**
 * Radio の状態
 */
export interface RadioItemState extends ComponentState {
    size: "sm" | "md" | "lg"
    checked: boolean
    disabled: boolean
}

/**
 * Radio の状態（エイリアス）
 */
export type RadioState = RadioItemState

/**
 * Switch の状態
 */
export interface SwitchState extends ComponentState {
    size: "sm" | "md" | "lg"
    checked: boolean
    disabled: boolean
}

/**
 * Textarea の状態
 */
export interface TextareaState extends ComponentState {
    size: "sm" | "md" | "lg"
    disabled: boolean
    readonly: boolean
    has_error: boolean
    resize: "none" | "vertical" | "horizontal" | "both"
}

/**
 * Select Trigger の状態
 */
export interface SelectTriggerState extends ComponentState {
    size: "sm" | "md" | "lg"
    disabled: boolean
    is_open: boolean
}

/**
 * Select Content の状態
 */
export interface SelectContentState extends ComponentState {
    is_open: boolean
}

/**
 * Select Item の状態
 */
export interface SelectItemState extends ComponentState {
    selected: boolean
    disabled: boolean
}

/**
 * Select の状態（エイリアス）
 */
export type SelectState = SelectTriggerState

/**
 * FileInput の状態
 */
export interface FileInputState extends ComponentState {
    disabled: boolean
    is_dragging: boolean
    has_error: boolean
    has_files: boolean
}

/**
 * Toast の状態
 */
export interface ToastState extends ComponentState {
    variant: "default" | "success" | "error" | "warning" | "info"
}

/**
 * Tooltip の状態
 */
export interface TooltipState extends ComponentState {
    is_open: boolean
    side: "top" | "right" | "bottom" | "left"
}

/**
 * Popover の状態
 */
export interface PopoverState extends ComponentState {
    is_open: boolean
}

/**
 * Dropdown の状態
 */
export interface DropdownState extends ComponentState {
    is_open: boolean
}

/**
 * Sheet の状態
 */
export interface SheetState extends ComponentState {
    is_open: boolean
    side: "top" | "right" | "bottom" | "left"
}

/**
 * Alert の状態
 */
export interface AlertState extends ComponentState {
    variant: "default" | "info" | "success" | "warning" | "destructive"
}

/**
 * Headless Composable の戻り値型
 * ロジック情報のみを返し、スタイル情報は返さない
 */
export interface HeadlessComposableReturn<T extends ComponentState> {
    state: Readonly<Ref<T>>
    aria_attributes: Readonly<Ref<Record<string, string | boolean | undefined>>>
}
