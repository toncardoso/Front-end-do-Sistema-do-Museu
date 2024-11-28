document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.style.display = 'none'); // Esconde todas as seções inicialmente
    document.querySelector('.pre-questionario').style.display = 'block'; // Exibe a tela pré-questionário
});

// Objeto global para armazenar respostas do questionário
const userResponses = {};

// Mapeamento das perguntas
const perguntas = {
    dataNascimento: "Por favor, informe sua data de nascimento.",
    pergunta1: "1. Como você avalia a organização das exposições no museu?",
    pergunta2: "2. Qual a sua satisfação com a clareza das informações nas exposições?",
    pergunta3: "3. Como você avalia a variedade de temas abordados nas exposições?",
    pergunta4: "4. A experiência no museu conseguiu atender ou superar suas expectativas?",
    pergunta5: "5. Como você avaliaria a sua intenção de visitar o museu novamente?",
    comentarios: "Deixe seu Feedback e ajude-nos a melhorar!",
};

// Inicializa as seções, exibindo apenas a tela inicial
function initializeSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => (section.style.display = 'none'));
    document.querySelector('.pre-questionario').style.display = 'block';
}

// Inicia o questionário, exibindo a primeira tela
function startQuiz() {
    document.querySelector('.pre-questionario').style.display = 'none';
    document.querySelector('.inicio').style.display = 'block';
}

// Gerencia a navegação entre seções e captura respostas
function handleNext(event, current, next) {
    event.preventDefault();

    const currentSection = document.getElementById(current);
    const nextSection = document.getElementById(next);

    // Captura respostas do formulário atual, se houver
    const form = currentSection.querySelector('form');
    if (form) {
        if (!form.reportValidity()) return; // Valida o formulário

        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            userResponses[key] = value; // Salva a resposta
        }
    }

    // Se a validação passar, esconde a seção atual e exibe a próxima
    currentSection.style.display = 'none';
    nextSection.style.display = 'block';

    // Caso seja a última etapa antes do envio
    if (next === 'relatorio') {
        submitResponses(); // Envia as respostas ao backend
    }
}

// Envia todas as respostas do questionário em um único payload
async function submitResponses() {
    try {
        // Monta o payload no formato esperado pela API
        const data = {
            email: userResponses.email || null, // Captura o e-mail
            dataNascimento: userResponses.dataNascimento || null,
            pergunta1: perguntas.pergunta1,
            resposta1: userResponses.pergunta1 || null,
            pergunta2: perguntas.pergunta2,
            resposta2: userResponses.pergunta2 || null,
            pergunta3: perguntas.pergunta3,
            resposta3: userResponses.pergunta3 || null,
            pergunta4: perguntas.pergunta4,
            resposta4: userResponses.pergunta4 || null,
            pergunta5: perguntas.pergunta5,
            resposta5: userResponses.pergunta5 || null,
            comentarios: userResponses.comentarios || null,
        };

        // Envia o questionário completo para a API
        await createQuestionario(data);

        console.log('Questionário enviado com sucesso.');
        alert('Suas respostas foram enviadas com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o questionário:', error.message);
        alert('Ocorreu um erro ao salvar suas respostas. Tente novamente.');
    }
}

// Exibe o relatório final na seção apropriada
function displayReport() {
    const tableBody = document.querySelector('#relatorio tbody');
    tableBody.innerHTML = ''; // Limpa o conteúdo anterior

    Object.entries(userResponses).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${perguntas[key]}</td>
            <td>${value || "Não respondido"}</td>
        `;
        tableBody.appendChild(row);
    });

    console.log('Relatório final:', userResponses); // Debug
}

/* Crud para chamadas da API */

// Método `create` para enviar os dados ao backend usando fetch
async function createQuestionario(data) {
    const BASE_URL = 'http://localhost:5209/api/Questionarios'; // URL base da API

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Define o tipo de conteúdo
            },
            body: JSON.stringify(data), // Converte o objeto para JSON
        });

        if (!response.ok) {
            // Lança erro se a resposta não for bem-sucedida (status >= 400)
            const errorData = await response.json();
            throw new Error(
                `Erro ao criar a resposta do questionário: ${errorData.message || response.statusText}`
            );
        }

        // Retorna os dados da resposta da API
        return await response.json();
    } catch (error) {
        throw new Error(
            `Erro ao criar a resposta do questionário: ${error.message}`
        );
    }
}
