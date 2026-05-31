const API_URL = window.location.origin;
let token = localStorage.getItem('token');
let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

async function fazerLogin() {
    const username = document.getElementById('login-username').value;
    const senha = document.getElementById('login-senha').value;
    const erro = document.getElementById('login-erro');

    try {
        const resposta = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, senha })
        });

        if (!resposta.ok) {
            erro.textContent = 'Usuário ou senha incorretos!';
            return;
        }

        const dados = await resposta.json();
        token = dados.token;
        usuarioLogado = { nome: dados.nome, perfil: dados.perfil };

        localStorage.setItem('token', token);
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        iniciarSistema();

    } catch (e) {
        erro.textContent = 'Erro ao conectar com o servidor!';
    }
}

function fazerLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    token = null;
    location.reload();
}

function cabecalho() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

function iniciarSistema() {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('nome-usuario').textContent = usuarioLogado.nome;
    document.getElementById('perfil-usuario').textContent = usuarioLogado.perfil === 'ADMIN' ? 'Administrador' : 'Técnico';

    if (usuarioLogado.perfil !== 'ADMIN') {
        document.getElementById('menu-usuarios').style.display = 'none';
    }

    carregarDashboard();
}
function mostrarTela(nomeTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.add('oculto'));
    document.getElementById('tela-' + nomeTela).classList.remove('oculto');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const titulos = {
        dashboard: 'Dashboard',
        equipamentos: 'Equipamentos',
        movimentacoes: 'Movimentações',
        usuarios: 'Usuários'
    };
    document.getElementById('topbar-title').textContent = titulos[nomeTela];

    if (nomeTela === 'dashboard') carregarDashboard();
    if (nomeTela === 'equipamentos') carregarEquipamentos();
    if (nomeTela === 'movimentacoes') carregarMovimentacoes();
    if (nomeTela === 'usuarios') carregarUsuarios();
}
async function carregarDashboard() {
    try {
        const resposta = await fetch(API_URL + '/equipamentos', { headers: cabecalho() });
        const equipamentos = await resposta.json();

        document.getElementById('total-equipamentos').textContent = equipamentos.length;
        document.getElementById('total-disponiveis').textContent  = equipamentos.filter(e => e.status === 'DISPONIVEL').length;
        document.getElementById('total-emprestados').textContent  = equipamentos.filter(e => e.status === 'EM_USO').length;
        document.getElementById('total-manutencao').textContent   = equipamentos.filter(e => e.status === 'MANUTENCAO').length;
        document.getElementById('count-dash').textContent = equipamentos.length + ' equipamentos';
        const respostaMov = await fetch(API_URL + '/movimentacoes', { headers: cabecalho() });
        const movimentacoes = await respostaMov.json();


        const tbody = document.getElementById('dashboard-movimentacoes');
        tbody.innerHTML = '';

        equipamentos.forEach(eq => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
        <td>${eq.codigo}</td>
        <td>${eq.nome}</td>
        <td>${badgeTipo(eq.tipo)}</td>
        <td>${badgeStatus(eq.status)}</td>
       <td><button class="btn-danger" onclick="excluirEquipamento(${eq.id}, 'equipamentos')">Excluir</button></td>
      `;
            tbody.appendChild(linha);
        });

    } catch (erro) {
        console.log('Erro:', erro);
    }
}
async function carregarEquipamentos() {
    try {
        const resposta = await fetch(API_URL + '/equipamentos', { headers: cabecalho() });
        const equipamentos = await resposta.json();

        document.getElementById('count-equipamentos').textContent = equipamentos.length + ' equipamentos';

        const tbody = document.getElementById('tabela-equipamentos-body');
        tbody.innerHTML = '';

        equipamentos.forEach(eq => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
        <td>${eq.codigo}</td>
        <td>${eq.nome}</td>
        <td>${badgeTipo(eq.tipo)}</td>
        <td>${eq.numeroSerie || '-'}</td>
        <td>${badgeStatus(eq.status)}</td>
        <td>${eq.observacoes || '-'}</td>
        <td><button class="btn-danger" onclick="excluirEquipamento(${eq.id}, 'equipamentos')">Excluir</button></td>
      `;
            tbody.appendChild(linha);
        });

    } catch (erro) {
        console.log('Erro:', erro);
    }
}

