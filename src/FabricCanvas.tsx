import React, { useContext, useEffect, useRef } from 'react';
import * as fabric from 'fabric'; // v6
import CanvasContext from './CanvasContext';

export const FabricJSCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { updateCanvasContext } = useContext(CanvasContext);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current);

    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 70,
      height: 70,
      fill: 'red',
    });

    canvas.add(rect)
    updateCanvasContext(canvas);

    return () => {
      updateCanvasContext(null);
      canvas.dispose();
    }
  }, []);

  return <canvas id="canvas" width="600" height="600" ref={canvasRef} />
};