// CSS Variables ベースの Style Adapter（BEM命名）
import type { StyleAdapter } from "./types"
import type {
    ButtonState,
    InputState,
    CardState,
    DialogState,
    CheckboxState,
    RadioState,
    SwitchState,
    TextareaState,
    SelectState,
    ToastState,
    TooltipState,
    PopoverState,
    DropdownState,
    SheetState,
    AlertState,
    ComponentState
} from "../types/composables"

export const cssVariablesAdapter: StyleAdapter = {
    name: "css-variables",
    description: "CSS Variables ベースのスタイリング（BEM命名）",

    getClasses(component: string, state: ComponentState): string {
        switch (component) {
            case "button":
                return getCssVariablesButtonClasses(state as ButtonState)
            case "input":
                return getCssVariablesInputClasses(state as InputState)
            case "card":
                return getCssVariablesCardClasses(state as CardState)
            case "dialog":
                return getCssVariablesDialogClasses(state as DialogState)
            case "dialog-overlay":
                return "dialog__overlay"
            case "checkbox":
                return getCssVariablesCheckboxClasses(state as CheckboxState)
            case "radio":
                return getCssVariablesRadioClasses(state as RadioState)
            case "radio-group":
                return getCssVariablesRadioGroupClasses(state as { orientation: string })
            case "radio-indicator":
                return "radio__indicator"
            case "switch":
                return getCssVariablesSwitchClasses(state as SwitchState)
            case "textarea":
                return getCssVariablesTextareaClasses(state as TextareaState)
            case "select":
                return getCssVariablesSelectClasses(state as SelectState)
            case "select-content":
                return "select__content"
            case "select-item":
                return "select__item"
            case "select-value":
                return getCssVariablesSelectValueClasses(state as { hasValue: boolean })
            case "select-trigger-icon":
                return "select__trigger-icon"
            case "toast":
                return getCssVariablesToastClasses(state as ToastState)
            case "toast-title":
                return "toast__title"
            case "toast-description":
                return "toast__description"
            case "toast-action":
                return "toast__action"
            case "toast-dismiss":
                return "toast__dismiss"
            case "toaster":
                return getCssVariablesToasterClasses(state as { position: string })
            case "tooltip":
                return getCssVariablesTooltipClasses(state as TooltipState)
            case "popover":
                return getCssVariablesPopoverClasses(state as PopoverState)
            case "dropdown":
                return getCssVariablesDropdownClasses(state as DropdownState)
            case "dropdown-item":
                return "dropdown__item"
            case "sheet":
                return getCssVariablesSheetClasses(state as SheetState)
            case "sheet-overlay":
                return "sheet__overlay"
            case "sheet-header":
                return "sheet__header"
            case "sheet-title":
                return "sheet__title"
            case "sheet-description":
                return "sheet__description"
            case "sheet-footer":
                return "sheet__footer"
            case "sheet-close":
                return "sheet__close"
            case "alert":
                return getCssVariablesAlertClasses(state as AlertState)
            case "alert-title":
                return "alert__title"
            case "alert-description":
                return "alert__description"
            case "label":
                return "label"
            // Dialog sub-components
            case "dialog-header":
                return "dialog__header"
            case "dialog-title":
                return "dialog__title"
            case "dialog-description":
                return "dialog__description"
            case "dialog-footer":
                return "dialog__footer"
            case "dialog-close":
                return "dialog__close"
            // Card sub-components
            case "card-header":
                return "card__header"
            case "card-title":
                return "card__title"
            case "card-description":
                return "card__description"
            case "card-content":
                return "card__content"
            case "card-footer":
                return "card__footer"
            default:
                return ""
        }
    }
}

function getCssVariablesButtonClasses(state: ButtonState): string {
    return [
        "button",
        `button--${state.variant}`,
        `button--${state.size}`,
        state.disabled && "button--disabled",
        state.loading && "button--loading"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesInputClasses(state: InputState): string {
    return [
        "input",
        `input--${state.size}`,
        state.error && "input--error",
        state.disabled && "input--disabled",
        state.readonly && "input--readonly"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesCardClasses(state: CardState): string {
    return [
        "card",
        state.padding !== "none" && `card--padding-${state.padding}`
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesDialogClasses(state: DialogState): string {
    return [
        "dialog",
        state.is_open && "dialog--open"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesCheckboxClasses(state: CheckboxState): string {
    return [
        "checkbox",
        state.checked && "checkbox--checked",
        state.indeterminate && "checkbox--indeterminate",
        state.disabled && "checkbox--disabled"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesRadioClasses(state: RadioState): string {
    return [
        "radio",
        state.checked && "radio--checked",
        state.disabled && "radio--disabled"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesSwitchClasses(state: SwitchState): string {
    return [
        "switch",
        state.checked && "switch--checked",
        state.disabled && "switch--disabled"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesTextareaClasses(state: TextareaState): string {
    return [
        "textarea",
        `textarea--${state.size}`,
        state.error && "textarea--error",
        state.disabled && "textarea--disabled",
        state.readonly && "textarea--readonly"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesSelectClasses(state: SelectState): string {
    return [
        "select",
        `select--${state.size}`,
        state.is_open && "select--open",
        state.disabled && "select--disabled"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesToastClasses(state: ToastState): string {
    return [
        "toast",
        `toast--${state.variant}`
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesTooltipClasses(state: TooltipState): string {
    return [
        "tooltip",
        state.is_open && "tooltip--open",
        `tooltip--${state.side}`
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesPopoverClasses(state: PopoverState): string {
    return [
        "popover",
        state.is_open && "popover--open"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesDropdownClasses(state: DropdownState): string {
    return [
        "dropdown",
        state.is_open && "dropdown--open"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesSheetClasses(state: SheetState): string {
    return [
        "sheet",
        state.is_open && "sheet--open",
        `sheet--${state.side}`
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesAlertClasses(state: AlertState): string {
    return ["alert", `alert--${state.variant}`].join(" ")
}

function getCssVariablesSelectValueClasses(state: { hasValue: boolean }): string {
    return [
        "select__value",
        !state.hasValue && "select__value--placeholder"
    ]
        .filter(Boolean)
        .join(" ")
}

function getCssVariablesToasterClasses(state: { position: string }): string {
    return [
        "toaster",
        `toaster--${state.position}`
    ].join(" ")
}

function getCssVariablesRadioGroupClasses(state: { orientation: string }): string {
    return [
        "radio-group",
        `radio-group--${state.orientation}`
    ].join(" ")
}
