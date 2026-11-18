// Definição dinâmica da URL base (usa localhost se estiver testando local, ou o Render se estiver online)
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://cadastroback-4zoc.onrender.com';

// FUNÇÃO: BUSCAR E DESENHAR OS USUÁRIOS (GET)
function carregarUsuarios() {
    fetch(`${API_URL}/usuarios`)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (listaDeUsuarios) {
            listaVisual.innerHTML = '';
            listaDeUsuarios.forEach(function (user) {
                const itemLista = document.createElement('li');
                itemLista.innerHTML = `
                <span><strong>${user.nome}</strong> - ${user.cargo}</span>
                <div class="lista-user">
                    <button class="btn-editar" onclick="prepararEdicao('${user.nome}', '${user.cargo}')">Editar</button>
                    <button class="btn-deletar" onclick="deletarUsuario('${user.nome}')">Excluir</button>
                </div>
            `;
                listaVisual.appendChild(itemLista);
            });
        })
        .catch(function (erro) {
            console.error('Erro ao buscar usuários:', erro);
        });
}

// No evento 'submit' do formulário (POST e PUT):
if (nomeUsuarioSendoEditado !== null) {
    // MODO EDIÇÃO (PUT)
    fetch(`${API_URL}/usuarios/${encodeURIComponent(nomeUsuarioSendoEditado)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario)
    })
    .then(function () {
        nomeUsuarioSendoEditado = null;
        formulario.querySelector('button').innerText = 'Salvar no Sistema';
        formulario.reset();
        carregarUsuarios();
    })
    .catch(function (erro) {
        alert('Erro ao atualizar usuário.');
    });
} else {
    // MODO CRIAÇÃO (POST)
    fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario)
    })
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function () {
        formulario.reset();
        carregarUsuarios();
    })
    .catch(function (erro) {
        alert('Erro ao salvar usuário.');
    });
}

// Na função de deletar (DELETE):
function deletarUsuario(nome) {
    if (confirm(`Tem certeza que deseja excluir ${nome}?`)) {
        fetch(`${API_URL}/usuarios/${encodeURIComponent(nome)}`, {
            method: 'DELETE'
        })
        .then(function () {
            carregarUsuarios();
        })
        .catch(function (erro) {
            alert('Erro ao deletar usuário.');
        });
    }
}