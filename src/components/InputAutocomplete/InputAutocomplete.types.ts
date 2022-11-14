/**
 * @param label: the displayed label of the option
 * @param labelSecondary: the displayed secondary label of the option
 * @param onSelect: function to execute when clicking on the option
 * @param key: any custom (preferably unique) identifier
 */
export type AutocompleteOption = {
  label: string;
  labelSecondary?: string;
  onSelect?: (option: AutocompleteOption) => void;
  key?: string;
};
