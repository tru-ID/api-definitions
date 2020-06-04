# API Specifications (Definitions)

## How to Create and Edit API Specifications

For information on how to create OpenAPI specifications see the [Guide to Creating OpenAPI 3 Specs](guide.md).

## Code Generation from OpenAPI Specifications

### Install the build dependencies:

```sh
# Install the build dependencies
npm install

# Install the OpenAPI Generator CLI
# and ensure it's on the system PATH
brew install openapi-generator # Assuming you're on Mac or Linux
```

### Run the build

```sh
# Build
npm run-script specs:build
```

### View the Generated Code

1. A dereferenced OpenAPI specification will be in `build/out/`
2. Generated Spring Java classes:
    1. Via original YAML files in `build/from-yaml`
    2. Via generated JSON files in `build/from-json`

The different types of Spring Java classes are generated to allow us to evaluate if either is better than the other and if either could be used.