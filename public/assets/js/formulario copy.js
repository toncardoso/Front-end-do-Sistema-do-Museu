import QuestionariosService from './services/QuestionariosService';

const questionariosService = new QuestionariosService();

// Executado quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeSections();
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
        submitResponsesIndividually(); // Salva as respostas no banco
    }

}

// Envia as respostas do usuário para o banco de dados
async function submitResponsesIndividually() {
    try {
        const promises = Object.entries(userResponses).map(async ([key, value]) => {
            // Monta o payload para cada resposta
            const data = {
                avaliacao: perguntas[key], // Pergunta correspondente
                sugestao: value,          // Resposta do usuário
            };

            // Chama a API para salvar a resposta
            return await questionariosService.create(data);
        });

        // Aguarda todas as requisições serem concluídas
        await Promise.all(promises);

        console.log('Todas as respostas foram enviadas com sucesso.');
    } catch (error) {
        console.error('Erro ao enviar as respostas:', error.message);
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