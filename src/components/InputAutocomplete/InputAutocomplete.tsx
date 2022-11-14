import { AutocompleteOption } from "./InputAutocomplete.types";
import "./InputAutocomplete.css";
import { useId, useMemo, useRef, useState } from "react";
import { default as BCN } from "../../functions/buildClassNames";

/**
 * Input field with an autocomplete functionality which lists all the matching options based on the input provided
 * @property options - array of options for the autocomplete function
 * @property classes - array of custom classes to be passed to the component
 * @property placeholder - placeholder text for the input element
 * @property loading - when true, the the list will contain a loading animation element. Useful if you are dynamically fetching the options list.
 * @property sortMethod - a function to be applied for shorting the matched options
 * @property onInputChange - triggered when the input changes
 * @property onSelect - the function to run when an item is selected from the list.
 * - default: the input field is filled by the selected option.
 * - note: Separate onSelect function provided for the selected option overwrites this behaviour.
 */
const InputAutocomplete: React.FC<{
  options: AutocompleteOption[];
  classes?: string[];
  placeholder?: string;
  loading?: boolean;
  sortMethod?: (a: AutocompleteOption, b: AutocompleteOption) => number;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (selectedOption: AutocompleteOption) => void;
  darkMode?: boolean;
}> = ({
  options,
  placeholder,
  loading,
  classes = [],
  sortMethod,
  onInputChange,
  onSelect,
  darkMode,
}) => {
  const [listOpen, setListOpen] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");
  const id = "InputAutocomplete" + useId();

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

  const onSelectHandler = (option: AutocompleteOption) => {
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
  };

  return (
    <div
      ref={refComponent}
      className={
        BCN("", ["inputAutocomplete", ...classes]) +
        (darkMode
          ? " inputAutocomplete-styleDark"
          : " inputAutocomplete-styleLight")
      }
      id={id}
      onBlur={() => setListOpen(false)}
    >
      <input
        className={BCN("-input", ["inputAutocomplete", ...classes])}
        placeholder={placeholder}
        onChange={(e) => {
          setInput(e.currentTarget.value);

          if (onInputChange) onInputChange(e);
          setListOpen(true);
        }}
        value={input}
      ></input>
      {listOpen && (
        <div
          className={BCN("-list", ["inputAutocomplete", ...classes])}
          style={{ top: refComponent.current?.offsetHeight.valueOf() }}
        >
          {loading && (
            <div
              className={BCN("-list-element-loading", [
                "inputAutocomplete",
                ...classes,
              ])}
            ></div>
          )}
          {!loading &&
            filteredOptions.map((o) => (
              <div
                autocomplete-key={o.key || o.label}
                onMouseDown={(e) => {
                  //onMouseDown instead of onClick to execute before onBlur unfocus
                  e.stopPropagation();
                  onSelectHandler(o);
                }}
                key={o.key || o.label}
                className={BCN("-list-element", [
                  "inputAutocomplete",
                  ...classes,
                ])}
              >
                <span
                  className={BCN("-list-element-label", [
                    "inputAutocomplete",
                    ...classes,
                  ])}
                >
                  {o.label}
                </span>
                <span
                  className={BCN("-list-element-labelSecondary", [
                    "inputAutocomplete",
                    ...classes,
                  ])}
                >
                  {o.labelSecondary}
                </span>
              </div>
            ))}
          {!loading && filteredOptions.length === 0 && (
            <div
              className={BCN("-list-element-noResults", [
                "inputAutocomplete",
                ...classes,
              ])}
            >
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputAutocomplete;
