import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import * as fabric from 'fabric';

import "./App.css";

import { FabricJSCanvas } from "./FabricCanvas";
import { CanvasContextProvider, useCanvasContext } from "./CanvasContext";

function SaveCanvasButton() {
  const { canvas } = useCanvasContext();

  const handleClick = () => {
    console.log(canvas?.toSVG());

  }

  return (
    <button type="button" onClick={handleClick}>Get Canvas SVG</button>
  )
}

// const historyUndo: string[] = [];
// const historyRedo = [];
const history: string[] = [];

function History() {
  const { canvas } = useCanvasContext();
  const [historyUndo, setHistoryUndo] = useState<string[]>([]);
  const [historyRedo, setHistoryRedo] = useState<string[]>([]);

  useEffect(() => {
    if (canvas && historyUndo.length === 0) {
      const json = JSON.stringify(canvas?.toDatalessJSON(['selectable', 'editable']))
      setHistoryUndo([json]);
    }
  }, [canvas]);

  useEffect(() => {
    canvas?.on('object:modified', (options) => {
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

  return <div>
    <button onClick={handleClickUndo} disabled={historyUndo.length === 1}>Undo</button>
    <button onClick={handleClickRedo} disabled={historyRedo.length === 0}>Redo</button>
  </div>
}

function App() {
  return (
    <div className="App">
      <CanvasContextProvider>
        <div className="container">
          <div>
            <FabricJSCanvas />
            <SaveCanvasButton />
            <History />
          </div>

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

function encodeImageFileAsURL(file: File, callback: (res: string) => void) {
  const reader = new FileReader();

  reader.onloadend = function () {
    if (typeof reader.result === 'string') {
      callback(reader.result.toString());
    }
  }

  reader.readAsDataURL(file);
}

function Sidebar() {
  const [files, setFiles] = useState<(string)[]>([]);
  const { canvas } = useCanvasContext();

  const handleChangeInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      encodeImageFileAsURL(file, res => setFiles([...files, res]))
    }
  };

  const handleClickImage = (objURL: string): MouseEventHandler<HTMLImageElement> => {
    return async () => {
      const img = await fabric.FabricImage.fromURL(objURL);
      img.scaleToHeight(150)
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
