# API Standards

This document outlines the standards we agree to adhere to when building APIs.

## OpenAPI

We document APIs using OpenAPI v3. [See Open API versions](https://github.com/OAI/OpenAPI-Specification/tree/master/versions).

## API Style

Our APIs are [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) opposed to RPC or a Query Language such as GraphQL.

## API Versioning

Versioning of APIs is within the URL and should follow [Semanitic Versioning](https://semver.org/).

Examples

- `https://api.domain.com/v1/users`
- `https://api.domain.com/v1/projects`

Resources may existing for one version but not another. e.g.

- `https://api.domain.com/v2/users` // 200
- `https://api.domain.com/v2/projects` // 404

## Resource Structure

Resources and their relations should be represented using [JSON Hyptertext Application Language](https://tools.ietf.org/html/draft-kelly-json-hal-08).

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

Parameters and properties whether used within the URL as a query parameter or the body for a request or a response should be in [`snake_case`](https://en.wikipedia.org/wiki/Snake_case).

Example in a query:

- `https://api.domain.com/v1/projects?project_id=xxx_yyy_zzz`

Example in a body payload:

```json
{
    "_links": {
        "self": { "href": "/project/xxx_yyy_zzz" }
    },
    "id": "xxx_yyy_zzz",
    "name": "My first project",
}
```

### Date Identifiers

Dates should be in the format `<verb>ed_at` e.g. `created_at` and `updated_at`

### Date Format

Dates should follow [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). If the data is within a URL is should be URL encoded.

## Querying to Search or Filter

Searches should be performed by using RSQL (REST Structured Query Language) within the query of a URL which is a superset of [FIQL](https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00). For more information see:

- [Grammar and semantics](https://github.com/jirutka/rsql-parser#grammar-and-semantic)
- [Examples](https://github.com/jirutka/rsql-parser#examples)

## Errors

API errors should be represented using the structured outlined in [RFC7807](https://tools.ietf.org/html/rfc7807) (Problem Details for HTTP APIs).

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


# TODO

- [ ] Move our API supported RSQL syntax and examples into this document. [Good example](https://developer.here.com/olp/documentation/data-client-library/dev_guide/client/rsql.html)
- [ ] Discuss Semantic Versioning support within URLs
- [ ] Look at [Stripe details](https://media-exp1.licdn.com/dms/image/C5622AQHx3XDY-qMIkA/feedshare-shrink_2048_1536/0?e=1593648000&v=beta&t=mfr9NzejKJTXLPuvOAt8v9jfJtB-cjiWn5_2-R-78RM) and decide which, if any, to adopt
- [ ] Pagination
- [ ] Webhooks
- [ ] Decimal precision
- [ ] Deprecation policy
- [ ] HTTP verbs. POST = create, PUT = replace, PATCH = update, DELETE = delete. Also, HTTP response codes.
- [ ] HTTP codes