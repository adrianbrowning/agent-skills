# ActionMenu

## Example Usage

```tsx
import { ActionMenu } from '@tealiumlabs/tealium-ui-kit/atoms/ActionMenu';

function Example() {
  return <ActionMenu actionList={...}
      id="1"
      text="Section Title"
      isSectionTitle />;
}
```

### WithIcons Example

```tsx
import { ActionMenu } from '@tealiumlabs/tealium-ui-kit/atoms/ActionMenu';

function WithIconsExample() {
  return (
    <ActionMenu
      actionList={...}
      id="1"
      text="Section Title"
      isSectionTitle
    />
  );
}
```

## Story Variations

- Default
- WithButtonGroupActions
- WithDestructiveAction
- Nested
- NestedOverflow
- CustomActions
- Searchable
- WithIcons
- WithCheckboxes
- WithSections
- WithDescriptions
- WithSelections
- WithDataTrackAction
- WithEmptyActionMessage
- WithScrollbar
- WithPopupOnHoverItem
- CustomPopupOnHoverItem
- CustomPopupWithInteractiveOnClick

## Source

View full Storybook file: [src/components/atoms/ActionMenu/ActionMenu.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/atoms/ActionMenu/ActionMenu.stories.tsx)
