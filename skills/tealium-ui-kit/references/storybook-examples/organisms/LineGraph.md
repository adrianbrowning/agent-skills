# LineGraph

## Example Usage

```tsx
import { LineGraph } from '@tealiumlabs/tealium-ui-kit/organisms/LineGraph';

function Example() {
  const DATA = [...]; // Your data here

  return (
    <LineGraph
      width="DEFAULT_STYLES.width"
      height="DEFAULT_STYLES.height"
      type="secondary"
      data={DATA}
      dataKeys="SINGLE_DATAKEYS"
      margin="DEFAULT_STYLES.margin"
      isSimple
    />
  );
}
```

## Story Variations

- SingleLine
- WithCustomPalette

## Source

View full Storybook file: [src/components/organisms/LineGraph/LineGraph.stories.tsx](https://github.com/Tealium/tealium-ui-kit/blob/main/src/components/organisms/LineGraph/LineGraph.stories.tsx)
