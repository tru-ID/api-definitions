# API Specifications (Definitions)

This README details convention and common practice we follow when creating OpenAPI specifications along with the tooling we use to create and validate OpenAPI specifications and APIs.

- [API Standards](#api-standards)
- [OpenAPI Tooling](#openapi-tooling)
  - [Stoplight Studio](#stoplight-studio)
  - [Spectral](#spectral)
  - [Prism](#prism)
- [Authoring OpenAPIs](#authoring-openapis)
  - [Directory Structure](#directory-structure)
  - [File Naming & Location](#file-naming-location)
  - [Using Model Inheritance & Composition](#using-model-inheritance-composition)
- [Code Generation from OpenAPI Specifications](#code-generation-from-openapi-specifications)

## API Standards

Please see [standards.md](standards.md) for the API standards our APIs should follow.

## OpenAPI Tooling

### Stoplight Studio

[Stoplight studio](https://stoplight.io/studio/) is a free OpenAPI designer (or IDE). It allows you to build OpenAPI specifications through a visual form but you will still need to occasionally move into the code view.

It provides a visual form-based editor, text editor, git integration, a mock server (powered by the open-source standalone component, [Prism](https://github.com/stoplightio/prism)) and OpenAPI linting (powered by [Spectral](https://github.com/stoplightio/spectral) which is also open-source).

### Spectral

[Spectral](https://github.com/stoplightio/spectral) by Stoplight for standalone OpenAPI linting. Spectral is used as part of the CI for our API specifications. See [../.gitlab-ci.yml].

You can link an OpenAPI specification as follows:

> Note: Ensure you have installed the API package dependencies using `npm install`.

```sh
npm specs:lint -- {path_to_open_api_spec}
```

For example:

```sh
$ npm run specs:lint -- -F hint ./specs/openapi.v1.yaml                                                                

> api_definitions@0.1.0 specs:lint /Users/leggetter/tru/git/api_definitions
> spectral lint "-F" "hint" "./specs/openapi.v1.yaml"

OpenAPI 3.x detected
No results with a severity of 'hint' or higher found!
```

For more parameter options see [the Spectral CLI docs](https://github.com/stoplightio/spectral/blob/develop/docs/guides/2-cli.md). You can also run the `spectral` CLI directly via `node_modules/.bin/spectral`.

### Prism

[Prism](https://github.com/stoplightio/prism) by Stoplight for standalone API mocking and OpenAPI [contract validation](https://github.com/stoplightio/prism/blob/master/docs/guides/02-request-validation.md).

> Note: Ensure you have installed the API package dependencies using `npm install`.

#### Mocking

For example:

```sh
$ npm run specs:mock -- ./specs/openapi.v1.yaml

> api_definitions@0.1.0 specs:mock /Users/leggetter/tru/git/api_definitions
> prism mock "./specs/openapi.v1.yaml"

[5:10:27 PM] › [CLI] …  awaiting  Starting Prism…
[5:10:27 PM] › [CLI] ℹ  info      GET        http://127.0.0.1:4010/projects/8bf7a495-e3f1-6d3a-a3a2-e4d27e26cff0
[5:10:27 PM] › [CLI] ℹ  info      DELETE     http://127.0.0.1:4010/projects/06e46cff-9e8e-fd34-cce5-70af237c7a09
[5:10:27 PM] › [CLI] ℹ  info      POST       http://127.0.0.1:4010/projects
[5:10:27 PM] › [CLI] ℹ  info      GET        http://127.0.0.1:4010/projects?name=quo&size=9&number=132
[5:10:27 PM] › [CLI] ▶  start     Prism is listening on http://127.0.0.1:4010
```

#### Request & Response Validation

When building an API you can validate the requests to and responses from the live API against the OpenAPI specification using:

```sh
npm run specs:proxy -- {path_to_openapi_spec} {api_server_URL_inc_port} -p {proxy_port}
```

For example:

```sh
$ npm run specs:proxy --  ./specs/openapi.v1.yaml http://localhost:4010 -p 4020

> api_definitions@0.1.0 specs:proxy /Users/leggetter/tru/git/api_definitions
> prism proxy "./specs/openapi.v1.yaml" "http://localhost:4010" "-p" "4020"

[4:44:40 PM] › [CLI] …  awaiting  Starting Prism…
[4:44:40 PM] › [CLI] ℹ  info      GET        http://127.0.0.1:4020/projects/739282b0-2e9b-67fc-e33c-c6a40c6beea9
[4:44:40 PM] › [CLI] ℹ  info      DELETE     http://127.0.0.1:4020/projects/16c02c10-07a1-609e-d671-8f399557e155
[4:44:40 PM] › [CLI] ℹ  info      POST       http://127.0.0.1:4020/projects
[4:44:40 PM] › [CLI] ℹ  info      GET        http://127.0.0.1:4020/projects?name=aliquid&size=17&number=920
[4:44:40 PM] › [CLI] ▶  start     Prism is listening on http://127.0.0.1:4020
```

For more parameter options see [the Prism CLI docs](https://github.com/stoplightio/prism/blob/master/docs/getting-started/03-cli.md#proxy). You can also run the `prism` CLI directly via `node_modules/.bin/prism`.

## Authoring OpenAPIs

### Directory Structure

```sh
specs
├── models
│   ├── common
│   │   ├── CredentialTypes.v1.yaml
│   │   ├── DataTypes.v1.yaml
│   │   ├── HTTPProblemDetailTypes.v1.yaml
│   │   ├── Headers.v1.yaml
│   │   ├── Link.v1.yaml
│   │   ├── PageBasedPagination.v1.yaml
│   │   └── PaginationLinks.v1.yaml
│   ├── console
│   │   └── ProjectResourceModels.v1.yaml
│   └── phone_check
│       └── PhoneCheckResourceModels.v0.1.yaml
└── openapi.v1.yaml
```

All files related to the API specifications are within the `specs` directory. 

### File Naming & Location

> Note: We're still working through what our conventions are going to be here so please provide feedback if you have any suggested improvements.

#### Endpoint Definitions

All paths should be in a top-level file named `openapi.{version}.yaml`. `paths` within the `openapi.{version}.yaml` file may have different versions depending on the `{product_group}`.

Parameters that are shared across paths should be kept within the API specification file but moved into the `components` section or within `models/common` for reuse.

#### Model Definitions

Models should be within a file named in the format `{resource_name}ResourceModels.v1.yaml` e.g. `ProjectResourceModels.v1.yaml`. and reside in a directory `models/{product_group}` e.g. `ProjectResourceModels.v1.yaml` will be within the `models/console` directory.

All model definitions for a given resource should be within a single model file.

Models that are relevant for two or more APIs should be within the `models/common` directory.

### File Versioning

A new file should be created for a major version of an API or Model and the version should be indicated within the file name in the format `{resource_name}ResourceModels.{version}.yaml` e.g. `ProjectResourceModels.v1.yaml`

### Using Model Inheritance & Composition

When there are a common properties that will exist upon numerous models you can use either inheritance or composition - both work in the same way through defining the common properties on a separate model and including it within your new model utilising the `allOf` keyword.

> Note: Consider using `allOf` sparingly as it does create fragmentation of model definitions across multiple definitions which can make it hard for the non-machine reader (the human being) to follow a specification. Please balance reuse with readability.

Use cases for this are:

#### Creating a Resource

The number of properties on a payload required to create a resource is more often than not less than the number of properties on the created resource. For example, a Project may only require a `name` property to be created:

```json
{
    "name": "My project name"
}
```

But following creation it will have:

```json
{
    "project_id": "c69bc0e6-a429-11ea-bb37-0242ac130002",
    "name": "My project name",
    "created_at": "2020-06-01T16:43:30+00:00"
}
```

Therefore, the specification for the properties for the creation of a Project are defined in a `ProjectPartial` definition e.g.

```yaml
title: ProjectPartial
description: The minimal structural representation to create a Project
type: object
properties:
  name:
    type: string
    example: My first project
    description: A descriptive name of the Project
required:
  - name
```

The full definition of a Project is contained within a `ProjectFull` definition and is composed of the `ProjectPartial` definition through the use of `allOf` an including `$ref: path/to/ProjectPartial` within the definition :

```yaml
title: ProjectFull
description: A Project
allOf:
  - $ref: ./ProjectPartial.v1.yaml
  - type: object
    properties:
      project_id:
        $ref: ../../../common/models/DataTypes.v1.yaml#/components/schemas/UUID
        example: c69bc0e6-a429-11ea-bb37-0242ac130002
        description: The unique identifier for the Project
      created_at:
        type: string
        format: Datetime ISO 8601
        example: '2020-06-01T16:43:30+00:00'
        description: The datetime the project was created
    required:
      - _links
      - id
      - created_at
      - updated_at
```

#### Collection or Query Result Pagination

Since we use JSON Hypertext Application Language there are two groups of commonly found properties when paging through a collection:

1. Pagination links: `first`, `last`, `next` and `prev`. See [PageBasedPagination](common/models/PageBasedPagination.v1.yaml)
2. Pagination counters: such as `page.number`, `page.size`, `page.total_pages` and `page.total_elements` 

Instead of defining these on every collection we can instead using model inheritance or composition to include these properties.

For an example of composition let's look at pagination links. In the `PaginationLinks` definition we have the following (with some properties removed for brevity):

```yaml
title: PageBasedLinks
type: object
description: Links to enable pagination over collections.
components:
  schemas:
    FirstHref:
      description: URL to the first page of records
      properties:
        href:
          type: string
      type: object
    LastHref:
      description: URL to the last page of records
      properties:
        href:
          type: string
      type: object
properties:
  first:
    $ref: '#/components/schemas/FirstHref'
  last:
    $ref: '#/components/schemas/LastHref'
```

Within the `GET /projects` endpoint our definition uses composition on the `_links` property to utilise the `PaginationLinks` model:

```yaml
    get:
      summary: Retrieve a collection of projects
      operationId: get-projects
      description: Get a full list of Projects or filter by query parameter.
      tags:
        - project
        - console
      responses:
        '200':
          description: OK
          content:
            application/hal+json:
              schema:
                allOf:
                  - $ref: ../../common/models/PageBasedPagination.v1.yaml
                  - type: object
                    properties:
                      _embedded:
                        type: array
                        items:
                          $ref: ./models/ProjectFull.v1.yaml
                      _links:
                        $ref: ../../common/models/PaginationLinks.v1.yaml
```

You'll also notice that model inheritance is used with `PageBasedPagination`.

### Reusable Data Types

As we build out our APIs we'll come across a number of commonly used data types that don't have a native definition within OpenAPI. We can add these to the `common/models/DataTypes` model as we need them.

## Code Generation from OpenAPI Specifications

Spring Java code is generated using the [OpenAPI Generator](https://openapi-generator.tech/) and the [Spring Generator](https://openapi-generator.tech/docs/generators/spring/).

### Install the Code Generation Dependencies:

```sh
# Install the build dependencies
npm install

# Install the OpenAPI Generator CLI
# and ensure it's on the system PATH
brew install openapi-generator # Assuming you're on Mac or Linux
```

### Generate the Code

```sh
# Build
npm run specs:generate
```

### View the Generated Code

1. A dereferenced OpenAPI specification will be in `build/out/`
2. Generated Spring Java classes:
    1. Via original YAML files in `build/out/from-yaml`
    2. Via generated JSON files in `build/out/from-json`

The different types of Spring Java classes are generated to allow us to evaluate if either is better than the other and if either could be used.