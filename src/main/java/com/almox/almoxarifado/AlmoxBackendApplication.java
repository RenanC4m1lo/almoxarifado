package com.almox.almoxarifado;

import com.almox.almoxarifado.model.Usuario;
import com.almox.almoxarifado.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class AlmoxBackendApplication implements CommandLineRunner {

    private final UsuarioService usuarioService;

    public static void main(String[] args) {
        SpringApplication.run(AlmoxBackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        if (!usuarioService.existeAdmin()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setUsername("admin");
            admin.setSenha("admin123");
            admin.setPerfil(Usuario.Perfil.ADMIN);
            usuarioService.cadastrar(admin);
            System.out.println("Admin padrão criado — login: admin / senha: admin123");
        }
    }
}