package com.almox.almoxarifado.controller;

import com.almox.almoxarifado.model.Equipamento;
import com.almox.almoxarifado.service.EquipamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipamentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipamentoController{

    private final EquipamentoService service;

    @GetMapping
    public List<Equipamento> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Equipamento cadastrar(@RequestBody Equipamento equipamento) {
        return service.salvar(equipamento);
    }

    @PutMapping("/{id}")
    public Equipamento atualizar(@PathVariable Long id, @RequestBody Equipamento equipamento) {
        return service.atualizar(id, equipamento);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}