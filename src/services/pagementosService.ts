import { Op } from "sequelize";
import Pagamentos  from "../models/Pagamentos.js";
import  Pedidos  from "../models/Pedidos.js";
import { Comandas } from "../models/Comandas.js";


export const pagamentoService = {
  findAllPaginated: async (page: number, perPage: number) => {
    const offset = (page - 1) * perPage;
    const { rows, count } = await Pagamentos.findAndCountAll({
      order: [["id", "ASC"]],
      limit: perPage,
      offset,
    });

    return {
      pagamentos: rows,
      page,
      limit: perPage,
      total: count,
    };
  },

  criarPagamento: async (comandaId: number, valor: number, formaPagamento: string) => {
    const pedidos = await Pedidos.findAll({
      where: { comandaId },
      attributes: ["total"],
    });

    if (pedidos.length === 0) {
      throw new Error("Pedido não encontrado.");
    }

    const totalPedido = pedidos.reduce((sum, pedido) => sum + Number(pedido.total), 0);

    const pagamentosExistentes = await Pagamentos.findAll({
      where: { comandaId },
      attributes: ["valor"],
    });

    const totalPago = pagamentosExistentes.reduce(
      (sum, pagamento) => sum + Number(pagamento.valor),
      0
    );

    const totalRestante = totalPedido - totalPago;

    if (totalRestante <= 0) {
      throw new Error("Este pedido já foi totalmente pago.");
    }

    const valorDigitado = Number(valor);

    if (valorDigitado > totalRestante) {
      throw new Error(`O valor inserido ultrapassa o total restante de R$ ${totalRestante.toFixed(2)}`);
    }

    const pagamento = await Pagamentos.create({
      comandaId,
      valor: valorDigitado,
      formaPagamento,
      status: "concluído" // ou "registrado" — status do pagamento em si
    });

    // Atualiza o status da comanda com base nos pagamentos
    await atualizarStatusComanda(comandaId);

    return {
      pagamento,
      totalPedido,
      totalRestante: totalRestante - valorDigitado,
    };
  },

  show: async (id: string) => {
    const pagamento = await Pagamentos.findByPk(id, {
      attributes: ["id", "comandaId", "valor", "formaPagamento", "status"],
      include: {
        association: "pedidos",
        attributes: ["id", "comandaId", "total", "status"],
      },
    });
    return pagamento;
  },

  update: async (
    id: string,
    attributes: { comandaId: number; valor: number; formaPagamento: string; status: string }
  ) => {
    const [affected, updated] = await Pagamentos.update(attributes, {
      where: { id },
      returning: true,
    });

    if (updated[0]) {
      await atualizarStatusComanda(updated[0].comandaId);
    }

    return updated;
  },

  delete: async (id: string) => {
    const pagamento = await Pagamentos.findByPk(id);
    const deleted = await Pagamentos.destroy({ where: { id } });

    // Atualiza status da comanda após deletar o pagamento
    if (pagamento) {
      await atualizarStatusComanda(pagamento.comandaId);
    }

    return deleted;
  },



totalPagamentos: async () => {
  const now = new Date();
  const startDay = new Date(now.setHours(0, 0, 0, 0));
  const endDay = new Date(new Date().setHours(23, 59, 59, 999));

  try {
    const total = await Pagamentos.sum('valor', {
      where: {
        createdAt: {
          [Op.between]: [startDay, endDay]
        }
      }
    });

    return total ?? 0; // se não houver pagamentos, retorna 0
  } catch (error) {
    console.error('Erro ao somar pagamentos:', error);
    throw error;
  }


}}

// Função auxiliar que calcula o status da comanda com base nos pagamentos
const atualizarStatusComanda = async (comandaId: number) => {
  const pedidos = await Pedidos.findAll({ where: { comandaId } });
  const totalPedido = pedidos.reduce((sum, p) => sum + Number(p.total), 0);

  const pagamentos = await Pagamentos.findAll({ where: { comandaId } });
  const totalPago = pagamentos.reduce((sum, p) => sum + Number(p.valor), 0);

  let novoStatus = "pendente";
  if (totalPago === 0) {
    novoStatus = "pendente";
  } else if (totalPago < totalPedido) {
    novoStatus = "parcial";
  } else {
    novoStatus = "pago";
  }

  await Comandas.update({ status: novoStatus }, { where: { id: comandaId } });
};
