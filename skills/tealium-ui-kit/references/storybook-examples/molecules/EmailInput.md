# EmailInput

## Example Usage

```tsx
import { EmailInput } from '@tealiumlabs/tealium-ui-kit/molecules/EmailInput';

function Example() {
  return (
    <EmailInput
      width="800px"
      errorHelperText="Some email addresses aren't on the correct form. Check the spelling."
      invalidEmailText="This email is invalid. Check the spelling."
      value={...}
      onValidation="fn()"
    />
  );
}
```

## Story Variations

- Default
- MaxEntries
- CustomValidation

## Source

View full Storybook file: [src/components/molecules/EmailInput/EmailInput.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/molecules/EmailInput/EmailInput.stories.tsx)
