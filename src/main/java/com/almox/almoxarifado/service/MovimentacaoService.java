package com.almox.almoxarifado.service;

import com.almox.almoxarifado.model.Equipamento;
import com.almox.almoxarifado.model.Movimentacao;
import com.almox.almoxarifado.repository.MovimentacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {

    private final MovimentacaoRepository repository;
    private final EquipamentoService equipamentoService;

    public List<Movimentacao> listarTodas() {
        return repository.findAll();
    }

    public Movimentacao registrar(Long equipamentoId, String funcionario, Movimentacao.Tipo tipo) {
        Equipamento equipamento = equipamentoService.buscarPorId(equipamentoId);

        if (tipo == Movimentacao.Tipo.SAIDA) {
            equipamento.setStatus(Equipamento.Status.EM_USO);
        } else {
            equipamento.setStatus(Equipamento.Status.DISPONIVEL);
        }
        equipamentoService.salvar(equipamento);

        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setEquipamento(equipamento);
        movimentacao.setFuncionario(funcionario);
        movimentacao.setTipo(tipo);
        movimentacao.setDataHora(LocalDateTime.now());

        return repository.save(movimentacao);
    }
}