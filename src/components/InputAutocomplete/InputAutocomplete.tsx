import { AutocompleteOption } from "./InputAutocomplete.types";
import "./InputAutocomplete.css";
import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import { default as BCN } from "../../functions/buildClassNames";

/**
 * Input field with an autocomplete functionality which lists all the matching options based on the input provided
 * @property options - array of options for the autocomplete function
 * @property classes - array of custom classes to be passed to the component
 * @property id - CSS id passed to the component
 * @property placeholder - placeholder text for the input element
 * @property loading - if true, the the list will contain a loading animation element. Useful if you are dynamically fetching the options list.
 * @property errorInput - if true, the -input-error styling will be applied to the input element
 * @property errorList - if true, autocomplete list will show "Error". This message is overwritten if you define a string instead of bool.
 * @property sortMethod - a function to be applied for shorting the matched options
 * @property onInputChange - triggered when the input changes
 * @property onSelect - the function to run when an item is selected from the list.
 * @property darkMode - if true, dark mode CSS class(es) is applied (-styleLight / -styleDark)
 * @property minCharacterCount - defines the minimum characters to type to open the autocomplete list
 * - default: the input field is filled by the selected option.
 * - note: Separate onSelect function provided for the selected option overwrites this behaviour.
 */
const InputAutocomplete: React.FC<{
  options: AutocompleteOption[];
  classes?: string[];
  id?: string;
  placeholder?: string;
  loading?: boolean;
  errorInput?: boolean;
  errorList?: string | boolean;
  sortMethod?: (a: AutocompleteOption, b: AutocompleteOption) => number;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (selectedOption: AutocompleteOption) => void;
  darkMode?: boolean;
  minCharacterCount?: number;
}> = ({
  options,
  placeholder,
  loading,
  errorInput,
  errorList,
  classes = [],
  id,
  sortMethod,
  onInputChange,
  onSelect,
  darkMode,
  minCharacterCount,
}) => {
  const [listOpen, setListOpen] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");
  const baseClass = "inputAutocomplete";
  const refComponent = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (sortMethod) {
      return options
        .filter(
          (o) =>
            o.label.slice(0, input.length).toLowerCase() === input.toLowerCase()
        )
        .sort(sortMethod);
    } else {
      return options.filter(
        (o) =>
          o.label.slice(0, input.length).toLowerCase() === input.toLowerCase()
      );
    }
  }, [input, options, sortMethod]);

  const onSelectDefault = (option: AutocompleteOption) => {
    setInput(option.label);
  };

  const onSelectHandler = useCallback(
    (option: AutocompleteOption) => {
      if (option.onSelect) {
        option.onSelect(option);
      } else {
        if (onSelect) {
          onSelect(option);
        } else {
          onSelectDefault(option);
        }
      }
      setListOpen(false);
    },
    [onSelect]
  );

  const autocompleteList = useMemo(() => {
    const listWrapper = (child: React.ReactNode) => (
      <div
        data-testid="list"
        className={BCN("-list", [baseClass, ...classes])}
        style={{ top: refComponent.current?.offsetHeight.valueOf() }}
      >
        {child}
      </div>
    );

    if (loading || errorList || filteredOptions.length === 0) {
      let postfix = "";
      let text = "";
      switch (true) {
        case (typeof errorList === "boolean" && errorList) ||
          (typeof errorList === "string" && errorList.length > 0):
          postfix = "-list-element-error";

          if (typeof errorList === "string") {
            text = errorList;
          } else {
            text = "Error";
          }

          break;
        case loading:
          postfix = "-list-element-loading";
          break;
        case filteredOptions.length === 0:
          postfix = "-list-element-noResults";
          text = "No results";
          break;
      }

      return listWrapper(
        <div
          className={BCN(postfix, [baseClass, ...classes])}
          style={{ top: refComponent.current?.offsetHeight.valueOf() }}
        >
          {text}
        </div>
      );
    } else {
      return listWrapper(
        filteredOptions.map((o) => (
          <div
            autocomplete-key={o.key || o.label}
            onMouseDown={(e) => {
              //onMouseDown instead of onClick to execute before onBlur unfocus
              e.stopPropagation();
              onSelectHandler(o);
            }}
            key={o.key || o.label}
            className={BCN("-list-element", [baseClass, ...classes])}
          >
            <span
              className={BCN("-list-element-label", [baseClass, ...classes])}
            >
              {o.label}
            </span>
            <span
              className={BCN("-list-element-labelSecondary", [
                baseClass,
                ...classes,
              ])}
            >
              {o.labelSecondary}
            </span>
          </div>
        ))
      );
    }
  }, [loading, errorList, filteredOptions, onSelectHandler, classes]);

  return (
    <div
      data-testid="main"
      ref={refComponent}
      className={
        BCN("", [baseClass, ...classes]) +
        (darkMode
          ? " inputAutocomplete-styleDark"
          : " inputAutocomplete-styleLight")
      }
      id={id}
      onBlur={() => setListOpen(false)}
    >
      <input
        data-testid="input"
        className={
          BCN("-input", [baseClass, ...classes]) +
          (errorInput ? BCN("-input-error", [baseClass, ...classes]) : "")
        }
        placeholder={placeholder}
        onChange={(e) => {
          setInput(e.currentTarget.value);

          if (onInputChange) onInputChange(e);

          if (minCharacterCount) {
            if (e.currentTarget.value.length >= minCharacterCount) {
              setListOpen(true);
            } else {
              setListOpen(false);
            }
          } else {
            setListOpen(true);
          }
        }}
        value={input}
      ></input>
      {listOpen && autocompleteList}
    </div>
  );
};

export default InputAutocomplete;
