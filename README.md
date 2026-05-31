# 📦 Sistema de Almoxarifado

Sistema web para controle de estoque e movimentação de equipamentos.

## 🖥️ Tecnologias

- **Frontend:** HTML, CSS e JavaScript puro
- **Backend:** Java 17 + Spring Boot
- **Banco de dados:** MySQL 8

## ✅ Funcionalidades

- Dashboard com totais de equipamentos por status
- Cadastro e listagem de equipamentos
- Controle de saída e devolução de equipamentos
- Histórico completo de movimentações
- Atualização automática de status do equipamento

## ⚙️ Como rodar o projeto

### Pré-requisitos
- Java 17 instalado
- MySQL 8 instalado
- IntelliJ IDEA

### Passo 1 — Banco de dados
Abra o MySQL e execute:
CREATE DATABASE almoxarifado;

### Passo 2 — Configurar credenciais
Abra o arquivo src/main/resources/application.properties e ajuste:
spring.datasource.username=root
spring.datasource.password=SUA_SENHA

### Passo 3 — Rodar o backend
Abra o projeto no IntelliJ e rode a classe AlmoxBackendApplication.

### Passo 4 — Acessar o sistema
Abra o navegador e acesse:
http://localhost:8080

## 👨‍💻 Autor

Desenvolvido por RenanC4m1lo