import React, { useEffect, useMemo } from 'react';
import Konva from 'konva';
import { Stage, Layer, Line } from 'react-konva';

const Ruler = React.memo(({ c1, c2, segments }) => {
  const rulerResult = useMemo(()=>{
    const linesArray = [];
    // Tính toán các điểm trên thước kẻ dựa trên c1, c2 và số đoạn chia
    const dx = (c2.x - c1.x) / (segments - 1);
    const dy = (c2.y - c1.y) / (segments - 1);
    const points = [];
    for (let i = 0; i < segments; i++) {
      points.push({ x: c1.x + i * dx, y: c1.y + i * dy });
    }

    // Vẽ các đường thẳng vuông góc với đường nối c1 và c2
    const lines = [];
    const midPoint = { x: (c1.x + c2.x) / 2, y: (c1.y + c2.y) / 2 };
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const dx = p.x - midPoint.x;
      const dy = p.y - midPoint.y;
      const nx = dy;
      const ny = -dx;
      const length = Math.sqrt(nx * nx + ny * ny);
      const sx = nx / length;
      const sy = ny / length;
      const x1 = p.x - 5 * sx;
      const y1 = p.y - 5 * sy;
      const x2 = p.x + 5 * sx;
      const y2 = p.y + 5 * sy;
      lines.push({ x1, y1, x2, y2 });
    }

    // Vẽ các đường thẳng trên canvas
    lines.forEach((line) => {
      const { x1, y1, x2, y2 } = line;
      linesArray.push(
        <Line
          key={x1+y1+x2+y2+Math.random(1,1000)}
          points={[x1, y1, x2, y2]}
          stroke='black'
          strokeWidth={2}
        />
      )
    });
    return linesArray
  },[c1, c2, segments])
  console.log("🚀 ~ file: Ruler.jsx:49 ~ rulerResult ~ rulerResult:", rulerResult)

  return rulerResult
})

export default Ruler;
