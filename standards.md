# API Standards

This document outlines the standards we agree to adhere to when building APIs.

## OpenAPI

We document APIs using OpenAPI v3. [See Open API versions](https://github.com/OAI/OpenAPI-Specification/tree/master/versions) because it's the most widely understood and adoped API specification standard.

## API Style

Our APIs are [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) opposed to RPC or a Query Language such as GraphQL because it is the most widely adopted and understood approach to building APIs.

## API Versioning

Versioning of APIs is within the URL because it's the mostly commonly used approach today and provides a clear visual representation of the version within documenation. APIs should follow [Semanitic Versioning](https://semver.org/).

Examples

- `https://api.domain.com/v1/users`
- `https://api.domain.com/v1/projects`

Resources may existing for one version but not another. e.g.

- `https://api.domain.com/v2/users` // 200
- `https://api.domain.com/v2/projects` // 404

## HTTP Verbs

Use HTTP methods appropriately for the operation you are performing. CRUD (Create, Read, Update, Delete) operations and the correct response for each are as follows:

- `GET` = read. Lists the resources in a collection or a single resource. Returns a 200 HTTP status code and the requested resource(s)
- `POST` = create. Creates a new resource in a collection. Returns a `201` HTTP status code if the new resource has been fully created. Returns a `202` status code and as much information as is currently available if the resource is being created asynchronously.
- `PUT` = replace. Replaces a a resource with the supplied representation. Returns a 200 HTTP status code and the updated resource.
- `PATCH` = update. Partially updates a resource with the supplied properties. Returns a 200 HTTP status code and the udpated resource.
- `DELETE` = delete. Removes a resource. Returns a 204 HTTP status code and no body.

Examples

- `GET /projects` - lists all the resources of the collection `projects`
- `GET /projects/<project_id>` - lists the details of the single project resource from the `projects` collection
- `POST /projects -d '{"name": "My first project", "capabilities": ["x", "y"]}'` - create a new project
- `PUT /projects/<project_id> -d '{"name": "Only X", "capabilities": ["x"]}'` - Replaces all the resource details. In this example the `name` is changed and only the `x` capability is now supported by the project
- `PATCH /projects/<project_id> -d '{"name": "A more descriptive name"}'` - Update only the project name
- `DELETE /projects/<project_id>` - Remove the project identified by `<project_id>` from the collection

## HTTP Status Codes

### 200

### 201

### 202

### 204

### 400

## Resource Names

APIs should adhere to the principles of REST because we are building RESTful APIs.

- Separate things into logical Collections e.g. `projects` and `users`
- Collections are the collective term for Resources e.g. `projects`
- Resources are nouns not verbs
- Collections are plurals

Examples:

- `/projects` - `projects` is the collection name
- `/projects/<project_id>` - The project idenfied by `project_id` is the resource

## Resource Structure

Resources and their relations should be represented using [JSON Hyptertext Application Language](https://tools.ietf.org/html/draft-kelly-json-hal-08) because it is a simple and well understood implementation of hypermedia.

Example from the specification:

```
GET /orders/523 HTTP/1.1
Host: example.org
Accept: application/hal+json

HTTP/1.1 200 OK
Content-Type: application/hal+json

{
    "_links": {
        "self": { "href": "/orders/523" },
        "warehouse": { "href": "/warehouse/56" },
        "invoice": { "href": "/invoices/873" }
    },
    "currency": "USD",
    "status": "shipped",
    "total": 10.20
}
```

## Parameters and Properties

### Naming Format

Parameters and properties whether used within the URL as a query parameter or the body for a request or a response should be in [`snake_case`](https://en.wikipedia.org/wiki/Snake_case) so they are easy to read and to ensure they are consistently represented across all parts of the API.

Example in a query:

- `https://api.domain.com/v1/projects?project_id=xxx_yyy_zzz`

Example in a body payload:

```json
{
    "_links": {
        "self": { "href": "/project/xxx_yyy_zzz" }
    },
    "project_id": "xxx_yyy_zzz",
    "name": "My first project",
}
```

### Identifier (ID) Property Names

Identifier property names should be fully qualified to remove any ambiguity regarding what resource the identifier is associated with. Do not use `id`. Instead use `<resource_name>_id` e.g. `project_id`.

### Date Identifiers

Dates should be in the format `<verb>ed_at` e.g. `created_at` and `updated_at`. This format makes it very clear what happened to the resource via the `verb` and the `_at` consistently identifies a date.

### Date Format

Dates should follow [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) because it is the most widely adopted representation of dates on the Internet. If the data is within a URL is should be URL encoded.

### Decimal Precision

All values returned by the API should have the same decimal precision.

Example:

```json
{
  "credit_limit": "0.0000"
}
```

## Querying to Search or Filter

Searches should be performed by using RSQL (REST Structured Query Language) within the query of a URL which is a superset of [FIQL](https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00). For more information see:

- [Grammar and semantics](https://github.com/jirutka/rsql-parser#grammar-and-semantic)
- [Examples](https://github.com/jirutka/rsql-parser#examples)

## Pagination

APIs should use one of the following pagination schemes:

* Cursor based for ever-expanding data sets, or where it's infeasible to count the total number of records e.g. phone verification checks for a Project
* Page based for small, managed APIs where the customer is in control of what is in the data set e.g. Number pools

To the customer, having two different pagination methods is OK, as in practice they should request the first page and then follow the `_links.next` URL to get the next page.

Cursor implementation can be decided by the engineering team. Results returned must be consistently ordered, and the customer can decide if the data set is returned in ascending or descending order.

### Cursor based

> Cursors, if you’re not familiar, are like pointers. Pointers point at things, they reference a specific iota, a place in the list where your last request left off. A bookmark with breadcrumbs built in. (via [Slack](https://api.slack.com/docs/pagination#cursors))

- There should be a way to page through collections without additional filters.
- There should be a way to page through collections with filters.
- Cursors should not expire
- Paging should use a standard set of hal+json `_links`
  - `self` (current page, required)
  - `next` (next page, optional)
  - `prev` (previous page, optional)
  - `first` (first page, required)
- Paging `_links` must include filters.
- The page size parameter must be called `page_size`
- The cursor parameter must be called `cursor`

Example:


```json
{
  "page_size": 100,
  "cursor": "19284743",
  "_embedded": {
    "resource_name": {
      "data":"here"
    }
  },
  "_links": {
    "self": {
      "href": "https://example.com/resource?page_size=100&order=asc&cursor=19284743"
    },
    "next": {
      "href": "https://example.com/resource?page_size=100&order=asc&cursor=19291731"
    },
    "prev": {
      "href": "https://example.com/resource?page_size=100&order=asc&cursor=19283018"
    }
  }
}
```

### Page Based

In certain situations (e.g. reviewing Projects) it may be beneficial to skip over pages if you're not interested in that data. In this situation, `page` and `page_size` should be used.

The first page is page `1`.

- Paging should use a standard set of hal+json `_links`
  - `self` (current page, required)
  - `next` (next page, optional)
  - `prev` (previous page, optional)
  - `first` (first page, required)
  - `last` (last page, required)
- Paging `_links` must include filters.
- The page size parameter must be called `page_size`
- The page index parameter must be called `page`
- The page count parameter must be called `total_pages`
- The results parameter must be called `total_items`

```json
{
  "page_size": 100,
  "page": 3,
  "total_pages": 8,
  "total_items": 814,
  "_embedded": {
    "resource_name": {
      "data":"here"
    }
  },
  "_links": {
    "self": {
      "href": "https://example.com/resource?page_size=100&order=asc&page=3"
    },
    "next": {
      "href": "https://example.com/resource?page_size=100&order=asc&page=4"
    },
    "prev": {
      "href": "https://example.com/resource?page_size=100&order=asc&page=2"
    },
    "last": {
      "href": "https://example.com/resource?page_size=100&order=asc&page=8"
    }
  }
}
```


## Errors

API errors should be represented using the structured outlined in [RFC7807](https://tools.ietf.org/html/rfc7807) (Problem Details for HTTP APIs) because it's a well understood and defined REST API error format.

Example from the specification:

```json
{
   "type": "https://example.net/validation-error",
   "title": "Your request parameters didn't validate.",
   "invalid-params": [ {
                         "name": "age",
                         "reason": "must be a positive integer"
                       },
                       {
                         "name": "color",
                         "reason": "must be 'green', 'red' or 'blue'"}
                     ]
}
```

## Acknowledgements & References

- Much of these standards follow an approached taken by the [Nexmo API Standards](https://github.com/Nexmo/api-standards)

# TODO

- [ ] HTTP status codes: more detail and examples
- [ ] Versioning: Discuss Semantic Versioning support within URLs. Is adding information to response payload a breaking change and thus requires a new MAJOR release? Adding support for a new parameter to a request body? What about adding support for another query parameter?
- [ ] Parameters and Properties: Decimal precision - discuss and agree
- [ ] Pagination: discuss and agree on cursor and page-based pagination
- [ ] References: should URL references (e.g. self") provide fully qualified URLs or partial URLs from a base e.g. `"https://example.com/v1/resource?page_size=100&order=asc&page=4"` vs `"/resource?page_size=100&order=asc&page=4"`
- [ ] Errors: Provide more information on the benefits of HTTP Problem Detail via examples
- [ ] Webhooks: Required right now?
- [ ] Look at [Stripe details](https://media-exp1.licdn.com/dms/image/C5622AQHx3XDY-qMIkA/feedshare-shrink_2048_1536/0?e=1593648000&v=beta&t=mfr9NzejKJTXLPuvOAt8v9jfJtB-cjiWn5_2-R-78RM) and decide which, if any, to adopt
- [ ] Deprecation policy
- [ ] Move our API supported RSQL syntax and examples into this document. [Good example](https://developer.here.com/olp/documentation/data-client-library/dev_guide/client/rsql.html)
- [ ] Ensure each decision captures *why* the standard was chosen