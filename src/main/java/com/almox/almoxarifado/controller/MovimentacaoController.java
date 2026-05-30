package com.almox.almoxarifado.controller;

import com.almox.almoxarifado.model.Movimentacao;
import com.almox.almoxarifado.service.MovimentacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/movimentacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MovimentacaoController {

    private final MovimentacaoService service;

    @GetMapping
    public List<Movimentacao> listarTodas() {
        return service.listarTodas();
    }

    @PostMapping
    public Movimentacao registrar(@RequestBody Map<String, String> body) {
        Long equipamentoId = Long.parseLong(body.get("equipamentoId"));
        String funcionario = body.get("funcionario");
        Movimentacao.Tipo tipo = Movimentacao.Tipo.valueOf(body.get("tipo"));
        return service.registrar(equipamentoId, funcionario, tipo);
    }
}