import React from "react";
import { Arrow, Group, Text } from "react-konva";

const Ruler = React.memo((props) => {
  return <Group key={props.key}>
    <Arrow
      points={[props.c1.x, props.c1.y, props.c2.x, props.c2.y + 3/props.scale]}
      stroke='green'
      strokeWidth={1/props.scale}
      pointerLength={6/props.scale}
      pointerWidth={6/props.scale}
      fill='green'
    />
    <Text
      x={(props.c1.x + props.c2.x)/2}
      y={(props.c1.y + props.c2.y)/2}
      fill="#0dcaf0"
      fontSize={12/props.scale}
      fontStyle={'bold'}
      text={`${props.lengthOfRuler}mm`}
    />
    <Arrow
      points={[props.c2.x, props.c2.y, props.c1.x, props.c1.y - 3/props.scale]}
      stroke='green'
      strokeWidth={1/props.scale}
      pointerLength={6/props.scale}
      pointerWidth={6/props.scale}
      fill='green'
    />
  </Group>
})

export default Ruler;