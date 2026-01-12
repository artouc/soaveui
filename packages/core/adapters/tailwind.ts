// Tailwind CSS ベースの Style Adapter
import { cn } from "../utils/cn"
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

export const tailwindAdapter: StyleAdapter = {
    name: "tailwind",
    description: "Tailwind CSS ベースのスタイリング",

    getClasses(component: string, state: ComponentState): string {
        switch (component) {
            case "button":
                return getTailwindButtonClasses(state as ButtonState)
            case "input":
                return getTailwindInputClasses(state as InputState)
            case "card":
                return getTailwindCardClasses(state as CardState)
            case "dialog":
                return getTailwindDialogClasses(state as DialogState)
            case "dialog-overlay":
                return getTailwindDialogOverlayClasses()
            case "checkbox":
                return getTailwindCheckboxClasses(state as CheckboxState)
            case "radio":
                return getTailwindRadioClasses(state as RadioState)
            case "radio-group":
                return getTailwindRadioGroupClasses(state as { orientation: string })
            case "radio-indicator":
                return getTailwindRadioIndicatorClasses()
            case "switch":
                return getTailwindSwitchClasses(state as SwitchState)
            case "textarea":
                return getTailwindTextareaClasses(state as TextareaState)
            case "select":
                return getTailwindSelectClasses(state as SelectState)
            case "select-content":
                return getTailwindSelectContentClasses()
            case "select-item":
                return getTailwindSelectItemClasses()
            case "select-value":
                return getTailwindSelectValueClasses(state as { hasValue: boolean })
            case "select-trigger-icon":
                return getTailwindSelectTriggerIconClasses()
            case "toast":
                return getTailwindToastClasses(state as ToastState)
            case "toast-title":
                return getTailwindToastTitleClasses()
            case "toast-description":
                return getTailwindToastDescriptionClasses()
            case "toast-action":
                return getTailwindToastActionClasses()
            case "toast-dismiss":
                return getTailwindToastDismissClasses()
            case "toaster":
                return getTailwindToasterClasses(state as { position: string })
            case "tooltip":
                return getTailwindTooltipClasses(state as TooltipState)
            case "popover":
                return getTailwindPopoverClasses(state as PopoverState)
            case "dropdown":
                return getTailwindDropdownClasses(state as DropdownState)
            case "dropdown-item":
                return getTailwindDropdownItemClasses()
            case "sheet":
                return getTailwindSheetClasses(state as SheetState)
            case "sheet-overlay":
                return getTailwindSheetOverlayClasses()
            case "sheet-header":
                return getTailwindSheetHeaderClasses()
            case "sheet-title":
                return getTailwindSheetTitleClasses()
            case "sheet-description":
                return getTailwindSheetDescriptionClasses()
            case "sheet-footer":
                return getTailwindSheetFooterClasses()
            case "sheet-close":
                return getTailwindSheetCloseClasses()
            case "alert":
                return getTailwindAlertClasses(state as AlertState)
            case "alert-title":
                return getTailwindAlertTitleClasses()
            case "alert-description":
                return getTailwindAlertDescriptionClasses()
            case "label":
                return getTailwindLabelClasses()
            // Dialog sub-components
            case "dialog-header":
                return getTailwindDialogHeaderClasses()
            case "dialog-title":
                return getTailwindDialogTitleClasses()
            case "dialog-description":
                return getTailwindDialogDescriptionClasses()
            case "dialog-footer":
                return getTailwindDialogFooterClasses()
            case "dialog-close":
                return getTailwindDialogCloseClasses()
            // Card sub-components
            case "card-header":
                return getTailwindCardHeaderClasses()
            case "card-title":
                return getTailwindCardTitleClasses()
            case "card-description":
                return getTailwindCardDescriptionClasses()
            case "card-content":
                return getTailwindCardContentClasses()
            case "card-footer":
                return getTailwindCardFooterClasses()
            default:
                return ""
        }
    }
}

