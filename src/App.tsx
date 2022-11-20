import "./App.css";

import { useState } from "react";
import InputGitHubSearch from "./components/InputGitHubSearch/InputGitHubSearch";

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
        <InputGitHubSearch
          darkMode={darkMode}
          placeholder="Search GitHub user or repository"
        />
      </div>
    </div>
  );
}

export default App;
