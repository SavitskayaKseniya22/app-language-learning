import type {
    ClassNamesConfig,
    ClearIndicatorProps,
    DropdownIndicatorProps,
    GroupBase,
    OptionProps,
    Props as ReactSelectProperties,
    SelectInstance,
} from "react-select";
import { components } from "react-select";
import Select from "react-select";
import clsx from "clsx";
import { forwardRef, type JSX, type ReactNode, type Ref } from "react";

import styles from "./select.module.scss";

type SelectSize = "medium" | "small";

export type OptionType<T, OD = undefined> = {
    value: T;
    label: string;
    optionData?: OD;
    labelElement?: ReactNode;
};

export type CustomSelectProperties<T, OD = undefined> = Omit<
    ReactSelectProperties<OptionType<T, OD>, false, GroupBase<OptionType<T, OD>>>,
    "unstyled" | "classNames" | "components"
> & {
    size?: SelectSize;
    isError?: boolean;
    label?: ReactNode;
    errorText?: string;
};

function getClassNames<T, OD>(
    size: SelectSize,
): ClassNamesConfig<OptionType<T, OD>, false, GroupBase<OptionType<T, OD>>> {
    return {
        control: ({ isDisabled, isFocused }) =>
            clsx(
                styles.select__control,
                size === "small" ? styles.select__control_small : styles.select__control_medium,
                {
                    [styles["select__control--disabled"]]: isDisabled,
                    [styles["select__control--focused"]]: isFocused,
                },
            ),

        menu: () => styles.select__menu,
        menuList: () => styles.select__menulist,
        placeholder: () => styles.select__placeholder,
        indicatorsContainer: () => styles.select__indicators,
        indicatorSeparator: () => styles.select__separator,
        loadingMessage: () => styles.select__message,
        noOptionsMessage: () => styles.select__message,
        container: () => styles.select__container,
    };
}

function DropdownIndicator<T, OD>(
    properties: DropdownIndicatorProps<OptionType<T, OD>, false, GroupBase<OptionType<T, OD>>>,
) {
    return (
        <components.DropdownIndicator {...properties}>
            <i
                className="fa-solid fa-chevron-up"
                style={{
                    transition: "transform 0.25s ease",
                    transform: properties.selectProps.menuIsOpen ? "rotate(0deg)" : "rotate(180deg)",
                }}
            />
        </components.DropdownIndicator>
    );
}

function Option<T, OD>(properties: OptionProps<OptionType<T, OD>, false, GroupBase<OptionType<T, OD>>>) {
    const { data, isSelected } = properties;

    return (
        <components.Option {...properties}>
            <div className={styles.option}>
                {data.labelElement ?? <p className={styles.option__text}>{data.label}</p>}
                {properties.isSelected && (
                    <i className={clsx("fa-solid", "fa-check", { [styles["option__icon--selected"]]: isSelected })} />
                )}
            </div>
        </components.Option>
    );
}

function ClearIndicator<T, OD>(
    properties: ClearIndicatorProps<OptionType<T, OD>, false, GroupBase<OptionType<T, OD>>>,
) {
    return (
        <components.ClearIndicator {...properties}>
            <i className="fa-solid fa-xmark" />
        </components.ClearIndicator>
    );
}

function CustomSelectInner<T, OD = undefined>(
    {
        className,
        label,
        errorText,
        isError = false,
        size = "medium",
        placeholder = "Choose an option",
        noOptionsMessage,
        ...selectProperties
    }: CustomSelectProperties<T, OD>,
    reference: Ref<SelectInstance<OptionType<T, OD>, false>>,
) {
    return (
        <div className={clsx(styles.select, className)}>
            {label && <div className={styles.select__label}>{label}</div>}

            <Select<OptionType<T, OD>, false>
                {...selectProperties}
                ref={reference}
                unstyled
                menuPosition="fixed"
                classNames={getClassNames<T, OD>(size)}
                components={{
                    Option,
                    DropdownIndicator,
                    ClearIndicator,
                }}
                loadingMessage={() => "Loading"}
                placeholder={placeholder}
                noOptionsMessage={noOptionsMessage ?? (() => (isError ? "Something happened" : "No match"))}
            />

            {errorText && <p className={styles.select__error}>{errorText}</p>}
        </div>
    );
}

export const CustomSelect = forwardRef(CustomSelectInner) as <T, OD = undefined>(
    properties: CustomSelectProperties<T, OD> & {
        ref?: Ref<SelectInstance<OptionType<T, OD>, false>>;
    },
) => JSX.Element;
