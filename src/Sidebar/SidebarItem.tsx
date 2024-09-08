import SidebarImageView from "./SidebarImageView"
import SidebarTextView from "./SidebarTextView"

interface Props {
  file: File
}

function SidebarItem({ file }: Props) {
  if (file.type === 'text/plain') {
    return <SidebarTextView key={file.name} file={file} />
  }

  return <SidebarImageView key={file.name} file={file} />
}

export default SidebarItem