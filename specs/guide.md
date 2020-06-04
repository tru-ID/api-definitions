# Guide to Creating OpenAPI 3 Specs

The following guide aims to detail convention and common practice we follow when creating OpenAPI specifications.

- [Open API Tooling](#openapi-tooling)
- [Using Model Inheritance & Composition](#using-model-inheritance-composition)
- [Reusable Data Types](#reusable-data-types)

## OpenAPI Tooling

### Stoplight Studio

[Stoplight studio](https://stoplight.io/studio/) is a free OpenAPI designer (or IDE). It allows you to build OpenAPI specifications through a visual form but you will still need to occasionally move into the code view.

It provides a visual form-based editor, text editor, git integration, a mock server (powered by the open-source standalone component, [Prism](https://github.com/stoplightio/prism)) and OpenAPI linting (powered by [Spectral](https://github.com/stoplightio/spectral) which is also open-source).

## Prism

[Prism](https://github.com/stoplightio/prism) by Stoplight for standalone API mocking and OpenAPI [contract validation](https://github.com/stoplightio/prism/blob/master/docs/guides/02-request-validation.md).

### Spectral

[Spectral](https://github.com/stoplightio/spectral) by Stoplight for standalone OpenAPI linting. This can (and will) be very useful for CI processes.

## Using Model Inheritance & Composition

When there are a common properties that will exist upon numerous models you can use either inheritance or composition - both work in the same way through defining the common properties on a separate model and including it within your new model utilising the `allOf` keyword.

Use cases for this are:

### Creating a Resource

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

### Collection or Query Result Pagination

Since we use JSON Hypertext Application Language there are two groups of commonly found properties when paging through a collection:

1. Pagination links: `first`, `last`, `next` and `prev`
2. Pagination counters: such as `page_number`, `page_size`, `total_pages` and `total_items` 

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

## Reusable Data Types

As we build out our APIs we'll come across a number of commonly used data types that don't have a native definition within OpenAPI. We can add these to the `common/models/DataTypes` model as we need them.