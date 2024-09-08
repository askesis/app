import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import { useCanvasContext } from "../CanvasContext";

function History() {
  const { canvas } = useCanvasContext();
  const [historyUndo, setHistoryUndo] = useState<string[]>([]);
  const [historyRedo, setHistoryRedo] = useState<string[]>([]);

  useEffect(() => {
    if (canvas && historyUndo.length === 0) {
      const json = JSON.stringify(canvas?.toDatalessJSON(['selectable', 'editable']))
      setHistoryUndo([json]);
    }
  }, [canvas, historyUndo.length]);

  useEffect(() => {
    canvas?.on('object:modified', () => {
      console.log('object:modified');

      const json = JSON.stringify(canvas.toDatalessJSON(['selectable', 'editable']));

      setHistoryUndo(prev => [...prev, json]);
      setHistoryRedo([])
    })
  }, [canvas])

  const handleClickUndo = () => {
    const prevHistory = historyUndo.at(-2) as string;

    canvas?.loadFromJSON(prevHistory).then(function (canvas_) {
      canvas_.renderAll();
      setHistoryRedo(prev => [...prev, historyUndo.at(-1) as string]);
      setHistoryUndo(prev => prev.slice(0, historyUndo.length - 1));
    });
  }

  const handleClickRedo = () => {
    const nextSnapshot = historyRedo.at(-1) as string;

    canvas?.loadFromJSON(nextSnapshot).then(function (canvas_) {
      canvas_.renderAll();
      setHistoryRedo(prev => prev.slice(0, historyRedo.length - 1));
      setHistoryUndo(prev => [...prev, nextSnapshot]);
    });

  }

  return (
    <div>
      <Button variant="outline-primary" onClick={handleClickUndo} disabled={historyUndo.length <= 1} className="me-2">Undo</Button>
      <Button variant="outline-primary" onClick={handleClickRedo} disabled={historyRedo.length === 0}>Redo</Button>
    </div>
  )
}

export default History;