import { ChangeEvent, useEffect, useState } from "react";
import * as fabric from 'fabric';
import { Button, Col, Container, Row } from "react-bootstrap";

import { FabricJSCanvas } from "./FabricCanvas";
import { CanvasContextProvider, useCanvasContext } from "./CanvasContext";
import SVGModal from "./SVGModal";

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

function Sidebar() {
  const [files, setFiles] = useState<File[]>([]);

  const handleChangeInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFiles([...files, file])
    }
  };

  return (
    <div id="sidebar" className="sidebar">
      <h3>Images</h3>

      {files.length === 0 ? '' : <b>Click on a file to add on canvas</b>}

      <div className="sidebar-items">
        {files.map(file => <SidebarItem file={file} />)}
      </div>

      <div>
        <Button as="label" htmlFor="add-image">Choose file (JPG, PNG, SVG, TXT)</Button>

        <input id="add-image" onChange={handleChangeInputFile} type="file" accept="image/png, image/jpeg, .svg, text/plain" />
      </div>
    </div>
  )
}

function SidebarItem({ file }: { file: File }) {
  if (file.type === 'text/plain') {
    return <SidebarTextView key={file.name} file={file} />
  }

  return <SidebarImageView key={file.name} file={file} />
}

fabric.FabricImage.prototype.getSrc = function (filtered: boolean) {
  const element = filtered ? this._element : this._originalElement;
  if (element) {
    if ((element as HTMLCanvasElement).toDataURL) {
      return (element as HTMLCanvasElement).toDataURL();
    }

    if (this.srcFromAttribute) {
      return element.getAttribute('src') || '';
    } else {
      return toDataURL((element as HTMLImageElement));
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this.src || '';
  }
}

function toDataURL(src: HTMLImageElement) {
  const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  canvas.width = src.naturalWidth;
  canvas.height = src.naturalHeight;

  ctx?.drawImage(src, 0, 0);
  return canvas.toDataURL('image/jpeg')
}

function SidebarImageView({ file }: { file: File }) {
  const { canvas } = useCanvasContext();

  const elementId = file.name.replace('.', '');

  const handleClickImage = () => {
    const img = new Image();

    img.onerror = (e) => console.log(e)

    img.onload = () => {
      const fabricImg = new fabric.FabricImage(img, { width: img.naturalWidth, height: img.naturalHeight });

      fabricImg.scaleToHeight(150);
      canvas?.add(fabricImg);
    }

    img.src = URL.createObjectURL(file)
  }

  return (
    <div className="sidebar-item">
      <img id={elementId} src={URL.createObjectURL(file)} onClick={handleClickImage} alt='' />
    </div>
  )
}

function SidebarTextView({ file }: { file: File }) {
  const [text, setText] = useState<string>('');
  const { canvas } = useCanvasContext();

  useEffect(() => {
    file.text().then(res => setText(res))
  }, [file])

  const handleTextFileClick = () => {
    const textObj = new fabric.FabricText(text);

    if (textObj.height > 600 || textObj.width > 600) {
      if (textObj.height > textObj.width) {
        textObj.scaleToHeight(500);
      } else {
        textObj.scaleToWidth(500);
      }
    }

    canvas?.add(textObj)
  }

  return (
    <div className="sidebar-item" onClick={handleTextFileClick}>
      <div className="text-view-card">
        <div className="text-view-card-name">
          {file.name}
        </div>
        <div className="text-view-card-content">
          {text.slice(0, 100)}
        </div>
      </div>
    </div>
  );
}

export default App;
