# FilterGroup

## Example Usage

```tsx
import { FilterGroup } from '@tealiumlabs/tealium-ui-kit/organisms/FilterGroup';

function Example() {
  const DATA = [...]; // Your data here

  return (
    <FilterGroup
      data={DATA}
      defaultSortGroup="lastName"
      defaultSortByDesc
      sortGroups="sortGroups"
      filterGroups="filterGroups"
    />
  );
}
```

## Story Variations

- Default
- WithCustomOptions
- WithSortByFilterGroup
- WithSortByData
- WithSearchFilter
- DisplayTokens
- SortFilterWithSeachAndDisplayToken
- WithResultCount
- WithLabels
- DisplayOnlySearchFilter
- WithExcludeListOnSearch
- WithDataTrackActionOnSelect
- WithDataTrackActionOnMultiSelect
- WithMultipleFilterGroups
- WithSearchAndDataTrackAction

## Source

View full Storybook file: [src/components/organisms/FilterGroup/FilterGroup.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/FilterGroup/FilterGroup.stories.tsx)
