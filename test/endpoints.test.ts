import categoryModel from '../src/tarefas/model/category.model'
import taskModel from '../src/tarefas/model/task.model'
import userModel from '../src/tarefas/model/user.model'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { tasks } from './data.tasks'
import { categories } from './data.categories'
import { users } from './data.users'
import * as request from 'supertest'
import app from '../src/app'


describe('Testes das tarefas', () => {

    async function deleteAll(){

        const tasks = await taskModel.find();

        if (tasks.length > 0){
            
            await Promise.all([
                taskModel.deleteMany(),
                categoryModel.deleteMany(),
                userModel.deleteMany()
            ]);

        }

    }

    async function fillTasks(){

        const promises = tasks.map(task => taskModel.create(task));
        await Promise.all(promises);

    }

    async function fillCategories(){

        const promises = categories.map(category => categoryModel.create(category));
        await Promise.all(promises);

    }

    async function fillUsers(){

        const promises = users.map(user => userModel.create(user))
        await Promise.all(promises)

    }

    beforeEach(async () => {
        Promise.all([
            await deleteAll(),
            await fillTasks(),
            await fillCategories(),
            await fillUsers()
        ])
    })

    it('Deve recuperar todos as tarefas', async () => {

        const response = await request.default(app).get('/tarefa/pesquisar');

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(tasks.length);
        
    })

    it('Deve criar uma nova tarefa', async () => {
    
        const task = {
            title: "Fazer um relatório de clientes",
            description: "Gerar um relatório dos clientes ativos.",
            creationDate: "01/19/2024",
            conclusionDate: "02/01/2024",
            category: "Profissional",
            type: "CRM",
            status: "Concluída",
            associatedUser: "gabriel.guerra"
        }

        const response = await request.default(app).post('/tarefa/criar').send(task);
        const foundTask = await taskModel.findById(response.body._id);

        expect(response.status).toEqual(201);
        expect(response.body._id).toBeDefined();
        expect(foundTask?.title).toBe(task.title);
        expect(foundTask?.description).toBe(task.description);
        expect(foundTask?.creationDate).toEqual(new Date(task.creationDate));
        expect(foundTask?.conclusionDate).toEqual(new Date(task.conclusionDate));
        expect(foundTask?.category).toBe(task.category);
        expect(foundTask?.type).toBe(task.type);
        expect(foundTask?.status).toBe(task.status);
        expect(foundTask?.associatedUser).toBe(task.associatedUser);

    })

    it('Deve Atualizar uma tarefa', async () => {

        const taskToUpdate = await taskModel.findOne({title: "Enviar e-mail para fornecedor."});

        const task = {
            title: "Fazer um relatório de clientes",
            description: "Gerar um relatório dos clientes ativos.",
            creationDate: "01/19/2024",
            conclusionDate: "02/01/2024",
            category: "Profissional",
            type: "CRM",
            status: "Concluída",
            associatedUser: "gabriel.guerra"
        }

        const response = await request.default(app).put(`/tarefa/atualizar/${taskToUpdate?._id}`).send(task);
        const foundTask = await taskModel.findById(response.body._id);

        expect(response.status).toEqual(200);
        expect(response.body._id).toBeDefined();
        expect(foundTask?.title).toBe(task.title);
        expect(foundTask?.description).toBe(task.description);
        expect(foundTask?.creationDate).toEqual(new Date(task.creationDate));
        expect(foundTask?.conclusionDate).toEqual(new Date(task.conclusionDate));
        expect(foundTask?.category).toBe(task.category);
        expect(foundTask?.type).toBe(task.type);
        expect(foundTask?.status).toBe(task.status);
        expect(foundTask?.associatedUser).toBe(task.associatedUser);

    })

    it('Deve Excluir uma tarefa', async () => {

        const taskToDelete = await taskModel.findOne({title: "Estudar para as provas"});
        const response = await request.default(app).delete(`/tarefa/excluir/${taskToDelete?._id}`);
        const foundTask = await taskModel.findById(taskToDelete?._id);

        expect(response.status).toEqual(200);
        expect(foundTask).toBe(null);

    })

    it('Deve pesquisar uma tarefa por id', async () => {
        const task = await taskModel.findOne({title: "Abrir vaga de emprego"});
        const response = await request.default(app).get(`/tarefa/pesquisar/id/${task?._id}`);

        expect(response.status).toEqual(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.title).toBe(task?.title);
        expect(response.body.description).toBe(task?.description);
        expect(response.body.creationDate).toBe(new Date(task!.creationDate).toISOString());
        expect(response.body.conclusionDate).toBe(new Date(task!.conclusionDate).toISOString());
        expect(response.body.category).toBe(task?.category);
        expect(response.body.type).toBe(task?.type);
        expect(response.body.status).toBe(task?.status);
        expect(response.body.associatedUser).toBe(task?.associatedUser);

    })

    it('Deve pesquisar as tarefas de um designado', async () => {

        const user = `gabriel.guerra`;

        const response = await request.default(app).get(`/tarefa/pesquisar/designado/${user}`);
        const userTasks = tasks.filter(task => task.associatedUser === `${user}`);

        expect(response.status).toEqual(200);
        for (let i = 0; i < response.body.length; i++){
            expect(response.body[i]._id).toBeDefined();
            expect(response.body[i].title).toBe(userTasks[i]?.title);
            expect(response.body[i].description).toBe(userTasks[i]?.description);
            expect(response.body[i].creationDate).toBe(new Date(userTasks[i]!.creationDate).toISOString());
            expect(response.body[i].conclusionDate).toBe(new Date(userTasks[i]!.conclusionDate).toISOString());
            expect(response.body[i].category).toBe(userTasks[i]?.category);
            expect(response.body[i].type).toBe(userTasks[i]?.type);
            expect(response.body[i].status).toBe(userTasks[i]?.status);
            expect(response.body[i].associatedUser).toBe(userTasks[i]?.associatedUser);
        }

    })

    it('Deve pesquisar tarefas por categoria', async () => {

        const category = 'Profissional'

        const response = await request.default(app).get(`/tarefa/pesquisar/categoria/${category}`);
        const categoryTasks = tasks.filter(task => task.category === `${category}`);

        expect(response.status).toEqual(200);
        for (let i = 0; i < response.body.length; i++){
            expect(response.body[i]._id).toBeDefined();
            expect(response.body[i].title).toBe(categoryTasks[i]?.title);
            expect(response.body[i].description).toBe(categoryTasks[i]?.description);
            expect(response.body[i].creationDate).toBe(new Date(categoryTasks[i]!.creationDate).toISOString());
            expect(response.body[i].conclusionDate).toBe(new Date(categoryTasks[i]!.conclusionDate).toISOString());
            expect(response.body[i].category).toBe(categoryTasks[i]?.category);
            expect(response.body[i].type).toBe(categoryTasks[i]?.type);
            expect(response.body[i].status).toBe(categoryTasks[i]?.status);
            expect(response.body[i].associatedUser).toBe(categoryTasks[i]?.associatedUser);
        }

    })
    
    it('Deve listar tarefas concluídas', async () => {

        const status = 'Concluída'

        const response = await request.default(app).get(`/tarefa/concluidas`);
        const statusTasks = tasks.filter(task => task.status === `${status}`);

        expect(response.status).toEqual(200);
        for (let i = 0; i < response.body.length; i++){
            expect(response.body[i]._id).toBeDefined();
            expect(response.body[i].title).toBe(statusTasks[i]?.title);
            expect(response.body[i].description).toBe(statusTasks[i]?.description);
            expect(response.body[i].creationDate).toBe(new Date(statusTasks[i]!.creationDate).toISOString());
            expect(response.body[i].conclusionDate).toBe(new Date(statusTasks[i]!.conclusionDate).toISOString());
            expect(response.body[i].category).toBe(statusTasks[i]?.category);
            expect(response.body[i].type).toBe(statusTasks[i]?.type);
            expect(response.body[i].status).toBe(statusTasks[i]?.status);
            expect(response.body[i].associatedUser).toBe(statusTasks[i]?.associatedUser);
        }

    })

    it('Deve listar tarefas pendentes', async () => {

        const status = 'Pendente'

        const response = await request.default(app).get(`/tarefa/pendentes`);
        const statusTasks = tasks.filter(task => task.status === `${status}`);

        expect(response.status).toEqual(200);
        for (let i = 0; i < response.body.length; i++){
            expect(response.body[i]._id).toBeDefined();
            expect(response.body[i].title).toBe(statusTasks[i]?.title);
            expect(response.body[i].description).toBe(statusTasks[i]?.description);
            expect(response.body[i].creationDate).toBe(new Date(statusTasks[i]!.creationDate).toISOString());
            expect(response.body[i].conclusionDate).toBe(new Date(statusTasks[i]!.conclusionDate).toISOString());
            expect(response.body[i].category).toBe(statusTasks[i]?.category);
            expect(response.body[i].type).toBe(statusTasks[i]?.type);
            expect(response.body[i].status).toBe(statusTasks[i]?.status);
            expect(response.body[i].associatedUser).toBe(statusTasks[i]?.associatedUser);
        }

    })

    it('Deve pesquisar as tarefas em um intervalo informado', async () => {

        const dates = {
            startDate: "01/01/2024",
            endDate: "04/01/2024"
        }

        const response = await request.default(app).post('/tarefa/pesquisar/data').send(dates);
        const taskInInterval = tasks.filter(task => task.conclusionDate! < dates.endDate && task.conclusionDate! > dates.startDate);

        expect(response.status).toEqual(200);
        for (let i = 0; i < response.body.length; i++){
            expect(response.body[i]._id).toBeDefined();
            expect(response.body[i].title).toBe(taskInInterval[i]?.title);
            expect(response.body[i].description).toBe(taskInInterval[i]?.description);
            expect(response.body[i].creationDate).toBe(new Date(taskInInterval[i]!.creationDate).toISOString());
            expect(response.body[i].conclusionDate).toBe(new Date(taskInInterval[i]!.conclusionDate).toISOString());
            expect(response.body[i].category).toBe(taskInInterval[i]?.category);
            expect(response.body[i].type).toBe(taskInInterval[i]?.type);
            expect(response.body[i].status).toBe(taskInInterval[i]?.status);
            expect(response.body[i].associatedUser).toBe(taskInInterval[i]?.associatedUser);
        }
    })

    it('Deve contar o número de tarefas de um usuário', async () => {
        
        const user = `gabriel.guerra`;
        const response = await request.default(app).get(`/tarefa/contar/${user}`);
        const userTasks = tasks.filter(task => task.associatedUser === `${user}`);

        expect(response.status).toEqual(200);
        expect(response.body).toBe(userTasks.length);

    })

    it('Deve retornar a tarefa mais recente de um usuário', async () => {
        
        const user = `gabriel.guerra`;
        const response = await request.default(app).get(`/tarefa/mais-recente/${user}`);
        const userTasks = tasks.filter(task => task.associatedUser === `${user}`);
        const mostRecent = userTasks.reduce((task1, task2) => {
            return task1.creationDate > task2.creationDate ? task1 : task2;
        });

        expect(response.status).toEqual(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.title).toBe(mostRecent?.title);
        expect(response.body.description).toBe(mostRecent?.description);
        expect(response.body.creationDate).toBe(new Date(mostRecent!.creationDate).toISOString());
        expect(response.body.conclusionDate).toBe(new Date(mostRecent!.conclusionDate).toISOString());
        expect(response.body.category).toBe(mostRecent?.category);
        expect(response.body.type).toBe(mostRecent?.type);
        expect(response.body.status).toBe(mostRecent?.status);
        expect(response.body.associatedUser).toBe(mostRecent?.associatedUser);

    })

    it('Deve calcular média de conclusão das tarefas', async () => {

        const days = tasks.map(item => {
            const conclusion = new Date(item.conclusionDate!);
            const creation = new Date(item.creationDate!);

            const diff = (conclusion.getTime() - creation.getTime()) / (1000 * 3600 * 24);
            return diff;
        });

        const avg = (days.reduce((v1, v2) => v1 + v2, 0))/days.length;
        
        const response = await request.default(app).get(`/tarefa/media-conclusao`);

        expect(response.status).toEqual(200);
        expect(response.body.mediaConclusaoDias).toEqual(avg);


    })

    it('Deve encontrar a tarefa de maior descrição', async () => {

        const response = await request.default(app).get(`/tarefa/maior-descricao`);
        const biggestDescription = tasks.reduce((task1, task2) => {
            return task1.description.length > task2.description.length ? task1 : task2;
        });

        expect(response.status).toEqual(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.title).toBe(biggestDescription?.title);
        expect(response.body.description).toBe(biggestDescription?.description);
        expect(response.body.creationDate).toBe(new Date(biggestDescription!.creationDate).toISOString());
        expect(response.body.conclusionDate).toBe(new Date(biggestDescription!.conclusionDate).toISOString());
        expect(response.body.category).toBe(biggestDescription?.category);
        expect(response.body.type).toBe(biggestDescription?.type);
        expect(response.body.status).toBe(biggestDescription?.status);
        expect(response.body.associatedUser).toBe(biggestDescription?.associatedUser);

    })

    it('Deve retornar a tarefa mais antiga de um usuário', async () => {
        
        const user = `gabriel.guerra`;
        const response = await request.default(app).get(`/tarefa/mais-antiga/${user}`);
        const userTasks = tasks.filter(task => task.associatedUser === `${user}`);
        const mostRecent = userTasks.reduce((task1, task2) => {
            return task1.creationDate < task2.creationDate ? task1 : task2;
        });

        expect(response.status).toEqual(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.title).toBe(mostRecent?.title);
        expect(response.body.description).toBe(mostRecent?.description);
        expect(response.body.creationDate).toBe(new Date(mostRecent!.creationDate).toISOString());
        expect(response.body.conclusionDate).toBe(new Date(mostRecent!.conclusionDate).toISOString());
        expect(response.body.category).toBe(mostRecent?.category);
        expect(response.body.type).toBe(mostRecent?.type);
        expect(response.body.status).toBe(mostRecent?.status);
        expect(response.body.associatedUser).toBe(mostRecent?.associatedUser);

    })

    it('Deve agrupas as categorias das tarefas', async () => {

        const uniqueCategories = [...new Set(tasks.map(task => task.category))];
        let group = uniqueCategories.map(category => {
            const occurences = tasks.filter(task => task.category === category).length
            return { categoria: category, quantidade: occurences}
        })

        const response = await request.default(app).get('/tarefa/agrupar-categoria');
       

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(group.length);
        for(let i=0; i< response.body.length; i++){
            expect(response.body).toContainEqual(group[i])
        }

    })
    

})

