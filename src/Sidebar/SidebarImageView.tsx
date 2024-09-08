import * as fabric from 'fabric';

import { useCanvasContext } from "../CanvasContext";

interface Props {
  file: File
}

function SidebarImageView({ file }: Props) {
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

export default SidebarImageView;