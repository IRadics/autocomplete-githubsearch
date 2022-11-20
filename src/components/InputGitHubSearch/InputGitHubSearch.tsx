import { useRef, useState } from "react";
import gitHubSearchRepository from "../../rest/gitHub/search/repository/gitHubSearchRepository";
import gitHubSearchUser from "../../rest/gitHub/search/users/gitHubSearchUser";
import InputAutocomplete from "../InputAutocomplete/InputAutocomplete";
import { AutocompleteOption } from "../InputAutocomplete/InputAutocomplete.types";
const InputGitHubSearch: React.FC<{
  classes?: string[];
  id?: string;
  placeholder?: string;
  darkMode?: boolean;
}> = ({ classes, id, placeholder, darkMode }) => {
  const searchDelay = 1500;
  const minCharacterCount = 3;

  const searchInput = useRef<string>();
  const timeoutHandler = useRef<NodeJS.Timeout>();
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const search = async (query: string) => {
    const userSearch = gitHubSearchUser(query, { "in:login": true }, "", "", {
      per_page: 50,
    });
    const repoSearch = gitHubSearchRepository(
      query,
      { "in:name": true, fork: false, "is:public": true, archived: false },
      "",
      "",
      { per_page: 50 }
    );
    await Promise.all([userSearch, repoSearch])

      .then((values) => {
        //check if the input is still the same
        if (query === searchInput.current) {
          const [userResults, repoResults] = values;
          let options: AutocompleteOption[] = [];

          userResults.items.forEach((user) => {
            options.push({
              label: user.login,
              labelSecondary: user.type,
              key: user.html_url,
            });
          });
          repoResults.items.forEach((repo) => {
            options.push({
              label: repo.name,
              labelSecondary: repo.full_name,
              key: repo.html_url,
            });
          });

          setIsLoading(false);
          setOptions(options);
        }
      })
      .catch(() => {
        setHasError(true);
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    if (timeoutHandler.current) {
      clearTimeout(timeoutHandler.current);
    }
    if (event.target.value.length >= minCharacterCount) {
      setIsLoading(true);
      searchInput.current = event.target.value;
      timeoutHandler.current = setTimeout(() => {
        search(event.target.value);
      }, searchDelay);
    } else {
      setIsLoading(false);
    }

    setOptions([]);
  };

  return (
    <InputAutocomplete
      maxListedSuggestions={50}
      errorList={hasError ? "Error fetching GitHub data" : ""}
      onSelect={(o) => {
        window.open(o.key, "_blank");
      }}
      minCharacterCount={minCharacterCount}
      options={options}
      onInputChange={handleInputChange}
      darkMode={darkMode}
      placeholder={placeholder}
      id={id}
      classes={classes}
      loading={isLoading}
      sortMethod={(a, b) => {
        return a.label.localeCompare(b.label);
      }}
    />
  );
};

export default InputGitHubSearch;