describe('Testes das categorias', () => {

    async function deleteAll(){

        const tasks = await taskModel.find();

        if (tasks.length > 0){
            
            await Promise.all([
                taskModel.deleteMany(),
                categoryModel.deleteMany(),
                userModel.deleteMany()
            ]);

        }

    }

    async function fillTasks(){

        const promises = tasks.map(task => taskModel.create(task));
        await Promise.all(promises);

    }

    async function fillCategories(){

        const promises = categories.map(category => categoryModel.create(category));
        await Promise.all(promises);

    }

    async function fillUsers(){

        const promises = users.map(user => userModel.create(user))
        await Promise.all(promises)

    }

    beforeEach(async () => {
        Promise.all([
            await deleteAll(),
            await fillTasks(),
            await fillCategories(),
            await fillUsers()
        ])
    })

    it('Deve recuperar todos as categorias', async () => {

        const response = await request.default(app).get('/categoria/pesquisar');

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(categories.length);
        
    })

    it('Deve criar uma nova categoria', async () => {
    
        const category = {
            name: "Reunião",
            color: "Amarelo"
        }

        const response = await request.default(app).post('/categoria/criar').send(category);
        const foundCategory = await categoryModel.findById(response.body._id);

        expect(response.status).toEqual(201);
        expect(response.body._id).toBeDefined();
        expect(foundCategory?.name).toBe(category.name);
        expect(foundCategory?.color).toBe(category.color);

    })

    it('Deve Atualizar uma categoria', async () => {

        const categoryToUpdate = await categoryModel.findOne({name: "Cultural"});

        const category = {
            name: "Consulta",
            color: "Branco"
        }

        const response = await request.default(app).put(`/categoria/atualizar?id=${categoryToUpdate?._id}`).send(category);
        const foundCategory = await categoryModel.findById(response.body._id);

        expect(response.status).toEqual(200);
        expect(response.body._id).toBeDefined();
        expect(foundCategory?.name).toBe(category.name);
        expect(foundCategory?.color).toBe(category.color);

    })

    it('Deve Excluir uma categoria', async () => {

        const categoryToDelete = await categoryModel.findOne({name: "Profissional"});
        const response = await request.default(app).delete(`/categoria/excluir?id=${categoryToDelete?._id}`);
        const foundCategory = await categoryModel.findById(categoryToDelete?._id);

        expect(response.status).toEqual(200);
        expect(foundCategory).toBe(null);

    })

    it('Deve pesquisar as categorias de um designado', async () => {

        const user = `gabriel.guerra`;
        const userTasks = tasks.filter(task => task.associatedUser === `${user}`);
        const userCategories = [...new Set(userTasks.map(task => task.category))]

        const response = await request.default(app).get(`/categoria/designado/${user}`);
        

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(userCategories)

    })
})

