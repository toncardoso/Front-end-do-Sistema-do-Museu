const express = require('express');
const path = require('path');
const app = express();

// Configurar o servidor para servir arquivos est�ticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a p�gina inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pim/index.html'));
});

// Porta em que o servidor ir� escutar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
