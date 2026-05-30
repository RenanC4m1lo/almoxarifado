package com.almox.almoxarifado.service;

import com.almox.almoxarifado.model.Equipamento;
import com.almox.almoxarifado.repository.EquipamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipamentoService {

    private final EquipamentoRepository repository;

    public List<Equipamento> listarTodos() {
        return repository.findAll();
    }

    public Equipamento salvar(Equipamento equipamento) {
        return repository.save(equipamento);
    }

    public Equipamento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
    }

    public Equipamento atualizar(Long id, Equipamento equipamento) {
        Equipamento existente = buscarPorId(id);
        existente.setNome(equipamento.getNome());
        existente.setCodigo(equipamento.getCodigo());
        existente.setStatus(equipamento.getStatus());
        return repository.save(existente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}