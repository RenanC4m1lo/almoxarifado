package com.almox.almoxarifado.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "movimentacoes")
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipamento_id")
    private Equipamento equipamento;

    private String funcionario;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    private LocalDateTime dataHora;

    public enum Tipo {
        ENTRADA,
        SAIDA
    }
}