# BarChart

## Example Usage

```tsx
import { BarChart } from '@tealiumlabs/tealium-ui-kit/organisms/BarChart';

function Example() {
  const DATA = [...]; // Your data here

  return (
    <BarChart
      data={DATA}
      dataKeys="BARCHART_DATAKEYS"
      header="BarChart Title"
      subHeader="Description about the BarChart"
      dateFormat
      xAxisOptions={...}
    />
  );
}
```

## Story Variations

- Default
- StackedWithZeroLine
- WithCustomPalette

## Source

View full Storybook file: [src/components/organisms/BarChart/BarChart.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/BarChart/BarChart.stories.tsx)
