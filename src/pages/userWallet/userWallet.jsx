import { useState, useEffect } from "react";
import axios from "axios";
import { useWalletClient } from "wagmi";
import { Container, Row } from "react-bootstrap";
import TokenCardItem from "./TokenCardItem"; // Importe o componente TokenCardItem

const UserWallet = () => {
  const [tokens, setTokens] = useState([]);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const fetchTokens = async () => {
      if (
        walletClient &&
        walletClient.account &&
        walletClient.account.address
      ) {
        try {
          const response = await axios.get(
            `https://api-backend-theta.vercel.app/${walletClient.account.address}`
          );
          if (
            response.data &&
            response.data.owner &&
            Array.isArray(response.data.owner.tokens)
          ) {
            setTokens(response.data.owner.tokens);
          } else {
            console.error("Resposta da API não contém tokens:", response.data);
            setTokens([]);
          }
        } catch (error) {
          console.error("Erro ao buscar tokens:", error);
          setTokens([]);
        }
      }
    };

    fetchTokens();
  }, [walletClient]);

  return (
    <Container>
      <Row>
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <TokenCardItem
              key={token.tokenAddress}
              tokenData={token}
              index={index}
            />
          ))
        ) : (
          <p>Nenhum token encontrado</p>
        )}
      </Row>
    </Container>
  );
};

export default UserWallet;
