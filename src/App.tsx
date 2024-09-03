import { ChangeEvent, Ref, useContext, useState } from "react";
import "./App.css";

import { FabricJSCanvas } from "./FabricCanvas";
import * as fabric from 'fabric';
import CanvasContext, { CanvasContextProvider, useCanvasContext } from "./CanvasContext";

function App() {


  return (
    <div className="App">
      <CanvasContextProvider>
        <>
          <FabricJSCanvas />

          <LoadImageButton />
        </>
      </CanvasContextProvider>
    </div>
  );
}

function LoadImageButton() {
  const [file, setFile] = useState<File>()
  const { canvas } = useCanvasContext();

  const handleChangeInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);

      const url = URL.createObjectURL(file);

      const img = await fabric.FabricImage.fromURL(url);

      canvas?.add(img);
    }
  };

  return (
    <div>
      <div>{file && `${file.name} - ${file.type}`}</div>
      <input onChange={handleChangeInputFile} type="file" accept="image/png, image/jpeg" />
    </div>
  )
}

export default App;
