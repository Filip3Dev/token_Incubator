import { Container, Badge, Button, ListGroup, Nav, Col } from "react-bootstrap";
import { PiChartLineUp } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { CiCirclePlus } from "react-icons/ci";
import { PiCoins } from "react-icons/pi";
import { PiPresentationChartLight } from "react-icons/pi";
import { LinkContainer } from "react-router-bootstrap";
import "./Sidebar.css";

function Sidebar() {
  
  const handleButtonClick = () => {
    const sidebar = document.getElementById("side_nav");
    if (sidebar) {
      sidebar.classList.toggle("active");
    }
  };

  return (
    <Container className="sidebar" id="side_nav">
      <Col className="header-box px-2 pt-3 pb-4 d-flex justify-content-between justify-content-md-center">
        <h1 className="fs-4 text-center">
          <Badge className="bg-white text-dark rounded px-2 me-2 border border-warning">
            Token Incubator
          </Badge>
        </h1>
        <Button
          className="btn btn-link d-md-none d-block close-btn px-1 py-0 text-white text-decoration-none"
          onClick={handleButtonClick}
        >
          <RxCross1 size={24} color="#6b7280" />
        </Button>
      </Col>
      <ListGroup className="px-2">
        <ListGroup.Item className="border-0">
          <LinkContainer to="/">
            <Nav.Link className="d-flex flex-row align-items-center gap-2 rounded text-decoration-none px-3 py-2 d-block">
              <PiChartLineUp size={24} />
              Mercado
            </Nav.Link>
          </LinkContainer>
        </ListGroup.Item>
        <ListGroup.Item className="border-0">
          <LinkContainer to="/createtoken">
            <Nav.Link className="d-flex flex-row align-items-center gap-2 text-decoration-none px-3 py-2 d-block">
              <CiCirclePlus size={30} />
              Criar Token
            </Nav.Link>
          </LinkContainer>
        </ListGroup.Item>
        <ListGroup.Item className="border-0">
          <LinkContainer to="/wallet">
            <Nav.Link className="d-flex flex-row align-items-center gap-2 text-decoration-none px-3 py-2 d-block">
              <PiCoins size={30} />
              Meus Tokens
            </Nav.Link>
          </LinkContainer>
        </ListGroup.Item>
        <ListGroup.Item className="border-0">
          <LinkContainer to="/metrics">
            <Nav.Link className="d-flex flex-row align-items-center gap-2 text-decoration-none px-3 py-2 d-block">
              <PiPresentationChartLight size={28} />
              Métricas
            </Nav.Link>
          </LinkContainer>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
}

export default Sidebar;
