import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import InputAutocomplete from "./InputAutocomplete";
import { AutocompleteOption } from "./InputAutocomplete.types";

test("prop: options - lists matching options", async () => {
  const options: AutocompleteOption[] = [
    { label: "AAA" },
    { label: "AAB" },
    { label: "AAC" },
    { label: "ABA" },
    { label: "ABB" },
    { label: "ABC" },
  ];
  render(<InputAutocomplete options={options} />);

  userEvent.type(screen.getByTestId("input"), "AA");
  await screen.findByTestId("list");

  expect((await screen.findByTestId("list")).childElementCount === 3);

  const { queryByText } = within(screen.getByTestId("list"));
  expect(queryByText("AAA")).toBeInTheDocument();
  expect(queryByText("AAB")).toBeInTheDocument();
  expect(queryByText("AAC")).toBeInTheDocument();
  expect(queryByText("ABA")).not.toBeInTheDocument();
  expect(queryByText("ABB")).not.toBeInTheDocument();
  expect(queryByText("ABC")).not.toBeInTheDocument();
});

test("prop: minCharacterCount - minimum character count is adhered to", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete options={options} minCharacterCount={4} />
  );
  userEvent.type(screen.getByTestId("input"), "ABC");
  expect(queryByTestId("list")).toBeNull();

  userEvent.type(screen.getByTestId("input"), "ABCD");
  expect(queryByTestId("list")).toBeInTheDocument();
});

test("prop: loading - loading element is displayed", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      loading={true}
      classes={["testClass1", "testClass2"]}
    />
  );

  userEvent.type(screen.getByTestId("input"), "ABCDE");
  expect(queryByTestId("list")).toBeInTheDocument();
  expect(queryByTestId("list")?.firstChild).toHaveClass(
    "inputAutocomplete-list-element-loading",
    "testClass1-list-element-loading",
    "testClass2-list-element-loading"
  );
});

test("prop: errorlist(boolean) - error element is displayed", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      errorList={true}
      classes={["testClass1", "testClass2"]}
    />
  );
  userEvent.type(screen.getByTestId("input"), "ABCDE");
  expect(queryByTestId("list")).toBeInTheDocument();
  expect(queryByTestId("list")?.firstChild).toHaveClass(
    "inputAutocomplete-list-element-error",
    "testClass1-list-element-error",
    "testClass2-list-element-error"
  );
  expect(screen.queryByText("error", { exact: false })).toBeInTheDocument();
});

test("prop: errorlist(string) - error element is displayed with passed text", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      errorList={"test error"}
      classes={["testClass1", "testClass2"]}
    />
  );
  userEvent.type(screen.getByTestId("input"), "ABCDE");
  expect(queryByTestId("list")).toBeInTheDocument();
  expect(queryByTestId("list")?.firstChild).toHaveClass(
    "inputAutocomplete-list-element-error",
    "testClass1-list-element-error",
    "testClass2-list-element-error"
  );
  expect(screen.queryByText("test error")).toBeInTheDocument();
});

test("prop: errorInput - correct classnames are added to input", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      errorInput={true}
      classes={["testClass1", "testClass2"]}
    />
  );
  expect(queryByTestId("input")).toHaveClass(
    "inputAutocomplete-input-error",
    "testClass1-input-error",
    "testClass2-input-error"
  );
});

test("prop: id - id is added to the main element", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const component = render(
    <InputAutocomplete options={options} id={"test_id"} />
  );
  expect(component.container.querySelector("div")?.id).toBe("test_id");
});

test("prop: classes - classes are added the the elements", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      classes={["testClass1", "testClass2"]}
    />
  );

  userEvent.type(screen.getByTestId("input"), "ABCDE");

  expect(queryByTestId("input")).toHaveClass(
    "testClass1-input",
    "testClass2-input"
  );

  expect(queryByTestId("list")).toHaveClass(
    "testClass1-list",
    "testClass2-list"
  );
  expect(queryByTestId("list")?.firstChild).toHaveClass(
    "testClass1-list-element",
    "testClass2-list-element"
  );
});

test("prop: placeholder - added to input element", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      classes={["testClass1", "testClass2"]}
      placeholder="placeholder test"
    />
  );
  expect(queryByTestId("input")).toHaveAttribute(
    "placeholder",
    "placeholder test"
  );
});

test("prop: sortMethod - correctly sorts the matching options", async () => {
  const options: AutocompleteOption[] = [
    { label: "a" },
    { label: "b" },
    { label: "c" },
    { label: "test_3" },
    { label: "test_1" },
    { label: "test_2" },
    { label: "test_b" },
    { label: "test_a" },
  ];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      sortMethod={(a, b) => a.label.localeCompare(b.label)}
    />
  );

  userEvent.type(screen.getByTestId("input"), "test");
  expect(queryByTestId("list")?.children[0].textContent).toContain("test_1");
  expect(queryByTestId("list")?.children[1].textContent).toContain("test_2");
  expect(queryByTestId("list")?.children[2].textContent).toContain("test_3");
  expect(queryByTestId("list")?.children[3].textContent).toContain("test_a");
  expect(queryByTestId("list")?.children[4].textContent).toContain("test_b");
});

test("internal: no results is displayed in list if there is no match", async () => {
  const options: AutocompleteOption[] = [{ label: "ABCDE" }];
  const { queryByTestId } = render(
    <InputAutocomplete
      options={options}
      classes={["testClass1", "testClass2"]}
    />
  );
  userEvent.type(screen.getByTestId("input"), "ABCDEFG");
  expect(queryByTestId("list")).toBeInTheDocument();
  expect(queryByTestId("list")?.firstChild).toHaveClass(
    "inputAutocomplete-list-element-noResults"
  );
  expect(
    screen.queryByText("no results", { exact: false })
  ).toBeInTheDocument();
});
