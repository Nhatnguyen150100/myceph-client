import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Shape, Transformer } from 'react-konva';

const CustomShape = () => {
  const [isSelected, setIsSelected] = useState(false);
  const shapeRef = useRef();
  const transformerRef = useRef();

  const handleSelect = () => {
    setIsSelected(true);
  };

  const handleDeselect = () => {
    setIsSelected(false);
  };

  useEffect(()=>{
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  },[isSelected])

  const handleTransform = () => {
    const node = shapeRef.current;
    const transformer = transformerRef.current;

    // update shape properties based on transformer changes
    const scaleX = transformer.scaleX();
    const scaleY = transformer.scaleY();
    const rotation = transformer.rotation();
    const x = transformer.x();
    const y = transformer.y();

    node.setAttrs({
      scaleX,
      scaleY,
      rotation,
      x,
      y,
    });
  };

  return (
    <>
      <Shape
        x={100}
        y={100}
        height={100}
        width={150}
        ref={shapeRef}
        draggable
        onClick={handleSelect}
        onTap={handleSelect}
        onDblClick={handleDeselect}
        onDblTap={handleDeselect}
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(20, 50);
          context.lineTo(220, 80);
          context.quadraticCurveTo(150, 100, 260, 170);
          context.closePath();
          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
        fill="#00D2FF"
        stroke="black"
        strokeWidth={4}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}// disable rotation
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          keepRatio={false} // disable aspect ratio locking
          onTransformEnd={handleTransform}
        />
      )}
    </>
  );
};

export default CustomShape;