function getTailwindButtonClasses(state: ButtonState): string {
    const variant_map = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    }

    const size_map = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-lg"
    }

    return cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
        "ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant_map[state.variant],
        size_map[state.size],
        state.disabled && "opacity-50 cursor-not-allowed",
        state.loading && "cursor-wait"
    )
}

function getTailwindInputClasses(state: InputState): string {
    const size_map = {
        sm: "h-9 text-sm",
        md: "h-10",
        lg: "h-11 text-lg"
    }

    return cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size_map[state.size],
        state.error && "border-destructive focus-visible:ring-destructive",
        state.readonly && "bg-muted"
    )
}

function getTailwindCardClasses(state: CardState): string {
    const padding_map = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
    }

    return cn(
        "rounded-lg border border-card-border bg-card text-card-foreground shadow-sm",
        padding_map[state.padding]
    )
}

function getTailwindDialogClasses(state: DialogState): string {
    return cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg",
        "translate-x-[-50%] translate-y-[-50%] gap-4",
        "border bg-background p-6 shadow-lg duration-200",
        "sm:rounded-lg"
    )
}

function getTailwindDialogOverlayClasses(): string {
    return cn(
        "fixed inset-0 z-50 bg-black/80",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    )
}

function getTailwindCheckboxClasses(state: CheckboxState): string {
    return cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        state.checked && "bg-primary text-primary-foreground",
        state.disabled && "opacity-50 cursor-not-allowed"
    )
}

function getTailwindRadioClasses(state: RadioState): string {
    return cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary",
        "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        state.disabled && "opacity-50 cursor-not-allowed"
    )
}

function getTailwindRadioGroupClasses(state: { orientation: string }): string {
    return cn(
        "grid gap-2",
        state.orientation === "horizontal" && "grid-flow-col"
    )
}

function getTailwindRadioIndicatorClasses(): string {
    return cn("flex items-center justify-center")
}

function getTailwindSwitchClasses(state: SwitchState): string {
    return cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        state.checked ? "bg-primary" : "bg-input",
        state.disabled && "opacity-50 cursor-not-allowed"
    )
}

function getTailwindTextareaClasses(state: TextareaState): string {
    const size_map = {
        sm: "min-h-[80px] text-sm",
        md: "min-h-[100px]",
        lg: "min-h-[120px] text-lg"
    }

    return cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size_map[state.size],
        state.error && "border-destructive focus-visible:ring-destructive",
        state.readonly && "bg-muted"
    )
}

function getTailwindSelectClasses(state: SelectState): string {
    const size_map = {
        sm: "h-9 text-sm",
        md: "h-10",
        lg: "h-11 text-lg"
    }

    return cn(
        "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size_map[state.size],
        state.disabled && "opacity-50 cursor-not-allowed"
    )
}

function getTailwindSelectContentClasses(): string {
    return cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    )
}

function getTailwindSelectItemClasses(): string {
    return cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    )
}

function getTailwindSelectValueClasses(state: { hasValue: boolean }): string {
    return cn(
        state.hasValue ? "" : "text-muted-foreground"
    )
}

function getTailwindSelectTriggerIconClasses(): string {
    return cn("h-4 w-4 opacity-50")
}

function getTailwindToastClasses(state: ToastState): string {
    const variant_map = {
        default: "border bg-background text-foreground",
        success: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-50",
        error: "border-destructive bg-destructive/10 text-destructive",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-50",
        info: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50"
    }

    return cn(
        "pointer-events-auto flex items-start gap-4 rounded-lg border p-4 shadow-lg transition-all",
        variant_map[state.variant]
    )
}

function getTailwindToastTitleClasses(): string {
    return cn("text-sm font-semibold")
}

function getTailwindToastDescriptionClasses(): string {
    return cn("text-sm opacity-90")
}

