import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric'; // v6

export const FabricJSCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    return () => {
      canvas.dispose();
    }
  }, []);

  return <canvas id="canvas" width="300" height="300" ref={canvasRef} />;
};