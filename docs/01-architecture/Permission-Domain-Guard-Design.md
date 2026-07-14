# Permission & Domain Guard Design

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Menjelaskan cara backend menjaga akses user.

## Three Layers

```text
1. Menu Visibility
2. Route Protection
3. Data Scope Protection
```

UI hanya layer pertama. Backend wajib menjalankan layer kedua dan ketiga.

## Permission Guard

Pattern:

```ts
await permissionService.require(ctx, "warung.pos.use")
```

Jika tidak punya izin:

```text
FORBIDDEN
```

## Domain Guard

Pattern:

```ts
await domainGuard.require(ctx, "WARUNG")
```

Kasir Warung:

```text
Allowed: WARUNG
Denied: BRILINK
```

Petugas BRILink:

```text
Allowed: BRILINK
Denied: WARUNG
```

Owner:

```text
Allowed: WARUNG + BRILINK + GLOBAL
```

## Data Scope

Query non-Owner harus difilter domain.

Contoh:

```ts
where: {
  domain: "WARUNG"
}
```

atau memakai tabel domain-specific seperti `warung_sales`.

## Anti-Bencana Rules

System must prevent:

```text
Disable last Owner
Delete last Owner
Admin promote self to Owner
Admin grant self sensitive permission
Non-Owner modify Owner permission
Non-Owner delete Audit Log
```

## Sensitive Permission Warning

Permission sensitif harus diberi warning di UI dan Audit Log saat berubah.
