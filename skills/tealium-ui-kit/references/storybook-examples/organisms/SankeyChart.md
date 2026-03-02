# SankeyChart

## Example Usage

```tsx
import { SankeyChart } from '@tealiumlabs/tealium-ui-kit/organisms/SankeyChart';

function Example() {
  const DATA = [...]; // Your data here

  return (
    <SankeyChart
      data={DATA}
      showDropoffCarryoverNodes
      showDropoffCarryoverLinks={false}
      showTooltipAction
      height={400}
      tooltipActionName="Create Audience"
    />
  );
}
```

## Story Variations

- Default
- WithNodeValueOverride

## Source

View full Storybook file: [src/components/organisms/SankeyChart/SankeyChart.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/SankeyChart/SankeyChart.stories.tsx)
