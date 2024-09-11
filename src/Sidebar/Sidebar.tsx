import { ChangeEvent, useState } from "react";
import { Button } from "react-bootstrap";

import SidebarItem from "./SidebarItem";

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

      <SidebarItems files={files} />

      <div>
        <Button as="label" htmlFor="add-image">Choose file (JPG, PNG, SVG, TXT)</Button>

        <input id="add-image" onChange={handleChangeInputFile} type="file" accept="image/png, image/jpeg, image/svg+xml, text/plain" />
      </div>
    </div>
  )
}

function SidebarItems({ files }: { files: File[] }) {
  return (
    <div className="sidebar-items">
      {files.map(file => <SidebarItem key={file.name} file={file} />)}
    </div>
  )
}

export default Sidebar;