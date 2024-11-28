import axios from 'axios';
import { BASE_URL } from '../services/Constantes';

class QuestionariosService {
    constructor() {
        this.api = axios.create({
            baseURL: `${BASE_URL}api/Questionarios`,
        });
    }

    // Obtém todas as respostas do questionário
    async getAll() {
        try {
            const response = await this.api.get('/');
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao obter respostas do questionário: ${error.response?.data?.message || error.message}`);
        }
    }

    // Adiciona uma nova resposta ao questionário
    async create(data) {
        try {
            const response = await this.api.post('/', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao criar a resposta do questionário: ${error.response?.data?.message || error.message}`);
        }
    }

    // Atualiza uma resposta existente no questionário
    async update(id, data) {
        try {
            const response = await this.api.put(`/${id}`, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Resposta não encontrada.");
            }
            throw new Error(`Erro ao atualizar a resposta: ${error.response?.data?.message || error.message}`);
        }
    }

    // Exclui uma resposta do questionário
    async delete(id) {
        try {
            const response = await this.api.delete(`/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Resposta não encontrada.");
            }
            throw new Error(`Erro ao excluir a resposta: ${error.response?.data?.message || error.message}`);
        }
    }
}

export default new QuestionariosService();
