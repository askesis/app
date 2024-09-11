import { useSyncExternalStore } from "react";
import { Button } from "react-bootstrap";

import { useCanvasContext } from "../CanvasContext";

function HistoryComp() {
  const { history } = useCanvasContext();
  const { canRedo, canUndo } = useSyncExternalStore(history?.subscribe, history?.getSnapshot);

  const handleClickUndo = () => {
    history?.undo();
  }

  const handleClickRedo = () => {
    history?.redo();
  }

  return (
    <div>
      <Button variant="outline-primary" onClick={handleClickUndo} disabled={canUndo === false} className="me-2">Undo</Button>
      <Button variant="outline-primary" onClick={handleClickRedo} disabled={canRedo === false}>Redo</Button>
    </div>
  )
}

export default HistoryComp;