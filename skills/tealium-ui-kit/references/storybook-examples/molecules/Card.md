# Card

## Example Usage

```tsx
import { Card } from '@tealiumlabs/tealium-ui-kit/molecules/Card';

function Example() {
  return <Card children="(" />;
}
```

### WithActions Example

```tsx
import { Card } from '@tealiumlabs/tealium-ui-kit/molecules/Card';

function WithActionsExample() {
  return (
    <Card
      children="("
      <strong>Name="</strong> John Doe"
      <strong>Email="</strong> john.doe@example.com"
      <div style={{ marginTop="1rem", display: "flex", gap: "0.5rem"
    />
  );
}
```

## Story Variations

- Default
- WithPadding
- WithActions
- WithImage
- Elevated
- ComplexContent

## Source

View full Storybook file: [src/components/molecules/Card/Card.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/molecules/Card/Card.stories.tsx)
