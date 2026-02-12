---
title: Consolidate Database Round-Trips
impact: CRITICAL
tags: [loaders, database, performance, orm]
---

# Consolidate Database Round-Trips

Use ORM `include` or `relations` to fetch related data in single query instead of multiple sequential calls.

## Why

- **Reduces latency**: Each database call adds network round-trip time (~50-200ms each)
- **Biggest wins on high-latency connections**: On cloud databases far from servers, consolidation often yields largest performance gains
- **Single query faster than parallel queries**: Even with Promise.all, one query with joins beats three parallel queries

## Pattern

```tsx
// Bad: Multiple sequential DB calls (~450ms total on 150ms latency)
export async function loader({ params }: Route.LoaderArgs) {
  const product = await db.product.findUnique({
    where: { id: params.productId },
  }); // 200ms

  const reviews = await db.review.findMany({
    where: { productId: params.productId },
  }); // 150ms

  const variations = await db.variation.findMany({
    where: { productId: params.productId },
  }); // 100ms

  return data({ product, reviews, variations });
}

// Better: Parallel but still 3 DB calls (~200ms - slowest query)
export async function loader({ params }: Route.LoaderArgs) {
  const [product, reviews, variations] = await Promise.all([
    db.product.findUnique({ where: { id: params.productId } }),
    db.review.findMany({ where: { productId: params.productId } }),
    db.variation.findMany({ where: { productId: params.productId } }),
  ]);
  return data({ product, reviews, variations });
}

// Best: Single query with includes (~200ms - one round-trip)
export async function loader({ params }: Route.LoaderArgs) {
  const product = await db.product.findUnique({
    where: { id: params.productId },
    include: {
      reviews: true,
      variations: true,
    },
  });

  return data({ product });
}
```

## Rules

1. Use ORM `include`/`relations` for related data instead of separate queries
2. Combine with `select` to limit fields and optimize payload size
3. Analyze ORM query logs to identify N+1 query patterns
4. If DB latency consistently >30ms, infrastructure changes (colocation, read replicas) provide greater gains than code optimization