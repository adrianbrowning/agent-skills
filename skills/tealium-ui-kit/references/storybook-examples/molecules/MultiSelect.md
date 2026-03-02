# MultiSelect

## Example Usage

```tsx
import { MultiSelect } from '@tealiumlabs/tealium-ui-kit/molecules/MultiSelect';

function Example() {
  const OPTIONS = [...]; // Your data here
  const handleOnChange = (value: any) => console.log(value);

  return (
    <MultiSelect
      "data-testid"="multiselect-test"
      options={OPTIONS}
      onChange={handleOnChange}
    />
  );
}
```

### WithButtonGroupActions Example

```tsx
import { MultiSelect } from '@tealiumlabs/tealium-ui-kit/molecules/MultiSelect';

function WithButtonGroupActionsExample() {
  const OPTIONS = [...]; // Your data here
  const handleOnChange = (value: any) => console.log(value);
  const handleOnClick = () => {};

  return (
    <MultiSelect
      "data-testid"="multiselect-test"
      options={OPTIONS}
      onChange={handleOnChange}
      footerButtonGroup={...}
      children="Action 1"
      onClick={handleOnClick}
    />
  );
}
```

## Story Variations

- Default
- DefaultValues
- DefaultValuesWithDisabledOption
- Error
- Disabled
- FullWidth
- WithoutCheckboxes
- GroupBy
- GroupByWithScrollBar
- WithButtonGroupActions
- WithIconButtonGroupActions
- WithoutSelectAllOption
- LongOptionLabel
- WithDataTrackAction

## Source

View full Storybook file: [src/components/molecules/MultiSelect/MultiSelect.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/molecules/MultiSelect/MultiSelect.stories.tsx)
