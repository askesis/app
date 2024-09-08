import { Button } from "react-bootstrap";

import { useCanvasContext } from "../CanvasContext";
import History from "./History";

function CanvasControlsTop() {
  const { canvas } = useCanvasContext();

  const handleClickResetZoom = () => {
    canvas?.setViewportTransform([1, 0, 0, 1, 0, 0]);
  }

  return (
    <div className="canvas-controls-top d-flex justify-content-between mb-2 ">
      <History />
      <Button 
        variant="outline-primary" 
        type="button" 
        onClick={handleClickResetZoom}
      >
        Reset Zoom
      </Button>
    </div>
  )
}

export default CanvasControlsTop