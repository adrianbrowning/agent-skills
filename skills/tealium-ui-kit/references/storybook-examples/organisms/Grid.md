# Grid

## Example Usage

```tsx
import { Grid } from '@tealiumlabs/tealium-ui-kit/organisms/Grid';

function Example() {
  return <Grid cards="Cards" />;
}
```

### WithIcons Example

```tsx
import { Grid } from '@tealiumlabs/tealium-ui-kit/organisms/Grid';

function WithIconsExample() {
  const handleCards = () => {};
  const handleOnClick = (value: any) => console.log(value);

  return (
    <Grid
      cards={handleCards}
      isInteractive
      onClick={handleOnClick}
      footer={...}
      right={...}
      type="icons"
      props={...}
      { text="2", icon: "fas fa-users"
    />
  );
}
```

## Story Variations

- Default
- WithColumGap
- WithColumns
- WithColumnsWithColumnGap
- WithTopBar
- WithButtons
- WithIcons
- WithButtonGroup
- WithIconButtonGroup
- WithSwitch
- WithActionMenu
- InteractiveOnClick
- InteractiveOnClickWithClearSelection
- WithFilterGroup
- WithPagination
- WithSlideoutAndTabs
- WithSlideoutAndTabsWithColumnGap
- WithSlideoutAndTabsWithColumns
- WithSlideoutAndTabsWithColumnsWithColumnGap
- FiteringWithHiddenFields
- CustomErrorNoItems
- FilterGroupWithErrorNotFound

## Source

View full Storybook file: [src/components/organisms/Grid/Grid.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/Grid/Grid.stories.tsx)
