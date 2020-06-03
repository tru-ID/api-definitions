# API Definitions & Standards

Our API definitions and standards follow the OpenAPI v3.0 standard.

## Contents

### API Definitions

The [`specs`](specs/) directory contains the API specifications. The directory structure is in the form `{api_grouping}/{resource}` where:

* `{api_grouping}` is either logical grouping of resources (e.g. `console`) or a product
* `{resource}` is the specific API resource (e.g. `projects`)

The `specs/common/` directory contains models that are commonly used within the API.

### API Standards

API Standards are within [standards.md](standards.md).

### Code of Conduct

Please also read our [Code of Conduct](code_of_conduct.md)

## OpenAPI Tooling

### Stoplight Studio

[Stoplight studio](https://stoplight.io/studio/) is a free OpenAPI designer (or IDE) .

It provides a visual form-based editor, text editor, git integration, a mock server (powered by the open-source standalone component, [Prism](https://github.com/stoplightio/prism)) and OpenAPI linting (powered by [Spectral](https://github.com/stoplightio/spectral) which is also open-source).

## Prism

[Prism](https://github.com/stoplightio/prism) by Stoplight for standalone API mocking and OpenAPI [contract validation](https://github.com/stoplightio/prism/blob/master/docs/guides/02-request-validation.md).

### Spectral

[Spectral](https://github.com/stoplightio/spectral) by Stoplight for standalone OpenAPI linting. This can (and will) be very useful for CI processes.
