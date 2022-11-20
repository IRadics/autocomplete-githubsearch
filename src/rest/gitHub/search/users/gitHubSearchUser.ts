import mergeResponses from "../../../functions/mergeResponses";
import {
  GitHubSearchPaginationSettings,
  IntRange,
} from "../gitHubSearch.types";
import {
  GitHubSearchOrderUser,
  GitHubSearchQualifiersUser,
  GitHubSearchSortUser,
  UserSearchResult,
} from "./gitHubSearchUser.types";
/**
 * Searches GitHub users
 * @param query - search term (limit: 256 characters) OR / AND / NOT can be used (limit: 5)
 * @param qualifiers - collection of available qualifiers to further tighten the search results
 * @param sort - sort by. Leave empty for "best-match" agorithm
 * @param order - sorting order
 * @param pagination - pagination settings
 * @param callbackSuccess - function to call if the data fetch was successful
 * @param callbackError - function to call if the data fetch resulted in an error
 * @returns promise of search results
 */
async function gitHubSearchUser(
  query: string,
  qualifiers?: GitHubSearchQualifiersUser,
  sort?: GitHubSearchSortUser,
  order?: GitHubSearchOrderUser,
  pagination?: GitHubSearchPaginationSettings,
  callbackSuccess?: (result: UserSearchResult) => void,
  callbackError?: (error: string) => void
): Promise<UserSearchResult> {
  const query_max_results = 1000;
  const query_max_lenght = 256;
  const query_operator_limit = 5;
  const per_page_default = 30;
  const endPoint = "https://api.github.com/search/users";

  //Parameter validations
  if (query.length > query_max_lenght)
    throw new Error("Query can only be 256 characters long");
  if (
    query.split(new RegExp("AND|OR|NOT", "g")).length >
    query_operator_limit + 1
  )
    throw new Error("OR / AND / NOT can be used only 5 times");

  if (pagination) {
    var { per_page, page, fetchMultiplePages } = pagination;
    if (page) page = Math.floor(page);
    if (fetchMultiplePages) fetchMultiplePages = Math.floor(fetchMultiplePages);
  }

  const per_page_validation = per_page || per_page_default;
  const fetchMultiplePages_validation = fetchMultiplePages || 1;
  const page_validation = page || 1;

  //warn if query will hit the query result limit
  if (
    per_page_validation * page_validation > query_max_results ||
    per_page_validation * fetchMultiplePages_validation > query_max_results ||
    per_page_validation *
      (fetchMultiplePages_validation - 1 + page_validation) >
      query_max_results
  ) {
    console.warn(
      "Warning: GitHub search only allows up to fetch the first 1000 results. Results will be returned accordingly"
    );
  }

  let data: UserSearchResult = {} as UserSearchResult;

  const constructQueryUrl = (): string => {
    let queryString = endPoint + "?q=" + encodeURIComponent(query);

    Object.entries(qualifiers as Object).forEach((entry) => {
      const [key, value] = entry;
      if (typeof value === "boolean" && value) {
        queryString = queryString + `+${key}`;
      } else {
        if (value) {
          queryString = queryString + `+${key}:${value}`;
        }
      }
    });
    if (sort) queryString = queryString + `&sort=${sort}`;
    if (order) queryString = queryString + `&order=${order}`;
    if (per_page)
      queryString = queryString + `&per_page=${Math.floor(per_page)}`;
    if (page) queryString = queryString + `&page=${Math.floor(page)}`;

    return queryString;
  };
  const fetchQuery = async (url: string) => {
    let endQuery = false;
    do {
      await fetch(url, {
        method: "GET",
        cache: "force-cache",
        headers: {
          accept: "application/vnd.github+json",
          Authorization: process.env.REACT_APP_GITHUB_TOKEN
            ? "Bearer " + process.env.REACT_APP_GITHUB_TOKEN
            : "",
        },
      })
        .catch((reason) => {
          if (callbackError) callbackError(reason);
          throw new Error(reason);
        })
        .then((response) => {
          if (!response.ok) {
            return response
              .json()
              .catch(() => {
                if (callbackError) callbackError(response.status.toString());
                throw new Error(response.status.toString());
              })
              .then(({ message }) => {
                if (callbackError)
                  callbackError(message || response.status.toString());
                throw new Error(message || response.status.toString());
              });
          }
          return response.json();
        })
        .then((responseData) => {
          if (responseData)
            data = mergeResponses(data, responseData, [
              "items",
            ]) as UserSearchResult;

          //if the query hit exactly the max results limit, end the query
          if (page && per_page * page === query_max_results) {
            if (callbackSuccess) callbackSuccess(data);
            endQuery = true;
          }

          //if multiple pages are requested and there are more results available
          if (
            fetchMultiplePages &&
            fetchMultiplePages > 1 &&
            data.total_count > data.items.length
          ) {
            //reduce the nr of  pages we need to fetch and increase the page nr
            fetchMultiplePages--;
            page ? page++ : (page = 2);

            //if next page would be over the max result limit, modify the query to only fetch the possible remaining
            if (per_page * page > query_max_results) {
              const remaining = per_page * page - query_max_results;
              per_page = remaining as IntRange<1, 101>;
              page = query_max_results / remaining;
            }

            //recontruct the URL
            url = constructQueryUrl();
          } else {
            //execute callbackSucess and exit loop
            if (callbackSuccess) callbackSuccess(data);
            endQuery = true;
          }
        });
    } while (!endQuery);
  };
  await fetchQuery(constructQueryUrl());
  return data;
}

export default gitHubSearchUser;
