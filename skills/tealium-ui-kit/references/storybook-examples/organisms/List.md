# List

## Example Usage

```tsx
import { List } from '@tealiumlabs/tealium-ui-kit/organisms/List';

function Example() {
  const ITEMS = [...]; // Your data here

  return <List items={ITEMS} />;
}
```

### WithPagination Example

```tsx
import { List } from '@tealiumlabs/tealium-ui-kit/organisms/List';

function WithPaginationExample() {
  const ITEMS = [...]; // Your data here

  return (
    <List
      items={ITEMS}
      selection={...}
      props={...}
    />
  );
}
```

## Story Variations

- Default
- WithTopBar
- WithCheckboxList
- WithRadioList
- InteractiveOnClickWithCheckboxList
- InteractiveOnClickWithRadioList
- WithFilterGroup
- WithSortByFilterGroup
- WithSortByData
- WithPagination
- WithResponsiveSupportingText
- InteractiveWithDefaulSelection
- InteractiveControlledSelection

## Source

View full Storybook file: [src/components/organisms/List/List.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/List/List.stories.tsx)
