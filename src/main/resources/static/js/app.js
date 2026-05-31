const API_URL = 'http://localhost:8080';

function mostrarTela(nomeTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.add('oculto'));
    document.getElementById('tela-' + nomeTela).classList.remove('oculto');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const titulos = {
        dashboard: 'Dashboard',
        equipamentos: 'Equipamentos',
        movimentacoes: 'Movimentações'
    };
    document.getElementById('topbar-title').textContent = titulos[nomeTela];

    if (nomeTela === 'dashboard') carregarDashboard();
    if (nomeTela === 'equipamentos') carregarEquipamentos();
    if (nomeTela === 'movimentacoes') carregarMovimentacoes();
}
async function carregarDashboard() {
    try {
        const resposta = await fetch(API_URL + '/equipamentos');
        const equipamentos = await resposta.json();

        document.getElementById('total-equipamentos').textContent = equipamentos.length;
        document.getElementById('total-disponiveis').textContent  = equipamentos.filter(e => e.status === 'DISPONIVEL').length;
        document.getElementById('total-emprestados').textContent  = equipamentos.filter(e => e.status === 'EM_USO').length;
        document.getElementById('total-manutencao').textContent   = equipamentos.filter(e => e.status === 'MANUTENCAO').length;

        const respostaMov = await fetch(API_URL + '/movimentacoes');
        const movimentacoes = await respostaMov.json();

        const tbody = document.getElementById('dashboard-movimentacoes');
        tbody.innerHTML = '';

        const ultimas = movimentacoes.slice(-5).reverse();
        ultimas.forEach(mov => {
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
        console.log('Backend não conectado:', erro);
    }
}
async function carregarEquipamentos() {
    try {
        const resposta = await fetch(API_URL + '/equipamentos');
        const equipamentos = await resposta.json();

        document.getElementById('count-equipamentos').textContent = equipamentos.length + ' equipamentos';

        const tbody = document.getElementById('tabela-equipamentos-body');
        tbody.innerHTML = '';

        equipamentos.forEach(eq => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
        <td>${eq.codigo}</td>
        <td>${eq.nome}</td>
        <td>${badgeStatus(eq.status)}</td>
        <td><button class="btn-danger" onclick="excluirEquipamento(${eq.id})">Excluir</button></td>
      `;
            tbody.appendChild(linha);
        });

    } catch (erro) {
        console.log('Backend não conectado:', erro);
    }
}

async function cadastrarEquipamento() {
    const nome   = document.getElementById('input-nome').value;
    const codigo = document.getElementById('input-codigo').value;
    const status = document.getElementById('input-status').value;

    if (!nome || !codigo) { alert('Preencha o nome e o código!'); return; }

    try {
        await fetch(API_URL + '/equipamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, codigo, status })
        });

        document.getElementById('input-nome').value   = '';
        document.getElementById('input-codigo').value = '';
        carregarEquipamentos();

    } catch (erro) {
        console.log('Erro ao cadastrar:', erro);
    }
}

async function excluirEquipamento(id) {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
        await fetch(API_URL + '/equipamentos/' + id, { method: 'DELETE' });
        carregarEquipamentos();
    } catch (erro) {
        console.log('Erro ao excluir:', erro);
    }
}
async function carregarMovimentacoes() {
    try {
        const respostaEq = await fetch(API_URL + '/equipamentos');
        const equipamentos = await respostaEq.json();

        const select = document.getElementById('input-equipamento-mov');
        select.innerHTML = '<option value="">Selecione o equipamento</option>';
        equipamentos.forEach(eq => {
            select.innerHTML += `<option value="${eq.id}">${eq.nome} - ${eq.codigo}</option>`;
        });

        const respostaMov = await fetch(API_URL + '/movimentacoes');
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
        console.log('Backend não conectado:', erro);
    }
}

async function registrarMovimentacao() {
    const equipamentoId = document.getElementById('input-equipamento-mov').value;
    const funcionario   = document.getElementById('input-funcionario').value;
    const tipo          = document.getElementById('input-tipo-mov').value;

    if (!equipamentoId || !funcionario) { alert('Selecione o equipamento e informe o funcionário!'); return; }

    try {
        await fetch(API_URL + '/movimentacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ equipamentoId, funcionario, tipo })
        });

        document.getElementById('input-funcionario').value = '';
        carregarMovimentacoes();

    } catch (erro) {
        console.log('Erro ao registrar:', erro);
    }
}
function badgeStatus(status) {
    if (status === 'DISPONIVEL') return '<span class="badge badge-verde">Disponível</span>';
    if (status === 'EM_USO')     return '<span class="badge badge-laranja">Em uso</span>';
    if (status === 'MANUTENCAO') return '<span class="badge badge-vermelho">Manutenção</span>';
    return status;
}

carregarDashboard();