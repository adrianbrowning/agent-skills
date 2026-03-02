# DataTable

## Example Usage

```tsx
import { DataTable } from '@tealiumlabs/tealium-ui-kit/organisms/DataTable';

function Example() {
  const DATA = [...]; // Your data here
  const COLUMNS = [...]; // Your data here

  return (
    <DataTable
      data={DATA}
      columns={COLUMNS}
      toolbarOptions={...}
      tableType="results"
      hideToolbar
    />
  );
}
```

### Sortable Example

```tsx
import { DataTable } from '@tealiumlabs/tealium-ui-kit/organisms/DataTable';

function SortableExample() {
  const COLUMNS = [...]; // Your data here

  return (
    <DataTable
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
- TopBarWithGlobalActions
- TopBarWithGlobalActionsWithDataTrackAction
- BulkActionsWithSelections
- BulkActionsWithInitialSelections
- BulkActionsWithSelectionsAndToggleSwitches
- BulkActionsWithActionMenu
- BulkActionsWithEmptyActionMenu
- BulkActionsWithActionMenuWithCheckboxes
- RowActionsWithButtonIcons
- RowActionsWithMenuAction
- FilterGroup
- CustomCellsCheckboxes
- CustomErrorEmpty
- CustomErrorNotFound
- WithPagination
- SortableWithPagination
- WithOnSelectedRowChanged
- WithDataTrackAction
- DisabledDataTrackActionPostfixInRows
- WithDataTrackActionInTableHeader
- WithSlideoutAndTabs
- WithFixedLayout
- WithExcludeListOnSearch
- WithWizardAndAlerts
- CustomCellWithOptimizedRendering
- WithColumnReorderAndMinWidth

## Source

View full Storybook file: [src/components/organisms/DataTable/DataTable.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/DataTable/DataTable.stories.tsx)