async function cadastrarEquipamento() {
    const nome        = document.getElementById('input-nome').value;
    const codigo      = document.getElementById('input-codigo').value;
    const numeroSerie = document.getElementById('input-numeroserie').value;
    const tipo        = document.getElementById('input-tipo').value;
    const status      = document.getElementById('input-status').value;
    const observacoes = document.getElementById('input-observacoes').value;

    if (!nome || !codigo) { alert('Preencha o nome e o código!'); return; }

    try {
        await fetch(API_URL + '/equipamentos', {
            method: 'POST',
            headers: cabecalho(),
            body: JSON.stringify({ nome, codigo, numeroSerie, tipo, status, observacoes })
        });

        document.getElementById('input-nome').value        = '';
        document.getElementById('input-codigo').value      = '';
        document.getElementById('input-numeroserie').value = '';
        document.getElementById('input-observacoes').value = '';
        carregarEquipamentos();

    } catch (erro) {
        console.log('Erro:', erro);
    }
}
function teclaBarras(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const codigo = document.getElementById('input-codigo').value;
        if (codigo) {
            document.getElementById('input-nome').focus();
        }
    }
}
async function excluirEquipamento(id, origem) {
    if (!confirm('Tem certeza que deseja excluir este equipamento?')) return;
    try {
        await fetch(API_URL + '/equipamentos/' + id, { method: 'DELETE', headers: cabecalho() });
        if (origem === 'dashboard') {
            carregarDashboard();
        } else {
            carregarEquipamentos();
        }
    } catch (erro) {
        console.log('Erro:', erro);
    }
}
async function carregarMovimentacoes() {
    try {
        const respostaEq = await fetch(API_URL + '/equipamentos', { headers: cabecalho() });
        const equipamentos = await respostaEq.json();

        const select = document.getElementById('input-equipamento-mov');
        select.innerHTML = '<option value="">Selecione o equipamento</option>';
        equipamentos.forEach(eq => {
            select.innerHTML += `<option value="${eq.id}">${eq.nome} - ${eq.codigo}</option>`;
        });

        const respostaMov = await fetch(API_URL + '/movimentacoes', { headers: cabecalho() });
        const movimentacoes = await respostaMov.json();

        const tbody = document.getElementById('tabela-movimentacoes-body');
        tbody.innerHTML = '';

        [...movimentacoes].reverse().forEach(mov => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
        <td>${new Date(mov.dataHora).toLocaleString('pt-BR')}</td>
        <td>${mov.equipamento.nome}</td>
        <td>${mov.funcionario}</td>
        <td>${mov.tipo === 'SAIDA' ? '<span class="badge badge-laranja">Saída</span>' : '<span class="badge badge-verde">Devolução</span>'}</td>
      `;
            tbody.appendChild(linha);
        });

    } catch (erro) {
        console.log('Erro:', erro);
    }
}

async function registrarMovimentacao() {
    const equipamentoId = document.getElementById('input-equipamento-mov').value;
    const funcionario   = document.getElementById('input-funcionario').value;
    const tipo          = document.getElementById('input-tipo-mov').value;

    if (!equipamentoId || !funcionario) { alert('Preencha todos os campos!'); return; }

    try {
        await fetch(API_URL + '/movimentacoes', {
            method: 'POST',
            headers: cabecalho(),
            body: JSON.stringify({ equipamentoId, funcionario, tipo })
        });

        document.getElementById('input-funcionario').value = '';
        carregarMovimentacoes();

    } catch (erro) {
        console.log('Erro:', erro);
    }
}
async function carregarUsuarios() {
    try {
        const resposta = await fetch(API_URL + '/auth/usuarios', { headers: cabecalho() });
        const usuarios = await resposta.json();

        const tbody = document.getElementById('tabela-usuarios-body');
        tbody.innerHTML = '';

        usuarios.forEach(u => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
        <td>${u.nome}</td>
        <td>${u.username}</td>
        <td>${u.perfil === 'ADMIN' ? '<span class="badge badge-azul">Admin</span>' : '<span class="badge badge-verde">Técnico</span>'}</td>
        <td><button class="btn-danger" onclick="excluirUsuario(${u.id})">Excluir</button></td>
      `;
            tbody.appendChild(linha);
        });

    } catch (erro) {
        console.log('Erro:', erro);
    }
}

async function cadastrarUsuario() {
    const nome     = document.getElementById('input-usuario-nome').value;
    const username = document.getElementById('input-usuario-username').value;
    const senha    = document.getElementById('input-usuario-senha').value;
    const perfil   = document.getElementById('input-usuario-perfil').value;

    if (!nome || !username || !senha) { alert('Preencha todos os campos!'); return; }

    try {
        await fetch(API_URL + '/auth/usuarios', {
            method: 'POST',
            headers: cabecalho(),
            body: JSON.stringify({ nome, username, senha, perfil })
        });

        document.getElementById('input-usuario-nome').value     = '';
        document.getElementById('input-usuario-username').value = '';
        document.getElementById('input-usuario-senha').value    = '';
        carregarUsuarios();

    } catch (erro) {
        console.log('Erro:', erro);
    }
}

async function excluirUsuario(id) {
    if (!confirm('Tem certeza?')) return;
    try {
        await fetch(API_URL + '/auth/usuarios/' + id, { method: 'DELETE', headers: cabecalho() });
        carregarUsuarios();
    } catch (erro) {
        console.log('Erro:', erro);
    }
}
function badgeStatus(status) {
    if (status === 'DISPONIVEL') return '<span class="badge badge-verde">Disponível</span>';
    if (status === 'EM_USO')     return '<span class="badge badge-laranja">Em uso</span>';
    if (status === 'MANUTENCAO') return '<span class="badge badge-vermelho">Manutenção</span>';
    return status;
}
function badgeTipo(tipo) {
    const cores = {
        ROTEADOR:   'badge-azul',
        ONU:        'badge-verde',
        CABO:       'badge-laranja',
        SWITCH:     'badge-azul',
        FERRAMENTA: 'badge-vermelho',
        OUTROS:     'badge-cinza'
    };
    const nomes = {
        ROTEADOR:   'Roteador',
        ONU:        'ONU',
        CABO:       'Cabo',
        SWITCH:     'Switch',
        FERRAMENTA: 'Ferramenta',
        OUTROS:     'Outros'
    };
    const cor = cores[tipo] || 'badge-cinza';
    const nome = nomes[tipo] || tipo;
    return `<span class="badge ${cor}">${nome}</span>`;
}
if (token) {
    iniciarSistema();
}