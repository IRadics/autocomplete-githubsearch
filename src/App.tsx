import "./App.css";

import { useState } from "react";
import InputAutocomplete from "./components/InputAutocomplete/InputAutocomplete";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  return (
    <div className={"App" + (darkMode ? " App-darkmode" : " App-lightmode")}>
      <div
        style={{
          width: "100%",
          margin: "auto",
          textAlign: "center",
          paddingTop: "1em",
        }}
      >
        <button
          className="darkModeSwitch"
          onClick={() => setDarkMode(!darkMode)}
        >
          Dark / light mode
        </button>
        <InputAutocomplete
          placeholder="Countries"
          loading={false}
          darkMode={darkMode}
          sortMethod={(a, b) =>
            a.labelSecondary?.localeCompare(b.labelSecondary || "")! ||
            a.label.localeCompare(b.label)
          }
          options={[
            { label: "Hungary" },
            { label: "Austria" },
            { label: "UK", labelSecondary: "Non-EU" },
            { label: "Germany", labelSecondary: "EU" },
            { label: "Romania", labelSecondary: "EU" },
            { label: "Poland", labelSecondary: "EU" },
            { label: "Serbia", labelSecondary: "Non-EU" },
            { label: "Slovenia", labelSecondary: "EU" },
            { label: "Slovakia", labelSecondary: "EU" },
            { label: "Croatia", labelSecondary: "EU" },
            {
              label:
                "Very loooooooooooooooooooooooooooooooooooooooong country name",
              labelSecondary: "EU",
            },
          ]}
        ></InputAutocomplete>
      </div>
    </div>
  );
}

export default App;
