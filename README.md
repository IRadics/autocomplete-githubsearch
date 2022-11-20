### Autcomplete input component with GitHub user and repository search functionality using GitHub GraphQL API - created as a coding challenge for interview

React TypeScript application (via Create React App)

Additional library used for the project:
* [lodash](https://lodash.com/)
* [Apollo GraphQL](https://www.apollographql.com/docs/react/)
* [GraphQL code generator](https://www.the-guild.dev/graphql/codegen)
* [npm-run-all](https://www.npmjs.com/package/npm-run-all)

| Environment Variable   	| Description                                                                                                                                                                                                                 	|
|------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| REACT_APP_GITHUB_TOKEN 	| GitHub access token. Not required, but recommended as it increases the rate limit from 10 requests per minute to 30 requests. Also recommended to create the new [Fine-grained Personal Access token](https://github.com/settings/tokens?type=beta) for better security 	|
|REACT_APP_GITHUB_TOKEN_CLASSIC | GitHub access token. **Required for GraphQL API**. Only [Classic Access token](https://github.com/settings/tokens) works with a minimum of "read:org" scope setting.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