describe('Testes dos usuários', () => {

    async function deleteAll(){

        const tasks = await taskModel.find();

        if (tasks.length > 0){
            
            await Promise.all([
                taskModel.deleteMany(),
                categoryModel.deleteMany(),
                userModel.deleteMany()
            ]);

        }

    }

    async function fillTasks(){

        const promises = tasks.map(task => taskModel.create(task));
        await Promise.all(promises);

    }

    async function fillCategories(){

        const promises = categories.map(category => categoryModel.create(category));
        await Promise.all(promises);

    }

    async function fillUsers(){

        const promises = users.map(user => userModel.create(user))
        await Promise.all(promises)

    }

    beforeEach(async () => {
        Promise.all([
            await deleteAll(),
            await fillTasks(),
            await fillCategories(),
            await fillUsers()
        ])
    })

    it('Deve recuperar todos os usuários', async () => {

        const response = await request.default(app).get('/usuario/pesquisar');

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(users.length);
        
    })

    it('Deve criar um novo usuário', async () => {
    
        const user = {
            "username": "marcos.santos",
            "password": "741",
            "email": "marcos.santos@email.com",
            "weight": 81
        }

        const response = await request.default(app).post('/usuario/criar').send(user);
        const foundUser = await userModel.findById(response.body._id);

        expect(response.status).toEqual(201);
        expect(response.body._id).toBeDefined();
        expect(foundUser?.username).toBe(user.username);
        expect(foundUser?.password).toBe(user.password);
        expect(foundUser?.email).toBe(user.email);
        expect(foundUser?.weight).toBe(user.weight);
        

    })

    it('Deve Atualizar um usuário', async () => {

        const userToUpdate = await userModel.findOne({username: "ricardo.lemos"});

        const user = {
            "username": "carla.dias",
            "password": "159",
            "email": "carla.dias@email.com",
            "weight": 64
        }

        const response = await request.default(app).put(`/usuario/atualizar?id=${userToUpdate?._id}`).send(user);
        const foundUser = await userModel.findById(response.body._id);

        expect(response.status).toEqual(200);
        expect(response.body._id).toBeDefined();
        expect(foundUser?.username).toBe(user.username);
        expect(foundUser?.password).toBe(user.password);
        expect(foundUser?.email).toBe(user.email);
        expect(foundUser?.weight).toBe(user.weight);

    })

    it('Deve Excluir um usuário', async () => {

        const userToDelete = await userModel.findOne({username: "maria.silva"});
        const response = await request.default(app).delete(`/usuario/excluir?id=${userToDelete?._id}`);
        const foundUser = await userModel.findById(userToDelete?._id);

        expect(response.status).toEqual(200);
        expect(foundUser).toBe(null);

    })

})