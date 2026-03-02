# Breadcrumb

## Example Usage

```tsx
import { Breadcrumb } from '@tealiumlabs/tealium-ui-kit/molecules/Breadcrumb';

function Example() {
  const ITEMS = [...]; // Your data here

  return <Breadcrumb items={ITEMS}
      { id="home", component: <a href="/">Home</a> />;
}
```

### WithIcons Example

```tsx
import { Breadcrumb } from '@tealiumlabs/tealium-ui-kit/molecules/Breadcrumb';

function WithIconsExample() {
  const ITEMS = [...]; // Your data here

  return (
    <Breadcrumb
      items={ITEMS}
      id="home"
      component="("
    />
  );
}
```

## Story Variations

- Default
- TwoItems
- WithIcons
- LongLabels

## Source

View full Storybook file: [src/components/molecules/Breadcrumb/Breadcrumb.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/molecules/Breadcrumb/Breadcrumb.stories.tsx)
