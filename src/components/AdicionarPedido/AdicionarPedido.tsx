import React, { useState } from 'react';
import { Container, Card, Form, ListGroup, Button, Row, Col } from 'react-bootstrap';
// import './AdicionarPedido.css';

type ItemCardapio = {
  id: number;
  nome: string;
  preco: number;
};

type ItemPedido = ItemCardapio & {
  quantidade: number;
};

const cardapio: ItemCardapio[] = [
  { id: 1, nome: 'Hambúrguer Clássico', preco: 25.00 },
  { id: 2, nome: 'Batata Frita', preco: 12.00 },
  { id: 3, nome: 'Refrigerante Cola', preco: 8.00 },
  { id: 4, nome: 'Suco de Laranja', preco: 10.00 },
  { id: 5, nome: 'Cerveja Lager', preco: 15.00 },
  { id: 6, nome: 'Água Mineral', preco: 5.00 },
  { id: 7, nome: 'Sanduíche de Frango', preco: 22.00 },
  { id: 8, nome: 'Salada Caesar', preco: 28.00 },
  { id: 9, nome: 'Petit Gateau', preco: 18.00 },
  { id: 10, nome: 'Café Expresso', preco: 6.00 },
];

interface AdicionarPedidoProps {
  mesaId: number;
  onSalvarPedido: (itens: ItemPedido[]) => void;
  onCancelar: () => void;
}

const AdicionarPedido: React.FC<AdicionarPedidoProps> = ({ mesaId, onSalvarPedido, onCancelar  }) => {
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([]);
  const [itemSelecionadoId, setItemSelecionadoId] = useState<number | ''>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [termoPesquisa, setTermoPesquisa] = useState<string>('');

  // Filtra os itens do cardápio com base no termo de pesquisa
  const itensFiltrados = cardapio.filter(item =>
    item.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );
  const handleAdicionarItem = () => {
    if (itemSelecionadoId !== '' && quantidade > 0) {
      const itemDoCardapio = cardapio.find(item => item.id === itemSelecionadoId);
      if (itemDoCardapio) {
        
        const itemExistente = itensPedido.find(item => item.id === itemSelecionadoId);

        if (itemExistente) {
          
          setItensPedido(
            itensPedido.map(item =>
              item.id === itemSelecionadoId
                ? { ...item, quantidade: item.quantidade + quantidade }
                : item
            )
          );
        } else {
          
          const novoItem: ItemPedido = {
            ...itemDoCardapio,
            quantidade: quantidade,
          };
          setItensPedido([...itensPedido, novoItem]);
        }
        
        
        setItemSelecionadoId('');
        setQuantidade(1);
        setTermoPesquisa('');
      }
    }
  };

  const handleSelecionarItem = (item: ItemCardapio) => {
    setItemSelecionadoId(item.id);
    setTermoPesquisa(item.nome);
  };

  const handleSalvarPedido = () => {
      onSalvarPedido(itensPedido);
  };

  const handleRemoverItem = (itemId: number) => {
    setItensPedido(itensPedido.filter(item => item.id !== itemId));
  };

  const handleAtualizarQuantidade = (itemId: number, novaQuantidade: number) => {
    if (novaQuantidade > 0) {
      setItensPedido(
        itensPedido.map(item =>
          item.id === itemId
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );
    } else {
      handleRemoverItem(itemId);
    }
  };

  const valorTotal = itensPedido.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header as="h2" className="text-center bg-primary text-white">
          Adicionar Pedido - Mesa {mesaId}
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formPesquisaProduto" className="mb-3 position-relative">
              <Form.Label className="fw-bold">Pesquisar Produto:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do produto..."
                value={termoPesquisa}
                onChange={(e) => {
                  setTermoPesquisa(e.target.value);
                  setItemSelecionadoId("");
                }}
              />
              {termoPesquisa && itensFiltrados.length > 0 && (
                <ListGroup className="position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 10 }}>
                  {itensFiltrados.map(item => (
                    <ListGroup.Item action onClick={() => handleSelecionarItem(item)}>
                      {item.nome} - R${item.preco.toFixed(2)}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>

            <Form.Group controlId="formQuantidade" className="mb-3">
              <Form.Label className="fw-bold">Quantidade:</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </Form.Group>

            <Button 
              variant="success" 
              className="w-100 mb-3" 
              onClick={handleAdicionarItem} 
              disabled={itemSelecionadoId === null}>
              Adicionar Item
            </Button>
          </Form>

          <Card.Title className="mt-4">Itens do Pedido:</Card.Title>
          <ListGroup variant="flush">
            {itensPedido.length > 0 ? (
              itensPedido.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                  <span>{item.nome}</span>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => handleAtualizarQuantidade(item.id, Number(e.target.value))}
                      style={{ width: '60px' }}
                    />
                    <span className="fw-bold text-success">R${(item.preco * item.quantidade).toFixed(2)}</span>
                    <Button variant="danger" size="sm" onClick={() => handleRemoverItem(item.id)}>Remover</Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="text-center text-muted">Nenhum item adicionado ao pedido.</ListGroup.Item>
            )}
            <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light fw-bold mt-2">
              <span>Total:</span>
              <span className="text-primary">R${valorTotal.toFixed(2)}</span>
            </ListGroup.Item>
          </ListGroup>

          <div className="d-flex gap-2 mt-4">
            <Button variant="primary" className="flex-grow-1" onClick={() => onSalvarPedido(itensPedido)}>
              Salvar Pedido
            </Button>
            <Button variant="secondary" className="flex-grow-1" onClick={onCancelar}>
              Cancelar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};


export default AdicionarPedido;