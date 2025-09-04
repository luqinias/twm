import React, { useState } from 'react';
import AdicionarPedido from './components/AdicionarPedido/AdicionarPedido';
import FechamentoDeMesa from './components/FechamentoDeMesa/FechamentoDeMesa';
import './App.css';

// Reutilizando os tipos de dados
type ItemPedido = {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
};

// Tipo para representar o estado de uma mesa
type Mesa = {
  id: number;
  status: 'livre' | 'ocupada';
  pedidos: ItemPedido[];
};

// Dados de mesas iniciais
const mesasIniciais: Mesa[] = [
  { id: 1, status: 'ocupada', pedidos: [{ id: 1, nome: 'Hambúrguer Clássico', quantidade: 2, preco: 25.00 }] },
  { id: 2, status: 'livre', pedidos: [] },
  { id: 3, status: 'ocupada', pedidos: [{ id: 3, nome: 'Refrigerante', quantidade: 3, preco: 8.00 }] },
  { id: 4, status: 'livre', pedidos: [] },
];

const App: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>(mesasIniciais);
  const [mesaSelecionada, setMesaSelecionada] = useState<number | null>(null);
  const [modo, setModo] = useState<'gerencia' | 'adicionar-pedido' | 'fechar-mesa'>('gerencia');

  // Função para lidar com o clique em uma mesa
  const handleSelecionarMesa = (mesaId: number, status: 'livre' | 'ocupada') => {
    setMesaSelecionada(mesaId);
    if (status === 'livre') {
      alert(`Mesa ${mesaId} ocupada. Agora você pode adicionar um pedido.`);
      setModo('adicionar-pedido');
    } else {
      // Se a mesa já está ocupada, damos a opção de adicionar pedido
      setModo('adicionar-pedido');
    }
  };
  const handleCancelarAcao = () => {
    setModo ('gerencia');
    setMesaSelecionada(null);
  }  
  // Função para adicionar um novo pedido à mesa
  const handleSalvarPedido = (mesaId: number, novosItens: ItemPedido[]) => {
    setMesas(mesas.map(mesa =>
      mesa.id === mesaId
        ? { ...mesa, status: 'ocupada', pedidos: [...mesa.pedidos, ...novosItens] }
        : mesa
    ));
    // Volta para a tela de gerência de mesas
    setModo('gerencia');
    setMesaSelecionada(null);
    alert('Pedido adicionado com sucesso!');
  };

  // Função para fechar a mesa
  const handleFecharMesa = (mesaId: number) => {
    setMesas(mesas.map(mesa =>
      mesa.id === mesaId
        ? { ...mesa, status: 'livre', pedidos: [] }
        : mesa
    ));
    // Volta para a tela de gerência
    setModo('gerencia');
    setMesaSelecionada(null);
  };
  
  // Encontra a mesa selecionada para passar os dados
  const mesaAtual = mesas.find(m => m.id === mesaSelecionada);

  return (
    <div className="app-container">
      {modo === 'gerencia' && (
        <>
          <h1 className="titulo-principal">Gerência de Mesas</h1>
          <div className="mesas-grid">
            {mesas.map(mesa => (
              <div
                key={mesa.id}
                className={`mesa ${mesa.status}`}
                onClick={() => handleSelecionarMesa(mesa.id, mesa.status)}
              >
                <h3>Mesa {mesa.id}</h3>
                <p>{mesa.status === 'livre' ? 'Livre' : 'Ocupada'}</p>
                {mesa.status === 'ocupada' && (
                  <button onClick={(e) => { e.stopPropagation(); setMesaSelecionada(mesa.id); setModo('fechar-mesa'); }}>
                    Fechar Conta
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {modo === 'adicionar-pedido' && mesaAtual && (
        <AdicionarPedido 
          mesaId={mesaAtual.id}
          // Lógica para enviar o novo pedido para a tela de gerenciamento
          onSalvarPedido={(novosItens) => handleSalvarPedido(mesaAtual.id, novosItens)} 
          onCancelar={handleCancelarAcao} // <--- Passando a nova função
        />
      )}

      {modo === 'fechar-mesa' && mesaAtual && (
        <FechamentoDeMesa 
          mesaId={mesaAtual.id}
          itensConsumidos={mesaAtual.pedidos}
          onFecharMesa={handleFecharMesa}
          onCancelar={handleCancelarAcao}
        />
      )}
    </div>
  );
};

export default App;