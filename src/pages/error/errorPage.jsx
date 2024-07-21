import { Link } from "react-router-dom";

function errorPage() {
  return (
    <div>
      Rota 404! voltar para a <Link to="/">home</Link>
    </div>
  );
}

export default errorPage;
