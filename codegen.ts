import { CodegenConfig } from "@graphql-codegen/cli";

import * as dotenv from "dotenv";
dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  config: {
    withResultType: true,
  },
  schema: [
    {
      "https://api.github.com/graphql": {
        headers: {
          Authorization: process.env.REACT_APP_GITHUB_TOKEN_CLASSIC
            ? "bearer " + process.env.REACT_APP_GITHUB_TOKEN_CLASSIC
            : "",
        },
      },
    },
  ],

  documents: "src/graphql/**/*.graphql",
  generates: {
    "./src/graphql/generated-types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
  debug: false,
  verbose: false,
};

export default config;
