import { useState } from "react";
import { Button } from "react-bootstrap";

import SVGModal from "../SVGModal";

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
      <Button 
        className="btn btn-primary" 
        variant="primary" 
        type="button" 
        onClick={openModal}
      >
        Get Canvas SVG
      </Button>
      <SVGModal isOpen={isOpen} handleClose={closeModal} />
    </>
  )
}

export default SaveCanvasButton;