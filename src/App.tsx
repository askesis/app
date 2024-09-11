import { Col, Container, Row } from "react-bootstrap";

import FabricCanvas from "./FabricCanvas";
import Sidebar from "./Sidebar/Sidebar";

import CanvasControlsTop from "./CanvasControls/CanvasControlsTop";
import CanvasControlsBottom from "./CanvasControls/CanvasControlsBottom";

import { CanvasContextProvider } from "./CanvasContext";

function App() {
  return (
    <Container fluid className="pt-3" >
      <CanvasContextProvider>
        <Row>
          <Col className="mb-4">
            <CanvasControlsTop />
            <FabricCanvas />
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

export default App;