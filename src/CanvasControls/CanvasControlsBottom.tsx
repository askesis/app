import { Button } from "react-bootstrap";

import { useCanvasContext } from "../CanvasContext";
import SaveCanvasButton from "./SaveCanvasButton";

function CanvasControlsBottom() {
  const { canvas } = useCanvasContext();

  const handleClick = () => {
    const obj = canvas?.getActiveObject();

    if (obj) {
      canvas?.remove(obj)
    }
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