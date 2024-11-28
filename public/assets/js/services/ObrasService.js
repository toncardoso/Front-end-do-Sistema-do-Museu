import axios from 'axios';

import { BASE_URL } from '../services/Constantes';

class ObrasService {
    constructor() {
        this.api = axios.create({
            baseURL: `${BASE_URL}api/Obras`,
        });
    }

    async getAll() {
        try {
            const response = await this.api.get('/');
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao obter obras: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Obra não encontrada.");
            }
            throw new Error(`Erro ao obter a obra: ${error.message}`);
        }
    }

    async create(data) {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            const response = await this.api.post('/', formData);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao criar a obra: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            await this.api.put(`/${id}`, formData);
            return { message: "Obra atualizada com sucesso." };
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Obra não encontrada.");
            }
            throw new Error(`Erro ao atualizar a obra: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            await this.api.delete(`/${id}`);
            return { message: "Obra excluída com sucesso." };
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Obra não encontrada.");
            }
            throw new Error(`Erro ao excluir a obra: ${error.message}`);
        }
    }
}
