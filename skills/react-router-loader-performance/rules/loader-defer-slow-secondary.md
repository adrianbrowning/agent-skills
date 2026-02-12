---
title: Stream Secondary Data Without Awaiting
impact: HIGH
tags: [loaders, streaming, performance, suspense]
---

# Stream Secondary Data Without Awaiting

Don't await slow secondary operations. Return unresolved promises to stream non-critical data and improve TTFB.

## Why

- **Faster TTFB**: Critical data renders immediately instead of waiting for slow secondary operations
- **Parallel execution**: Secondary data loads in parallel with UI rendering
- **Better UX**: Users see content faster with progressive loading states
- **Keeps slow operations off critical path**: Recommendation engines, analytics, or external APIs don't block page load

## Pattern

```tsx
// Bad: Awaiting slow secondary data blocks entire response (~3500ms)
export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.id); // 500ms
  const recommendations = await getRecommendations(product); // 3000ms (slow ML algorithm)

  return data({ product, recommendations }); // TTFB: ~3500ms
}

// Good: Stream secondary data (~500ms TTFB, recommendations arrive later)
import { data } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.id); // 500ms

  // Don't await - return promise directly
  const recommendations = getRecommendations(product); // Streams

  return data({
    product, // Resolved
    recommendations, // Promise - streams when ready
  }); // TTFB: ~500ms
}

// Component: Use Suspense for streaming promises
import { Await, useLoaderData } from "react-router";
import { Suspense } from "react";

export default function Component() {
  const { product, recommendations } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Critical data renders immediately */}
      <ProductDetails product={product} />

      {/* Secondary data streams in */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Await resolve={recommendations}>
          {(data) => <Recommendations items={data} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

## When to Use

Stream data when:

- Secondary data is slow (>1000ms) but not critical for initial render
- Data comes from external APIs or slow algorithms
- Improving TTFB is more important than complete data
- Users can interact with page before all data loads

Don't stream when:

- Data is required for initial render (above-the-fold content)
- Fast queries (<200ms) - overhead not worth complexity
- SEO-critical content - streamed content may not be indexed

## Rules

1. Await critical data, return promises for secondary data
2. Wrap streamed components with Suspense and meaningful fallbacks
3. Measure TTFB before/after - aim for <500ms for critical path
4. Use for recommendations, analytics, social feeds, or external API data