import SidebarImageView from "./SidebarImageView"
import SidebarSVGView from "./SidebarSVGView"
import SidebarTextView from "./SidebarTextView"

interface Props {
  file: File
}

function SidebarItem({ file }: Props) {
  if (file.type === 'text/plain') {
    return <SidebarTextView file={file} />
  }

  if (file.type === 'image/svg+xml') {
    return <SidebarSVGView file={file} />
  }

  return <SidebarImageView file={file} />
}

export default SidebarItem