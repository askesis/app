import * as fabric from 'fabric';

import { useCanvasContext } from "../CanvasContext";

interface Props {
  file: File
}

function SidebarSVGView({ file }: Props) {
  const { canvas } = useCanvasContext();

  const elementId = file.name.replace('.', '');

  const handleClickImage = () => {
    const url = URL.createObjectURL(file);

    fabric.loadSVGFromURL(url).then(res => {
      if (res.objects.every(i => i !== null)) {
        const grouped = fabric.util.groupSVGElements(res.objects as fabric.Object[], res.options);
        
        grouped.scaleToHeight(150);

        canvas?.add(grouped);
      }
    })
  }

  return (
    <div className="sidebar-item">
      <img id={elementId} src={URL.createObjectURL(file)} onClick={handleClickImage} alt='' />
    </div>
  )
}

export default SidebarSVGView;