# Table

## Example Usage

```tsx
import { Table } from '@tealiumlabs/tealium-ui-kit/organisms/table';

function Example() {
  const COLUMNS = [...]; // Your data here
  const DATA = [...]; // Your data here

  return <Table columns={COLUMNS}
      data={DATA} />;
}
```

### Sortable Example

```tsx
import { Table } from '@tealiumlabs/tealium-ui-kit/organisms/table';

function SortableExample() {
  const COLUMNS = [...]; // Your data here

  return (
    <Table
      columns={COLUMNS}
    />
  );
}
```

## Story Variations

- Default
- HasSelections
- HasSelectionsAndLeftComponent
- ControlRowClick
- ToolbarButtons
- SearchFiltering
- SearchFilteringAutoFocus
- CustomSearch
- CustomButtons
- SearchAndButtons
- SearchAndOneButton
- CustomToolbar
- CustomErrorEmpty
- CustomErrorNotFound
- Sortable
- Subheaders
- HideCheckboxAndSwitchAndMenu
- DefaultSearchKeyAndGlobalSearchCallback
- WithDataTrackAction

## Source

View full Storybook file: [src/components/organisms/table/Table.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/table/Table.stories.tsx)
