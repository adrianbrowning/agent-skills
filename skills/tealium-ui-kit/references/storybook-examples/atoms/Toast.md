# Toast

## Example Usage

```tsx
import { Toast } from '@tealiumlabs/tealium-ui-kit/atoms/Toast';

function Example() {
  const handleOnActionClick = () => {};

  return (
    <Toast
      type="success"
      actionLabel="Action"
      onActionClick={handleOnActionClick}
    />
  );
}
```

## Story Variations

- Default
- Warning
- Error
- Informational
- LongDescription
- WithoutDescription
- CustomDescription
- WithAction
- NoDescriptionWithAction
- WithCloseButton
- NoDescriptionWithCloseButtonAndAction

## Source

View full Storybook file: [src/components/atoms/Toast/Toast.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/atoms/Toast/Toast.stories.tsx)
