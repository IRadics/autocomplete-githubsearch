//src: https://stackoverflow.com/a/70307091/19653844
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export type GitHubSearchPaginationSettings = {
  /** Results per page. Max 100 */
  per_page: IntRange<1, 101>;
  /** Page number */
  page?: number;
  /** if provided, multiple number of pages will be fetched and merged*/
  fetchMultiplePages?: number;
};
