# AreaGraph

## Example Usage

```tsx
import { AreaGraph } from '@tealiumlabs/tealium-ui-kit/organisms/AreaGraph';

function Example() {
  const DATA = [...]; // Your data here

  return (
    <AreaGraph
      width="DEFAULT_STYLES.width"
      height="DEFAULT_STYLES.height"
      data={DATA}
      dataKeys="DEFAULT_DATAKEYS"
      referenceLineArray={...}
      { x="DEFAULT_DATA[0].name, y: DEFAULT_DATA[0].uv"
    />
  );
}
```

## Story Variations

- Default
- StackedArea
- GridEnabled
- ClickAndZoom
- NegativeClickAndZoom
- HiddenAxis
- WithCustomPalette

## Source

View full Storybook file: [src/components/organisms/AreaGraph/AreaGraph.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/AreaGraph/AreaGraph.stories.tsx)
