import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Table,
  Collapse,
  Button,
  Image
} from "react-bootstrap";
import { TfiMoney } from "react-icons/tfi";
import { PiCoinsThin } from "react-icons/pi";
import { FaRegEye } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import { useState } from "react";

function Metrics() {
  const [open, setOpen] = useState(false);
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-between flex-column "
    >
      <Col xs={12} className="mb-2">
        <h3>Métricas</h3>
      </Col>
      <Container fluid className="px-0">
        <Row className="d-flex flex-wrap justify-content-between gap-2">
          <Col>
            <Card>
              <Card.Body className="d-flex flex-row align-items-center">
                <div>
                  <Badge className="d-flex  align-items-center text-warning text-opacity-75 bg-warning bg-opacity-25 rounded px-2 me-2">
                    <TfiMoney size={28} />
                  </Badge>
                </div>
                <div className="d-flex flex-column">
                  <Card.Subtitle className="mb-2 text-muted text-nowrap">
                    Valor captado
                  </Card.Subtitle>
                  <Card.Title className="text-nowrap">R$ 1.000,25</Card.Title>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body className="d-flex flex-row align-items-center">
                <div>
                  <Badge className="text-danger text-opacity-75 bg-danger bg-opacity-25 rounded px-2 me-2">
                    <PiCoinsThin size={30} />
                  </Badge>
                </div>
                <div className="d-flex flex-column">
                  <Card.Subtitle className="mb-2 text-muted text-nowrap">
                    Total de Tokens
                  </Card.Subtitle>
                  <Card.Title className="text-nowrap">R$ 1.000,25</Card.Title>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body className="d-flex flex-row align-items-center">
                <div>
                  <Badge className="d-flex  align-items-center text-success text-opacity-75 bg-success bg-opacity-25 rounded  px-2 me-2">
                    <CiWallet size={28} />
                  </Badge>
                </div>
                <div className="d-flex flex-column">
                  <Card.Subtitle className="mb-2 text-muted text-nowrap">
                    Retiradas
                  </Card.Subtitle>
                  <Card.Title className="text-nowrap">R$ 1.000,25</Card.Title>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container fluid className="px-0">
        <Row className="d-flex flex-wrap justify-content-between gap-2 mt-5">
          <Col xs={12} className="mb-2">
            <h5>Hitórico de Transações</h5>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Metrics;
