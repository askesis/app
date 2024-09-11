import { ReactElement, createContext, useContext, useState } from "react";
import * as fabric from 'fabric';

import FabricHistory from "./FabricHistory";

type Canvas = fabric.Canvas | null;

const defaultHistory = new FabricHistory(new fabric.Canvas());

const CanvasContext = createContext<{ 
    canvas: Canvas,
    history: FabricHistory;
    updateCanvasContext: (canvas: Canvas) => void 
}>
  ({ 
    canvas: null, 
    history: defaultHistory,
    updateCanvasContext: () => void 0 
  });


const CanvasContextProvider = ({ children }: { children: ReactElement }) => {
  const [canvas, setCanvas] = useState<Canvas>(null);
  const [history, setHistory] = useState<FabricHistory>(defaultHistory);

  const updateCanvasContext = (canvas: Canvas): void => {
    setCanvas(canvas);

    if (canvas !== null) {
      setHistory(new FabricHistory(canvas));
    }
  }

  return (
    <CanvasContext.Provider value={{ canvas, history, updateCanvasContext }}>
      {children}
    </CanvasContext.Provider>
  )
}

const useCanvasContext = () => {
  const ctx = useContext(CanvasContext);

  return ctx;
}

export { CanvasContextProvider, useCanvasContext };

export default CanvasContext;

