import { useRef, useState } from "react";
import {
  OrganizationMinFragment,
  RespositoryMinFragment,
  UserMinFragment,
  useSearchProfilesLazyQuery,
  useSearchRepositoryLazyQuery,
} from "../../graphql/generated-types";
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

  const [
    searchProfiles,
    { loading: loadingSearchProfiles, error: errorSearchProfiles },
  ] = useSearchProfilesLazyQuery();
  const [
    searchRepositories,
    { loading: loadingSearchRepository, error: errorSearchRepository },
  ] = useSearchRepositoryLazyQuery();

  const search = async (query: string) => {
    const userSearch = searchProfiles({
      variables: { query: query, first: 50 },
      fetchPolicy: "cache-first",
    });
    const repoSearch = searchRepositories({
      variables: { query: query, first: 50 },
      fetchPolicy: "cache-first",
    });

    await Promise.all([userSearch, repoSearch]).then((values) => {
      //check if the input is still the same
      if (
        values[0].variables?.query === searchInput.current &&
        values[1].variables?.query === searchInput.current
      ) {
        setIsLoading(false);
        const userResults = values[0].data?.search.nodes as UserMinFragment[] &
          OrganizationMinFragment[];
        const repoResults = values[1].data?.search
          .nodes as RespositoryMinFragment[];

        let options: AutocompleteOption[] = [];

        userResults.forEach((user) => {
          options.push({
            label: user.login,
            labelSecondary: user.__typename,
            key: user.url,
          });
        });
        repoResults.forEach((repo) => {
          options.push({
            label: repo.name,
            labelSecondary: repo.nameWithOwner,
            key: repo.url,
          });
        });

        setOptions(options);
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      errorList={
        errorSearchProfiles || errorSearchRepository
          ? "Error fetching GitHub data"
          : ""
      }
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
      loading={loadingSearchProfiles || loadingSearchRepository || isLoading}
      sortMethod={(a, b) => {
        return a.label.localeCompare(b.label);
      }}
    />
  );
};

export default InputGitHubSearch;