function getTailwindToastActionClasses(): string {
    return cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        "h-8 px-3 ring-offset-background transition-colors",
        "hover:bg-secondary focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2"
    )
}

function getTailwindToastDismissClasses(): string {
    return cn(
        "inline-flex items-center justify-center rounded-md",
        "h-6 w-6 shrink-0 opacity-70 transition-opacity",
        "hover:opacity-100 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring"
    )
}

function getTailwindToasterClasses(state: { position: string }): string {
    const position_map: Record<string, string> = {
        "top-left": "top-0 left-0 flex-col",
        "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col items-center",
        "top-right": "top-0 right-0 flex-col items-end",
        "bottom-left": "bottom-0 left-0 flex-col-reverse",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse items-center",
        "bottom-right": "bottom-0 right-0 flex-col-reverse items-end"
    }

    return cn(
        "fixed z-[100] flex pointer-events-none p-4",
        position_map[state.position] ?? position_map["bottom-right"]
    )
}

function getTailwindTooltipClasses(state: TooltipState): string {
    return cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
    )
}

function getTailwindPopoverClasses(state: PopoverState): string {
    return cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
    )
}

function getTailwindDropdownClasses(state: DropdownState): string {
    return cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
    )
}

function getTailwindDropdownItemClasses(): string {
    return cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    )
}

function getTailwindSheetClasses(state: SheetState): string {
    const side_map = {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
    }

    return cn(
        "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
        side_map[state.side]
    )
}

function getTailwindSheetOverlayClasses(): string {
    return cn(
        "fixed inset-0 z-50 bg-black/80",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    )
}

function getTailwindSheetHeaderClasses(): string {
    return cn("flex flex-col space-y-2 text-center sm:text-left")
}

function getTailwindSheetTitleClasses(): string {
    return cn("text-lg font-semibold text-foreground")
}

function getTailwindSheetDescriptionClasses(): string {
    return cn("text-sm text-muted-foreground")
}

function getTailwindSheetFooterClasses(): string {
    return cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2")
}

function getTailwindSheetCloseClasses(): string {
    return cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
        "transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    )
}

function getTailwindAlertClasses(state: AlertState): string {
    const variant_map = {
        default: "bg-background text-foreground",
        info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600",
        success: "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600",
        destructive: "border-destructive/50 text-destructive bg-destructive/10 [&>svg]:text-destructive"
    }

    return cn(
        "relative w-full rounded-lg border p-4",
        "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variant_map[state.variant]
    )
}

function getTailwindLabelClasses(): string {
    return cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    )
}

// Dialog sub-component helpers
function getTailwindDialogHeaderClasses(): string {
    return cn("flex flex-col space-y-1.5 text-center sm:text-left")
}

function getTailwindDialogTitleClasses(): string {
    return cn("text-lg font-semibold leading-none tracking-tight")
}

function getTailwindDialogDescriptionClasses(): string {
    return cn("text-sm text-muted-foreground")
}

function getTailwindDialogFooterClasses(): string {
    return cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2")
}

function getTailwindDialogCloseClasses(): string {
    return cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
        "transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none"
    )
}

// Alert sub-component helpers
function getTailwindAlertTitleClasses(): string {
    return cn("mb-1 font-medium leading-none tracking-tight")
}

function getTailwindAlertDescriptionClasses(): string {
    return cn("text-sm [&_p]:leading-relaxed")
}

// Card sub-component helpers
function getTailwindCardHeaderClasses(): string {
    return cn("flex flex-col space-y-1.5 p-6")
}

function getTailwindCardTitleClasses(): string {
    return cn("text-2xl font-semibold leading-none tracking-tight")
}

function getTailwindCardDescriptionClasses(): string {
    return cn("text-sm text-muted-foreground")
}

function getTailwindCardContentClasses(): string {
    return cn("p-6 pt-0")
}

function getTailwindCardFooterClasses(): string {
    return cn("flex items-center p-6 pt-0")
}
