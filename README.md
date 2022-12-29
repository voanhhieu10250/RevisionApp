## Start

Before you start the application, make sure you have compiled all the typescript files.

When you're working on the server (electron), you need to compile the typescript every time you make a change:

Run `tsc` and then run `yarn start` to start the Electron application.

When you're working on the client (solidjs), you just need to run `yarn start`, Vite will automatically update the app client when everytime the client's code changes.

## Build and Publish

1. `yarn build`

2. `yarn make`

3. compile the package with Inno Setup Compiler (using the setup-script.iss file)

4. go to Github and create a new release

## Todo:

- Use fast-xml-parser for parsing html when crawling Quizlets
- Use showdown for the card's body. So that user can decide the size of the text
