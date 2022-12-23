## Todo:

- Use fast-xml-parser for parsing html
- Add an array in mainWindow to store keys of the data when adding data to the hash table.
- Keep things simple. Just build this app like the java app that I have built.

## Start

Before you start the application, make sure you have compiled all the typescript files.

When you're working on the server (electron), you need to compile the typescript every time you make a change:

Run `tsc` and then run `yarn start` to start the Electron application.

When you're working on the client (solidjs), you just need to run `yarn start`, Vite will automatically update the app client when everytime the client's code changes.
