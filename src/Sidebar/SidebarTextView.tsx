import { useEffect, useState } from "react";
import * as fabric from 'fabric';

import { useCanvasContext } from "../CanvasContext";

interface Props {
  file: File
}

function SidebarTextView({ file }: Props) {
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

export default SidebarTextView;