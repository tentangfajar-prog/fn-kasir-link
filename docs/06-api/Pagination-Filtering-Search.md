# Pagination, Filtering, and Search

Status: **FINAL V1 BASELINE**

## Pagination

Default:

```text
page=1
limit=20
```

Max limit:

```text
100
```

## Filter Parameters

Common:

```text
date_from
date_to
status
domain
user_id
partner_id
product_id
payment_method_id
transaction_type_id
keyword
```

## Searchable Dropdown

Search endpoint returns:

```json
[
  {
    "id": "uuid",
    "label": "Kopi Seduh",
    "description": "Kategori: Kopi"
  }
]
```

## Mobile Filter

Mobile uses bottom sheet but calls the same query API.
