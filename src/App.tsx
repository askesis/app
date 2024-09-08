import { Col, Container, Row } from "react-bootstrap";

import { FabricJSCanvas } from "./FabricCanvas";
import { CanvasContextProvider } from "./CanvasContext";
import Sidebar from "./Sidebar/Sidebar";

import CanvasControlsTop from "./CanvasControls/CanvasControlsTop";
import CanvasControlsBottom from "./CanvasControls/CanvasControlsBottom";

function App() {
  return (
    <Container fluid className="pt-3" >
      <CanvasContextProvider>
        <Row>
          <Col className="mb-4">
            <CanvasControlsTop />
            <FabricJSCanvas />
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