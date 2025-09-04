import React, { useState } from 'react';
import AdicionarPedido from './components/AdicionarPedido/AdicionarPedido';
import FechamentoDeMesa from './components/FechamentoDeMesa/FechamentoDeMesa';
import './App.css';


type ItemPedido = {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
};


type Mesa = {
  id: number;
  status: 'livre' | 'ocupada';
  pedidos: ItemPedido[];
};


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

      setModo('adicionar-pedido');
    }
  };
  const handleCancelarAcao = () => {
    setModo ('gerencia');
    setMesaSelecionada(null);
  }  

  const handleSalvarPedido = (mesaId: number, novosItens: ItemPedido[]) => {
    setMesas(mesas.map(mesa =>
      mesa.id === mesaId
        ? { ...mesa, status: 'ocupada', pedidos: [...mesa.pedidos, ...novosItens] }
        : mesa
    ));

    setModo('gerencia');
    setMesaSelecionada(null);
    alert('Pedido adicionado com sucesso!');
  };


  const handleFecharMesa = (mesaId: number) => {
    setMesas(mesas.map(mesa =>
      mesa.id === mesaId
        ? { ...mesa, status: 'livre', pedidos: [] }
        : mesa
    ));

    setModo('gerencia');
    setMesaSelecionada(null);
  };
  

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
          onSalvarPedido={(novosItens) => handleSalvarPedido(mesaAtual.id, novosItens)} 
          onCancelar={handleCancelarAcao} 
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