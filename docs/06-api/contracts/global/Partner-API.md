# Partner API Contract

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## GET /partners

List partners.

### Query

```text
keyword
partner_type=supplier|consignment|both
status=active|inactive
page
limit
```

## POST /partners

Create partner.

### Permission

```text
settings.partner.manage
```

### Request

```json
{
  "name": "Toko Grosir A",
  "phone": "0812xxxx",
  "address": "Alamat",
  "notes": "Catatan",
  "partner_type": "supplier"
}
```

## PATCH /partners/:id

Update partner.

### Rules

- Basic data can be updated by authorized user.
- Transactions store partner snapshot.
- Partner used in transactions cannot be hard deleted.

## POST /partners/:id/deactivate

Deactivate partner.

## Search Endpoint

```text
GET /search/partners?q=budi&type=consignment
```

Returns max 20 results.
