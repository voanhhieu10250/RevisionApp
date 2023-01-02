## Start

Create a .env-cmdrc file in the root directory with the following contents:

```
{
  "development": {
    "NODE_ENV": "development"
  },
  "test": {
    "NODE_ENV": "test"
  },
  "production": {
    "NODE_ENV": "production"
  }
}

```

Then run `yarn dev`

## Build and Publish

1. `yarn build`

2. `yarn make`

3. compile the package with Inno Setup Compiler (using the setup-script.iss file)

4. go to Github and create a new release

## Todo:

- Use fast-xml-parser for parsing html when crawling Quizlets
- Use showdown for the card's body. So that user can decide the size of the text
