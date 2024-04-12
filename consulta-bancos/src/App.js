import React, { useState, useEffect } from "react";
//URL base da API
const API_BASE_URL = "http://localhost:5000/";

function App() {
  // Estado para armazenar a lista de bancos
  const [bancos, setBancos] = useState([]);
  // Estado para armazenar o banco selecionado
  const [bancoSelecionado, setBancoSelecionado] = useState(null);
   // Estado para armazenar o termo de busca
  const [termoBusca, setTermoBusca] = useState("");

  // Efeito para buscar a lista de bancos ao carregar o componente
  useEffect(() => {
    fetch(`${API_BASE_URL}/bancos`)
      .then((response) => {
        // Verifica se a resposta foi OK
        if (!response.ok) {
          throw new Error("Falha ao buscar lista de bancos");
        }
        // Retorna a resposta em formato JSON
        return response.json();
      })
      // Atualiza o estado com a lista de bancos
      .then((data) => setBancos(data))
      // Exibe um erro no console
      .catch((error) => console.error("Erro ao buscar bancos:", error));
  }, []);
  // Função para consultar os detalhes de um banco
  const handleConsultaBanco = (codigo_compensacao) => {
    fetch(`${API_BASE_URL}/bancos/${codigo_compensacao}`)
      .then((response) => {
        // Verifica se a resposta foi OK
        if (!response.ok) {
          throw new Error(
            `Falha ao buscar detalhes do banco com código ${codigo_compensacao}`
          );
        }
        // Retorna a resposta em formato JSON
        return response.json();
      })
      // Atualiza o estado com o banco selecionado
      .then((data) => setBancoSelecionado(data))
      // Exibe um erro no console
      .catch((error) => console.error("Erro ao buscar detalhes do banco:", error));
  };
  // Função para filtrar os bancos pelo nome
  const handleFiltrarBancos = (event) => {
   // Atualiza o estado com o novo termo de busca
    setTermoBusca(event.target.value);
  };
  // Filtra a lista de bancos de acordo com o termo de busca
  const bancosFiltrados = bancos.filter((banco) => {
    return banco.nome_instituicao
      .toLowerCase()
      .includes(termoBusca.toLowerCase());
  });

  return (
    <div>
      <h1>Consulta de Bancos</h1>
      <div>
        <input
          type="text"
          placeholder="Digite o nome do banco"
          value={termoBusca}
          onChange={handleFiltrarBancos}
        />
      </div>
      <ul>
        {bancosFiltrados.map((banco) => (
          <li key={banco.codigo_compensacao}>
            {banco.nome_instituicao}
            <button onClick={() => handleConsultaBanco(banco.codigo_compensacao)}>
              Consultar
            </button>
          </li>
        ))}
      </ul>
      {bancoSelecionado && (
        <div>
          <h2>Detalhes do Banco</h2>
          <p>Código de Compensação: {bancoSelecionado.codigo_compensacao}</p>
          <p>Nome: {bancoSelecionado.nome_instituicao}</p>
        </div>
      )}
    </div>
  );
}

export default App;