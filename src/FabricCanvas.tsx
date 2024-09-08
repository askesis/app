import { useContext, useEffect, useRef } from 'react';
import * as fabric from 'fabric'; // v6

import CanvasContext from './CanvasContext';

const addCanvasZoom = (canvas: fabric.Canvas) => {
  let isDragging = false;
  let lastPosX: number, lastPosY: number;

  // scaling
  canvas?.on('mouse:wheel', function (opt) {
    const { deltaY, offsetX, offsetY } = opt.e;
    let zoom = canvas.getZoom();
    zoom = zoom * (0.999 ** deltaY);

    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;

    const point = new fabric.Point(offsetX, offsetY);
    canvas.zoomToPoint(point, zoom);

    opt.e.preventDefault();
    opt.e.stopPropagation();
  });


  // panning 
  canvas?.on('mouse:down', function (opt) {
    const evt = opt.e;
    if (evt.altKey === true) {
      isDragging = true;
      canvas.selection = false;

      lastPosX = opt.scenePoint.x;
      lastPosY = opt.scenePoint.y;
    }
  });
  canvas?.on('mouse:move', function (opt) {
    if (isDragging) {
      const vpt = canvas.viewportTransform;
      vpt[4] += opt.scenePoint.x - lastPosX;
      vpt[5] += opt.scenePoint.y - lastPosY;
      canvas.requestRenderAll();
      lastPosX = opt.scenePoint.x;
      lastPosY = opt.scenePoint.y;

    }
  });
  canvas?.on('mouse:up', function () {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform 
    canvas.setViewportTransform(canvas.viewportTransform);
    isDragging = false
    canvas.selection = true;
  });
}

export const FabricJSCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    addCanvasZoom(canvas);

    return () => {
      updateCanvasContext(null);
      canvas.dispose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  return <canvas id="canvas" width="600" height="600" ref={canvasRef} />
};