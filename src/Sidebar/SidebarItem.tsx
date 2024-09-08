import SidebarImageView from "./SidebarImageView"
import SidebarTextView from "./SidebarTextView"

interface Props {
  file: File
}

function SidebarItem({ file }: Props) {
  if (file.type === 'text/plain') {
    return <SidebarTextView file={file} />
  }

  return <SidebarImageView file={file} />
}

export default SidebarItem