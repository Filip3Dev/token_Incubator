import { useState, useEffect, useCallback } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LiaTelegram } from "react-icons/lia";
import { BsTwitterX } from "react-icons/bs";
import { RiFilePaper2Line } from "react-icons/ri"; // Whitepaper
import { TfiWorld } from "react-icons/tfi"; // Website
import { VscGithub } from "react-icons/vsc";
import { RxDiscordLogo } from "react-icons/rx"; // Discord
import { FaCircleCheck } from "react-icons/fa6"; // Confirmation Icon
import { HiOutlineExternalLink } from "react-icons/hi";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  OverlayTrigger,
  Tooltip,
  Toast
} from "react-bootstrap";
import { useWalletClient } from "wagmi";
import { ConnectKitButton } from "connectkit";
import {
  parseUnits,
  parseEther,
  createPublicClient,
  http,
  decodeEventLog
} from "viem";
import addressJson from "../../util/artifacts/deployed_addresses.json";
import tokenContractABIJson from "../../util/artifacts/ABI.json";

const tokenAddress = addressJson["TestTokenModule#TestToken"];
const tokenContractABI = tokenContractABIJson.abi;

const client = createPublicClient({
  transport: http(`https://1440002.rpc.thirdweb.com`),

});

function createTokenYour() {
  const { data: walletClient } = useWalletClient();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [totalSupply, setTotalSupply] = useState("");
  const [formattedTotalSupply, setFormattedTotalSupply] = useState("");
  const [hardCap, setHardCap] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [whitepaper, setWhitepaper] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [discord, setDiscord] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [toasts, setToasts] = useState([]); // State to manage toasts

  console.log("walletClient", walletClient);

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const createToken = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (decimals < 2 || decimals > 18) {
      setError("O campo 'Decimais' deve ser no mínimo 2 e no máximo 18.");
      return;
    }

    if (parseInt(totalSupply.replace(/\./g, ""), 10) < 1) {
      setError("O campo 'Total Supply' deve ser no mínimo 1.");
      return;
    }

    const args = [
      name,
      symbol,
      parseInt(decimals),
      parseUnits(totalSupply.replace(/\./g, ""), decimals),
      parseEther(hardCap.replace(",", "."))
    ];

    console.log("Valores passados para a função writeContract:", {
      name,
      symbol,
      decimals: parseInt(decimals),
      totalSupply: parseUnits(
        totalSupply.replace(/\./g, ""),
        decimals
      ).toString(),
      hardCap: parseEther(hardCap.replace(",", ".")).toString(),
      value: parseEther("0.3").toString()
    });

    try {
      setError("");
      await walletClient.writeContract({
        abi: tokenContractABI,
        address: tokenAddress,
        functionName: "createToken",
        args,
        value: parseEther("0.3"), // Especifica que o valor a ser pago é 0,3 ETH
        gas: 4_000_000n
      });

      // Delay para permitir a confirmação da transação
      await new Promise((resolve) => setTimeout(resolve, 15000));

      // Buscar o log mais recente
      await fetchLogs();
    } catch (error) {
      console.error(error);
      setError(
        "Ocorreu um erro ao criar o token. Verifique o console para mais detalhes."
      );
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    if (url.startsWith("data:image")) {
      setError("Imagens base64 não são suportadas.");
      return;
    }
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value.toUpperCase());
  };

  const handleTotalSupplyChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setTotalSupply(value);
    setFormattedTotalSupply(formatNumber(value));
  };

  const handleDecimalsChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    if (value <= 18) {
      setDecimals(value);
    }
  };

  const handleHardCapChange = (e) => {
    let value = e.target.value.replace(/[^0-9,.]/g, "");
    value = value.replace(/\./g, ",");
    value = value.replace(/,(?=.*,)/g, "");
    setHardCap(value);
  };

  const fetchLogs = useCallback(async () => {
    try {
      const latestBlock = await client.getBlockNumber();
      const fromBlock = latestBlock - 10000n > 0n ? latestBlock - 10000n : 0n;
      const toBlock = latestBlock;

      console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);

      const rawLogs = await client.getLogs({
        address: tokenAddress,
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: `0x${toBlock.toString(16)}`
      });

      const filteredLogs = rawLogs
        .map((log) => {
          const decodedLog = decodeEventLog({
            abi: tokenContractABI,
            data: log.data,
            topics: log.topics
          });

          return {
            transactionHash: log.transactionHash,
            tokenAddress: decodedLog.args.tokenAddress,
            owner: decodedLog.args.owner,
            blockNumber: log.blockNumber
          };
        })
        .filter(
          (log) =>
            log.tokenAddress &&
            log.owner.toLowerCase() ===
              walletClient.account.address.toLowerCase()
        )
        .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

      if (filteredLogs.length > 0) {
        const latestLog = filteredLogs[0];

        const dataToSend = {
          owner: {
            address: latestLog.owner,
            tokens: [
              {
                tokenAddress: latestLog.tokenAddress,
                transactionHash: latestLog.transactionHash,
                image: imageUrl, // URL da imagem fornecida pelo usuário
                name,
                symbol,
                decimals: parseInt(decimals),
                totalSupply: parseUnits(
                  totalSupply.replace(/\./g, ""),
                  decimals
                ).toString(),
                hardCap: parseEther(hardCap.replace(",", ".")).toString(),
                description,
                telegram,
                twitter,
                whitepaper,
                website,
                github,
                discord
              }
            ]
          }
        };

        // Enviar dados para o endpoint
        await fetch("https://api-backend-theta.vercel.app/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        });

        console.log("Log mais recente:", latestLog);

        // Adicionar o toast de confirmação
        setToasts((prevToasts) => [
          ...prevToasts,
          {
            title: "Transação Confirmada!",
            message: "Seu token foi criado com sucesso. 🎉",
            color: "b1ffb18f",
            transactionHash: latestLog.transactionHash
          }
        ]);
      }
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    }
  }, [
    walletClient,
    imageUrl,
    name,
    symbol,
    decimals,
    totalSupply,
    hardCap,
    description,
    telegram,
    twitter,
    whitepaper,
    website,
    github,
    discord
  ]);

  const handleHideToast = (index) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index));
  };

  const isFormValid =
    imageUrl &&
    name &&
    symbol &&
    decimals >= 2 &&
    decimals <= 18 &&
    totalSupply &&
    hardCap;

  return (
    <Container className="pb-3">
      <Col xs={12} className="mb-2 pb-2">
        <h3>Lance Seu token em segundos</h3>
      </Col>
      <Card>
        <Card.Header>Criar Token</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form noValidate validated={validated} onSubmit={createToken}>
            <Row className="mb-3">
              <Col md={12}>
                <Card className="p-3 text-center text-md-start">
                  <div className="d-flex flex-column flex-column-reverse align-items-center align-items-md-start">
                    <Form.Group style={{ width: "100%" }}>
                      <Form.Label>URL da Imagem *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="https://example.com/image.png"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        style={{
                          border: "1px dashed #ddd",
                          padding: "10px",
                          borderRadius: "10px"
                        }}
                        required
                        isInvalid={validated && !imageUrl}
                      />
                      <Form.Control.Feedback type="invalid">
                        URL da imagem é obrigatória.
                      </Form.Control.Feedback>
                    </Form.Group>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Token Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "10px",
                          marginTop: "10px"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          border: "1px dashed #ddd",
                          padding: "20px",
                          borderRadius: "10px",
                          marginTop: "10px"
                        }}
                      >
                        <IoCloudUploadOutline
                          style={{ width: "50px", height: "50px" }}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Token *</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    isInvalid={validated && !name}
                  />
                  <Form.Control.Feedback type="invalid">
                    Nome do token é obrigatório.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Símbolo do Token *</Form.Label>
                  <Form.Control
                    type="text"
                    value={symbol}
                    onChange={handleSymbolChange}
                    required
                    isInvalid={validated && !symbol}
                  />
                  <Form.Control.Feedback type="invalid">
                    Símbolo do token é obrigatório.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Decimais (2 a 18) *</Form.Label>
                  <Form.Control
                    type="text"
                    value={decimals}
                    onChange={handleDecimalsChange}
                    required
                    isInvalid={validated && (decimals < 2 || decimals > 18)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Decimais devem estar entre 2 e 18.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Supply *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formattedTotalSupply}
                    onChange={handleTotalSupplyChange}
                    required
                    isInvalid={validated && !totalSupply}
                  />
                  <Form.Control.Feedback type="invalid">
                    Total Supply é obrigatório.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Meta máxima (XRPL) *{" "}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-top">
                          Valor que deseja arrecadar na prevenda do seu token
                        </Tooltip>
                      }
                    >
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                      >
                        ?
                      </span>
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={hardCap}
                    onChange={handleHardCapChange}
                    required
                    isInvalid={validated && !hardCap}
                  />
                  <Form.Control.Feedback type="invalid">
                    Meta máxima é obrigatória.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição do Token</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={620}
                    placeholder="Digite uma descrição do token (máximo 620 caracteres)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <RiFilePaper2Line /> Whitepaper
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={whitepaper}
                    onChange={(e) => setWhitepaper(e.target.value)}
                    placeholder="www.yortoken.com/whitepaper.pdf"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <TfiWorld /> Website
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="www.yortoken.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <VscGithub /> GitHub
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="github.com/yortoken"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <RxDiscordLogo /> Discord
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    placeholder="discord.gg/yortoken"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <LiaTelegram /> Telegram
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="t.me/yortoken"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <BsTwitterX /> Twitter (X)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="x.com/yortoken"
                  />
                </Form.Group>
              </Col>
            </Row>
            {walletClient ? (
              <Button variant="primary" type="submit" disabled={!isFormValid}>
                Criar Token
              </Button>
            ) : (
              <ConnectKitButton />
            )}
          </Form>
        </Card.Body>
      </Card>
      {/* Toasts */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            onClose={() => handleHideToast(index)}
            delay={150000}
            autohide
            className={`toast ${index === toasts.length - 1 ? "" : "overlay"}`}
            style={{ zIndex: toasts.length - index }}
          >
            <Toast.Header
              closeButton
              style={{ backgroundColor: toast.color, gap: "1rem" }}
              className="d-flex align-items-center justify-content-between"
            >
              <FaCircleCheck style={{ color: "#61d3a3" }} size={20} />
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body className="d-flex align-items-center justify-content-between">
              {toast.message}
              {toast.transactionHash && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-top`}>Ver Transação!</Tooltip>}
                >
                  <a
                    href={
                      walletClient?.chain?.blockExplorers?.default?.url
                        ? `${walletClient.chain.blockExplorers.default.url}/tx/${toast.transactionHash}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black text-opacity-50 text-decoration-none d-flex align-items-center"
                  >
                    <HiOutlineExternalLink size={18} className="me-1" />
                  </a>
                </OverlayTrigger>
              )}
            </Toast.Body>
          </Toast>
        ))}
      </div>
    </Container>
  );
}

export default createTokenYour;
