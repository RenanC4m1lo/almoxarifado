package com.almox.almoxarifado.controller;

import com.almox.almoxarifado.model.Usuario;
import com.almox.almoxarifado.security.JwtService;
import com.almox.almoxarifado.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        body.get("username"),
                        body.get("senha")
                )
        );

        String token = jwtService.gerarToken(body.get("username"));

        var usuario = usuarioService.listarTodos().stream()
                .filter(u -> u.getUsername().equals(body.get("username")))
                .findFirst().orElseThrow();

        return Map.of(
                "token", token,
                "nome", usuario.getNome(),
                "perfil", usuario.getPerfil().name()
        );
    }

    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarTodos();
    }

    @PostMapping("/usuarios")
    public Usuario cadastrarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.cadastrar(usuario);
    }

    @DeleteMapping("/usuarios/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        usuarioService.deletar(id);
    }
}