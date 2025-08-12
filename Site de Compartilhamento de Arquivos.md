# Site de Compartilhamento de Arquivos

Um sistema web completo para compartilhamento de arquivos entre dispositivos, desenvolvido com Flask (backend) e HTML/CSS/JavaScript (frontend).

## 🚀 Funcionalidades

- **Upload de Arquivos**: Envie arquivos através de drag & drop ou seleção manual
- **Listagem de Arquivos**: Visualize todos os arquivos enviados com informações detalhadas
- **Download de Arquivos**: Baixe arquivos com um clique
- **Exclusão de Arquivos**: Remova arquivos desnecessários
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Feedback Visual**: Notificações toast e barras de progresso
- **Modal de Informações**: Visualize detalhes completos dos arquivos

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **Flask-CORS**: Suporte a requisições cross-origin
- **Werkzeug**: Utilitários para aplicações web
- **SQLAlchemy**: ORM para banco de dados (opcional)

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com gradientes e animações
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones vetoriais

## 📁 Estrutura do Projeto

```
file_sharing_app/
├── src/
│   ├── main.py              # Aplicação principal Flask
│   ├── routes/
│   │   ├── files.py         # Rotas para gerenciamento de arquivos
│   │   └── user.py          # Rotas de usuário (template)
│   ├── models/
│   │   └── user.py          # Modelos de dados
│   ├── static/
│   │   ├── index.html       # Interface principal
│   │   ├── css/
│   │   │   └── style.css    # Estilos responsivos
│   │   └── js/
│   │       └── script.js    # Funcionalidades JavaScript
│   ├── uploads/             # Pasta para arquivos enviados
│   └── database/
│       └── app.db           # Banco de dados SQLite
├── venv/                    # Ambiente virtual Python
├── requirements.txt         # Dependências do projeto
└── README.md               # Documentação
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)

### Passos para instalação

1. **Clone ou baixe o projeto**
   ```bash
   cd file_sharing_app
   ```

2. **Ative o ambiente virtual**
   ```bash
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute a aplicação**
   ```bash
   python src/main.py
   ```

5. **Acesse no navegador**
   ```
   http://localhost:5000
   ```

## 🌐 Deploy em Produção

O projeto está configurado para deploy automático. A aplicação em produção está disponível em:

**URL de Produção**: https://3dhkilcexeeo.manus.space

### Características do Deploy
- Servidor WSGI otimizado para produção
- CORS configurado para acesso de qualquer origem
- Arquivos estáticos servidos eficientemente
- Logs de aplicação disponíveis

## 📱 Responsividade

O site foi desenvolvido com design responsivo, adaptando-se automaticamente a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Interface adaptada para toque
- **Mobile**: Layout otimizado para dispositivos móveis

### Breakpoints
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: ≤ 480px

## 🔒 Segurança

### Medidas Implementadas
- **Validação de Arquivos**: Tipos de arquivo permitidos configuráveis
- **Nomes Únicos**: Arquivos recebem IDs únicos para evitar conflitos
- **Sanitização**: Nomes de arquivo são sanitizados para segurança
- **Limite de Tamanho**: Controle de tamanho máximo de upload (100MB)

### Tipos de Arquivo Suportados
- Documentos: PDF, DOC, DOCX, TXT
- Imagens: PNG, JPG, JPEG, GIF
- Áudio: MP3
- Vídeo: MP4, AVI
- Compactados: ZIP, RAR

## 🎨 Interface do Usuário

### Design
- **Gradiente Moderno**: Cores roxo/azul para visual atrativo
- **Animações Suaves**: Transições e hover effects
- **Feedback Visual**: Toasts, progress bars e loading states
- **Ícones Intuitivos**: Font Awesome para melhor UX

### Funcionalidades UX
- Drag & drop para upload
- Confirmação antes de exclusão
- Indicadores de progresso
- Notificações de sucesso/erro
- Modal com informações detalhadas

## 🔄 API Endpoints

### Upload de Arquivo
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (arquivo)
```

### Listar Arquivos
```
GET /api/files
Response: JSON com lista de arquivos
```

### Download de Arquivo
```
GET /api/download/<filename>
Response: Arquivo para download
```

### Informações do Arquivo
```
GET /api/info/<filename>
Response: JSON com detalhes do arquivo
```

### Excluir Arquivo
```
DELETE /api/delete/<filename>
Response: Confirmação de exclusão
```

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas
- [ ] Autenticação de usuários
- [ ] Compartilhamento por links temporários
- [ ] Preview de arquivos (imagens, PDFs)
- [ ] Organização por pastas
- [ ] Histórico de downloads
- [ ] Compressão automática
- [ ] Integração com cloud storage

### Otimizações Técnicas
- [ ] Cache de arquivos
- [ ] Compressão gzip
- [ ] CDN para assets estáticos
- [ ] Monitoramento de performance
- [ ] Backup automático

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no repositório
- Entre em contato através do email de suporte

---

**Desenvolvido com ❤️ usando Flask e tecnologias web modernas**

