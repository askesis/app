import { Button } from "react-bootstrap";

import { useCanvasContext } from "../CanvasContext";
import SaveCanvasButton from "./SaveCanvasButton";

function CanvasControlsBottom() {
  const { canvas } = useCanvasContext();

  const handleClick = () => {
    const objects = canvas?.getActiveObjects();
    
    objects?.forEach(obj => {
      canvas?.remove(obj);
    })
    
    canvas?.discardActiveObject()
  }

  return (
    <div className="mt-2 d-flex justify-content-between canvas-control-bottom">
      <Button
        className="me-2"
        variant="outline-danger"
        type="button"
        onClick={handleClick}
      >
        Remove selected object
      </Button>

      <SaveCanvasButton />
    </div>
  )
}


export default CanvasControlsBottom;