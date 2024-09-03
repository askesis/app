import * as fabric from 'fabric';

import { ReactElement, createContext, useContext, useState } from "react";

type Canvas = fabric.Canvas | null;

const CanvasContext = createContext<{ 
    canvas: Canvas,
    updateCanvasContext: (canvas: Canvas) => void 
}>
  ({ canvas: null, updateCanvasContext: () => void 0 });


const CanvasContextProvider = ({ children }: { children: ReactElement }) => {
  const [canvas, setCanvas] = useState<Canvas>(null);

  const updateCanvasContext = (canvas: Canvas): void => {
    setCanvas(canvas);
  }

  return <CanvasContext.Provider value={{ canvas, updateCanvasContext }}>{children}</CanvasContext.Provider>
}

const useCanvasContext = () => {
  const ctx = useContext(CanvasContext);

  return ctx;
}

export { CanvasContextProvider, useCanvasContext };

export default CanvasContext;

