# Pagination

## Example Usage

```tsx
import { Pagination } from '@tealiumlabs/tealium-ui-kit/molecules/Pagination';

function Example() {
  const handleOnPaginationChange = (value: any) => console.log(value);

  return <Pagination totalItems={4000}
      onPaginationChange={handleOnPaginationChange} />;
}
```

## Story Variations

- Default
- PageSelection
- ItemsPerPage
- CustomItemsPerPage
- Localizations
- ShowAll
- ShowAllWithCustomItemPerPage

## Source

View full Storybook file: [src/components/molecules/Pagination/Pagination.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/molecules/Pagination/Pagination.stories.tsx)
