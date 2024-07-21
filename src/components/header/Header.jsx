import { Navbar, Container, Button, Nav, Badge } from "react-bootstrap";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { ConnectKitButton } from "connectkit";
import "./Header.css";


function Header() {

  /* Depois fazer isso usando Hook
  // const [sidebar, setSidebar] = useState(false);
  // const showSidebar = () => setSidebar(!sidebar);
  */
  const handleButtonClick = () => {
    const sidebar = document.getElementById("side_nav");
    if (sidebar) {
      sidebar.classList.toggle("active");
    }
  };

  return (
    <>
      <Navbar expand="md" bg="rgb(255, 255, 255)" variant="light">
        <Container
          fluid
          className="d-flex justify-content-between justify-content-md-end align-items-center"
        >
          <div className="d-flex justify-content-between d-md-none d-block">
            <Button
              className="ham-menu btn btn-link px-1 py-0 mb-2 open-btn no-hover text-decoration-none"
              onClick={handleButtonClick}
            >
              <HiOutlineMenuAlt2 size={24} color="#6b7280" />
            </Button>
          </div>
          <div className="d-flex justify-content-end  mb-2 mb-lg-0">
            <Badge className="connect_wallet_btn fs-6 fs-md-4 py-2"></Badge>
            <ConnectKitButton className="border border-warning" />
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
