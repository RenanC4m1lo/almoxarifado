package com.almox.almoxarifado.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String username;

    private String senha;

    @Enumerated(EnumType.STRING)
    private Perfil perfil;

    private boolean ativo = true;

    public enum Perfil {
        ADMIN,
        TECNICO
    }
}