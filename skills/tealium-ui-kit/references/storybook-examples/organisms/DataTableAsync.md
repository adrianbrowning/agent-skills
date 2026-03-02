# DataTableAsync

## Example Usage

```tsx
import { DataTableAsync } from '@tealiumlabs/tealium-ui-kit/organisms/DataTableAsync';

function Example() {
  const handleFetchData = () => {};
  const COLUMNS = [...]; // Your data here

  return (
    <DataTableAsync
      fetchData={handleFetchData}
      columns={COLUMNS}
      defaultSortBy="name"
      sortByDesc
      hasRowActions
      rowActionList={...}
      hasPagination
      hasSelections
      hasFilterGroup
      toolbarOptions="toolbarOptions"
      paginationProps="paginationProps"
      filterGroupOptions="FilterGroupOptions"
    />
  );
}
```

### Sortable Example

```tsx
import { DataTableAsync } from '@tealiumlabs/tealium-ui-kit/organisms/DataTableAsync';

function SortableExample() {
  const COLUMNS = [...]; // Your data here

  return (
    <DataTableAsync
      fetchData="fetchDataAdapter"
      columns={COLUMNS}
    />
  );
}
```

## Story Variations

- Default
- WithLabelsData
- Sortable
- ControlRowClick
- ToggleSelectionWithControlRowClick
- BulkActionWithActionMenuWithCheckboxes
- WithDisableLoading
- WithColumnReorder

## Source

View full Storybook file: [src/components/organisms/DataTableAsync/DataTableAsync.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/DataTableAsync/DataTableAsync.stories.tsx)
