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

type Year = `${bigint}${bigint}${bigint}${bigint}`;
type Month = `${bigint}${bigint}`;
type Day = `${bigint}${bigint}`;
type Hour = `${bigint}${bigint}`;
type Minute = `${bigint}${bigint}`;
type Second = `${bigint}${bigint}`;
type UtcOffset = `+${bigint}${bigint}:${bigint}${bigint}` | "Z";
type ShortDate = `${Year}-${Month}-${Day}`;
type LongDate =
  `${Year}-${Month}-${Day}T${Hour}:${Minute}:${Second}${UtcOffset}`;

type GitHubSearchOperatorsComparator = ">" | "<" | "<=" | ">=";
type GitHubSearchOperatorsRange = "..";

type GitHubSearchParamWithOperator<T extends ShortDate | LongDate | bigint> =
  | `${GitHubSearchOperatorsComparator}${T}`
  | `${T}${GitHubSearchOperatorsRange}${T}`
  | `${T}${GitHubSearchOperatorsRange}`;

export type GitHubSearchNumberParam =
  | GitHubSearchParamWithOperator<bigint>
  | `${bigint}`
  | number;
export type GitHubSearchDateParam =
  | GitHubSearchParamWithOperator<ShortDate>
  | GitHubSearchParamWithOperator<LongDate>
  | ShortDate
  | LongDate;
