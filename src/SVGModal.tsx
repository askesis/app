import React, { FC, useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useCanvasContext } from './CanvasContext'

interface Props {
  isOpen: boolean
  handleClose: () => void;
}

const SVGModal: FC<Props> = ({ isOpen, handleClose }) => {
  const { canvas } = useCanvasContext();
  const ref = useRef<HTMLTextAreaElement>(null);

  const svg = canvas?.toSVG();

  useEffect(() => { 
    ref.current?.select() 
  }, [isOpen])

  return (
    <Modal centered dialogClassName="svg-modal" size="lg" show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Copy SVG</Modal.Title>
      </Modal.Header>
      <Modal.Body><textarea ref={ref} autoFocus defaultValue={svg} /></Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

  )
}

export default SVGModal