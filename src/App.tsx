import { ChangeEvent, MouseEventHandler, useState } from "react";
import "./App.css";

import { FabricJSCanvas } from "./FabricCanvas";
import * as fabric from 'fabric';
import { CanvasContextProvider, useCanvasContext } from "./CanvasContext";

function App() {


  return (
    <div className="App">
      <CanvasContextProvider>
        <div className="container">
          <FabricJSCanvas />

          <Sidebar />
        </div>
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

function Sidebar() {
  const [files, setFiles] = useState<string[]>([]);
  const { canvas } = useCanvasContext();

  const handleChangeInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const newFiles = [...files, URL.createObjectURL(file)];

      setFiles(newFiles);
    }
  };

  const handleClickImage = (objURL: string): MouseEventHandler<HTMLImageElement> => {
    return async () => {
      const img = await fabric.FabricImage.fromURL(objURL);

      canvas?.add(img);
    }
  }

  const handleClick = () => {
    const obj = canvas?.getActiveObject();

    if (obj) {
      canvas?.remove(obj)
    }
  }

  return (
    <div id="sidebar" className="sidebar container">
      <button type="button" onClick={handleClick}>Remove selected object</button>

      <h3>Images</h3>
     
      {files.length === 0 ? '' : <div>Click on image to add on canvas</div>}

      <div className="sidebar-images">
        {files.map(objURL => <img key={objURL} src={objURL} alt="Image" onClick={handleClickImage(objURL)} />)}
      </div>

      <input onChange={handleChangeInputFile} type="file" accept="image/png, image/jpeg" />

    </div>
  )
}

export default App;
