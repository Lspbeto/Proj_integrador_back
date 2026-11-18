const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Força o caminho absoluto do .env

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados MongoDB
const LINK_DO_BANCO = process.env.MONGO_URI;

mongoose.connect(LINK_DO_BANCO)
    .then(function () {
        console.log("Conectado com sucesso ao MongoDB na Nuvem!");
    })
    .catch(function (erro) {
        console.error("Erro ao conectar ao MongoDB:", erro);
    });

// Schema e Modelo de Dados
const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cargo: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// [GET] Listar todos os usuários
app.get('/usuarios', function (requisicao, response) {
    Usuario.find()
        .then(function (listaDeUsuarios) {
            return response.json(listaDeUsuarios);
        })
        .catch(function (erro) {
            return response.status(500).json({ erro: "Erro ao buscar dados do banco" });
        });
});

// [POST] Criar um novo usuário
app.post('/usuarios', function (requisicao, response) {
    const dadosRecebidos = requisicao.body;
    Usuario.create({
        nome: dadosRecebidos.nome,
        cargo: dadosRecebidos.cargo
    })
        .then(function (novoUsuario) {
            return response.status(201).json(novoUsuario);
        })
        .catch(function (erro) {
            return response.status(400).json({ erro: "Erro ao salvar usuário no banco" });
        });
});

// [PUT] Atualizar um usuário pelo nome
app.put('/usuarios/:nomeParametro', function (requisicao, response) {
    // CORREÇÃO: Variável corrigida de 'npmeParametro' para 'nomeParametro'
    const nomeParametro = decodeURIComponent(requisicao.params.nomeParametro);
    const dadosNovos = requisicao.body;

    Usuario.findOneAndUpdate(
        { nome: { $regex: new RegExp("^" + nomeParametro + "$", "i") } },
        { nome: dadosNovos.nome, cargo: dadosNovos.cargo },
        { new: true, runValidators: true }
    )
    .then(function (usuarioAtualizado) {
        if (!usuarioAtualizado) {
            return response.status(404).json({ erro: "Usuário não encontrado para atualizar" });
        }
        return response.json(usuarioAtualizado);
    })
    .catch(function (erro) {
        return response.status(500).json({ erro: "Erro ao processar a atualização no banco" });
    });
});

// [DELETE] Remover um usuário pelo nome
app.delete('/usuarios/:nomeParametro', function (requisicao, response) {
    // CORREÇÃO: Variável corrigida de 'npmeParametro' para 'nomeParametro' e rota duplicada limpa
    const nomeParametro = decodeURIComponent(requisicao.params.nomeParametro);

    Usuario.findOneAndDelete(
        { nome: { $regex: new RegExp("^" + nomeParametro + "$", "i") } }
    )
    .then(function (usuarioRemovido) {
        if (!usuarioRemovido) {
            return response.status(404).json({ erro: "Usuário não encontrado para deletar" });
        }
        return response.json(usuarioRemovido);
    })
    .catch(function (erro) {
        return response.status(500).json({ erro: "Erro ao processar a exclusão no banco" });
    });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, function () {
    console.log(`🚀 Backend rodando e pronto em http://localhost:${PORTA}`);
});