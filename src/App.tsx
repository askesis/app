import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import * as fabric from 'fabric';
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { FabricJSCanvas } from "./FabricCanvas";
import { CanvasContextProvider, useCanvasContext } from "./CanvasContext";
import SVGModal from "./SVGModal";
import encodeImageFileAsURL from "./utils/encodeImageFileAsURL";

function SaveCanvasButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  }
  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <>
      <Button variant="primary" type="button" className="btn btn-primary" onClick={openModal}>Get Canvas SVG</Button>
      <SVGModal isOpen={isOpen} handleClose={closeModal} />
    </>
  )
}

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
      <Button variant="outline-primary" className="me-2" onClick={handleClickUndo} disabled={historyUndo.length <= 1}>Undo</Button>
      <Button variant="outline-primary" onClick={handleClickRedo} disabled={historyRedo.length === 0}>Redo</Button>
    </div>
  )
}

function App() {
  return (
    <Container fluid className="pt-3" >
      <CanvasContextProvider>
        <Row>
          <Col className="mb-4">
            <CanvasControlsTop />
            <FabricJSCanvas />
            <CanvasControlsBottom />
          </Col>
          <Col>
            <Sidebar />
          </Col>
        </Row>
      </CanvasContextProvider>
    </Container>
  );
}

function CanvasControlsTop() {
  const { canvas } = useCanvasContext();

  const handleClickResetZoom = () => {
    canvas?.setViewportTransform([1, 0, 0, 1, 0, 0]);
  }

  return (
    <div className="canvas-controls-top d-flex justify-content-between mb-2 ">
      <History />
      <Button variant="outline-primary" type="button" onClick={handleClickResetZoom}>Reset Zoom</Button>
    </div>
  )
}

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
        variant="outline-danger" 
        type="button" 
        onClick={handleClick}
        className="me-2"
      >
        Remove selected object
      </Button>
      <SaveCanvasButton />
    </div>
  )
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
  const [files, setFiles] = useState<(string)[]>([]);
  const { canvas } = useCanvasContext();

  const handleChangeInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
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

  return (
    <div id="sidebar" className="sidebar">
      <h3>Images</h3>

      {files.length === 0 ? '' : <div>Click on image to add on canvas</div>}

      <div className="sidebar-images">
        {files.map(objURL => <img key={objURL} src={objURL} alt="Image" onClick={handleClickImage(objURL)} />)}
      </div>

      <div>
        <Button as="label" htmlFor="add-image">Choose file (JPG, PNG, SVG) </Button>

        <input id="add-image" onChange={handleChangeInputFile} type="file" accept="image/png, image/jpeg" />
      </div>
    </div>
  )
}

export default App;
