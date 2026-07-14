# Audit & Print API Contract

Status: **FINAL V1 BASELINE**  
Domain: SYSTEM

## GET /audit-logs

Query:

```text
date_from
date_to
user_id
domain
module
action
entity_no
keyword
```

Rules:
- Owner default.
- Human-readable list.
- Technical detail expandable.

## POST /print/:entity_type/:entity_id

Print document.

Request:

```json
{
  "format": "thermal_80"
}
```

Rules:
- Check permission.
- Create Print Log.
- If printer fails, transaction remains valid.

## GET /print-logs

List print history.
