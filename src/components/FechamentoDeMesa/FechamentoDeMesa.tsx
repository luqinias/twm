import React, { useState } from 'react';
import { Container, Card, ListGroup, Form, Button, Row, Col } from 'react-bootstrap';
// import './FechamentoDeMesa.css';

// Reutilizando os tipos de dados do componente AdicionarPedido
type ItemPedido = {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
};

// Props que o componente receberá da tela de Gerência de Mesa
interface FechamentoDeMesaProps {
  mesaId: number;
  itensConsumidos: ItemPedido[];
  // Função para notificar a tela superior de que a mesa foi fechada
  onFecharMesa: (mesaId: number) => void;
  onCancelar: () => void;
}

const FechamentoDeMesa: React.FC<FechamentoDeMesaProps> = ({ mesaId, itensConsumidos, onFecharMesa, onCancelar }) => {
  const [desconto, setDesconto] = useState<number>(0);
  const [formaPagamento, setFormaPagamento] = useState<string>('');

  const subtotal = itensConsumidos.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  const valorTotal = subtotal - desconto;

  const handleFinalizarPagamento = () => {
  
      if (formaPagamento) {
        console.log(`Finalizando pagamento da Mesa ${mesaId}...`);
        onFecharMesa(mesaId);
        alert(`Mesa ${mesaId} fechada! Total: R$${valorTotal.toFixed(2)}.`);
    } else {
        alert('Por favor, selecione uma forma de pagamento.');
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header as="h2" className="text-center bg-primary text-white">
          Fechamento de Mesa {mesaId}
        </Card.Header>
        <Card.Body>
          <Card.Title>Resumo do Pedido</Card.Title>
          <ListGroup variant="flush">
            {itensConsumidos.map(item => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                <span>{item.nome} x {item.quantidade}</span>
                <span className="fw-bold">R${(item.preco * item.quantidade).toFixed(2)}</span>
              </ListGroup.Item>
            ))}
            <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light fw-bold">
              <span>Subtotal:</span>
              <span>R${subtotal.toFixed(2)}</span>
            </ListGroup.Item>
          </ListGroup>

          <hr className="my-4" />

          <Card.Title>Opções de Pagamento</Card.Title>
          <Form>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="desconto">
                  <Form.Label>Desconto (R$):</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={desconto}
                    onChange={(e) => setDesconto(Math.max(0, Number(e.target.value)))}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formaPagamento">
                  <Form.Label>Forma de Pagamento:</Form.Label>
                  <Form.Select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                    <option value="" disabled>Selecione a forma</option>
                    <option value="pix">Pix</option>
                    <option value="credito">Cartão de Crédito</option>
                    <option value="debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>

          <h3 className="text-end my-4 fw-bold text-success">
            Total a Pagar: R${valorTotal.toFixed(2)}
          </h3>

          <div className="d-flex gap-3">
            <Button variant="success" className="flex-grow-1" onClick={handleFinalizarPagamento}>
              Finalizar Pagamento
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

export default FechamentoDeMesa;