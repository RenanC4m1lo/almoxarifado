package com.almox.almoxarifado.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "equipamentos")
public class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String codigo;
    private String numeroSerie;
    private String observacoes;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Tipo {
        ROTEADOR,
        ONU,
        CABO,
        SWITCH,
        FERRAMENTA,
        OUTROS
    }

    public enum Status {
        DISPONIVEL,
        EM_USO,
        MANUTENCAO
    }
}