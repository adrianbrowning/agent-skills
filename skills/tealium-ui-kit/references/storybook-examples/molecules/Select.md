# Select

## Example Usage

```tsx
import { Select } from '@tealiumlabs/tealium-ui-kit/molecules/Select';

function Example() {
  const OPTIONS = [...]; // Your data here
  const handleOnChange = (value: any) => console.log(value);

  return (
    <Select
      options={OPTIONS}
      onChange={handleOnChange}
      disablePortal={false}
      placeholder="Select an option"
    />
  );
}
```

### WithIcons Example

```tsx
import { Select } from '@tealiumlabs/tealium-ui-kit/molecules/Select';

function WithIconsExample() {
  const OPTIONS = [...]; // Your data here

  return (
    <Select
      options={OPTIONS}
    />
  );
}
```

## Story Variations

- Default
- WithIcons
- WithSelectedStartAdornmentIcons
- LongOptionLabel
- AutomaticDropdownAlignment
- FullWidth
- DefaultValue
- CustomInput
- ForceCustomInputValue
- OptionValueAsSelectedValue
- OptionValueAsSelectedValueWithIconsAndCustomInput
- StartAdornment
- EndAdornment
- Disabled
- StartAdornmentAndSelectedValueIcon
- AutoHighlightFirstOption
- GroupByOption
- GroupByOptionWithScrollbar
- WithButtonGroupActions
- WithCloseDropdownOnButtonGroupActionClick
- WithIconButtonGroupActions
- EmptyOptionsWithButtonGroupActions
- PopupOnHoverItem
- CustomPopupOnHoverItem
- CustomPopupWithInteractiveOnClick
- PredefinedDropdownHeightSize
- DisabledOptions
- DisabledOptionsWithDefaultValue
- WithEnableFlip
- WithDataTrackAction
- WithFormFieldAccessory
- WithFormFieldAccessoryRequired
- WithFormFieldAccessoryAccessibility
- WithFormFieldAccessoryRequiredAccessibility

## Source

View full Storybook file: [src/components/molecules/Select/Select.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/molecules/Select/Select.stories.tsx)
