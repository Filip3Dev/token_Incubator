import { useState } from "react";
import {
  Button,
  Card,
  Badge,
  OverlayTrigger,
  Tooltip,
  Col
} from "react-bootstrap";
import { IoCopyOutline } from "react-icons/io5";
import { GoCheckCircleFill } from "react-icons/go";
import {
  TbInfoSquareRoundedFilled,
  TbCircleArrowUpRightFilled
} from "react-icons/tb"; 
import { Link } from "react-router-dom"; 
import { parseUnits, formatUnits } from "viem"; 

const TokenCardItem = ({ tokenData, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenData.tokenAddress);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000); // Reverter o estado após 2 segundos
  };

  const formattedAddress = `${tokenData.tokenAddress.substring(
    0,
    7
  )}...${tokenData.tokenAddress.substring(tokenData.tokenAddress.length - 7)}`;

  // Função para formatar números com separadores de milhar
  const formatNumber = (number) => {
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Formatar totalSupply e hardCap
  const formattedTotalSupply = formatNumber(
    parseFloat(formatUnits(tokenData.totalSupply, tokenData.decimals))
  );

  const formattedHardCap = parseFloat(
    formatUnits(tokenData.hardCap, 18)
  ).toFixed(1);

  return (
    <Col xs={12} sm={6} md={6} lg={4} className="pb-4">
      <Card style={{ minWidth: "256px" }}>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <Badge
            text="dark"
            className="bg-light rounded border border-black border-opacity-25 p-1 d-flex align-items-center"
          >
            <img
              src={tokenData.image}
              alt={tokenData.name}
              className="token-icon"
              style={{ width: "20px", height: "20px", marginRight: "5px" }}
            />
            {tokenData.name}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Card.Text as="div" className="d-flex flex-column">
            <div className="d-flex align-items-center gap-1 text">
              <strong className="text-nowrap">Token:</strong>
              {tokenData.symbol}
            </div>
            <div className="d-flex align-items-center gap-1 text">
              <strong className="text-nowrap">Address:</strong>
              {formattedAddress}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip
                    id={`tooltip-copy-${index}`}
                    className="bg-opacity-10"
                  >
                    {copied ? "Endereço Copiado" : "Copiar"}
                  </Tooltip>
                }
              >
                <Button
                  variant="link"
                  className="p-0 ms-2"
                  onClick={handleCopy}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    width: "32px",
                    height: "32px"
                  }}
                >
                  {copied ? (
                    <GoCheckCircleFill size={18} style={{ color: "#00a186" }} />
                  ) : (
                    <IoCopyOutline size={15} style={{ color: "grey" }} />
                  )}
                </Button>
              </OverlayTrigger>
            </div>
            <div className="d-flex align-items-center gap-1">
              <strong>Total Supply:</strong> {formattedTotalSupply}
            </div>
            <div className="d-flex align-items-center gap-1">
              <strong>Hard Cap:</strong> {formattedHardCap} ETH
            </div>
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button
            as={Link}
            to={`/tokendetails/${tokenData.tokenAddress}`}
            size="sm"
            className="d-flex align-items-center justify-content-center gap-1 text-black bg-info bg-opacity-10 border-info border-opacity-50"
          >
            Detalhes <TbInfoSquareRoundedFilled />
          </Button>
          <Button
            as={Link}
            to={`/tokenbuy/${tokenData.tokenAddress}`}
            size="sm"
            className="d-flex align-items-center justify-content-center gap-1 text-success bg-success bg-opacity-10 border-success border-opacity-50"
          >
            Comprar <TbCircleArrowUpRightFilled />
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default TokenCardItem;
