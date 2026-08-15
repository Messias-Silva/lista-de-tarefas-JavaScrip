$(document).ready(function() {

    // Mensagem de boas-vindas com efeito fluído
    $('#message').html('Bem-vindo à sua lista de tarefas!').fadeIn(1000).delay(2000).fadeOut(1000);

    function setupTaskInputListener() {
        const button = $('#add-button');
        const taskInput = $('#task-input');

        button.on('click', handleAddTask);

        taskInput.on('keypress', function(event) {
            if (event.key === 'Enter') {
                handleAddTask();
            }
        });

        // 🔥 DELEGAÇÃO DE EVENTOS: Otimiza a memória e gerencia elementos dinâmicos
        // Ouvimos o clique no botão '.delete-button' através do pai '#to-do-list'
        $('#to-do-list').on('click', '.delete-button', function() {
            const buttonClicked = $(this);
            const listItem = buttonClicked.closest('li'); // Pega o 'li' correspondente
            const index = buttonClicked.data('index');

            // 🌟 Efeito de sumir suave antes de remover do LocalStorage e atualizar a tela
            listItem.fadeOut(400, function() {
                let tasks = JSON.parse(localStorage.getItem('lista-de-tarefas') || "[]");
                tasks.splice(index, 1);
                localStorage.setItem('lista-de-tarefas', JSON.stringify(tasks));
                showTasks(); // Reconstrói a lista atualizada
            });
        });
    }

    setupTaskInputListener();
    showTasks();

    function handleAddTask() {
        const taskInput = $('#task-input');
        const taskText = taskInput.val().trim();

        if (taskText === '') {
            showMessage('Por favor, digite uma tarefa.');
            return;
        }

        if (validateTask(taskText)) {
            showMessage('Esta tarefa já existe na lista.');
            return;
        }

        let tasks = JSON.parse(localStorage.getItem('lista-de-tarefas') || "[]");
        tasks.push({ nome: taskText });
        localStorage.setItem('lista-de-tarefas', JSON.stringify(tasks));
        
        taskInput.val('');
        showTasks();
    }

    function showTasks() {
        const tasks = JSON.parse(localStorage.getItem('lista-de-tarefas') || "[]");
        const taskList = $('#to-do-list');
        taskList.empty();

        if (tasks.length === 0) {
            taskList.html('<li style="background-color: transparent; justify-content: center;">Nenhuma tarefa adicionada.</li>');
            return;
        }

        // Adiciona os itens na tela (o evento de clique neles já está configurado no pai!)
        tasks.forEach((task, index) => {
            taskList.append(`<li>${task.nome} <button class="delete-button" data-index="${index}">Excluir</button></li>`);
        });
    }

    function validateTask(taskText) {
        const tasks = JSON.parse(localStorage.getItem('lista-de-tarefas') || "[]");
        // .toLowerCase() garante que "Estudar" e "estudar" sejam detectados como duplicados
        return tasks.some(task => task.nome.toLowerCase() === taskText.toLowerCase());
    }

    function showMessage(message) {
        // Interrompe animações anteriores se o usuário clicar rápido demais (.stop)
        $('#message').stop(true, true).text(message).fadeIn(500).delay(2000).fadeOut(500);
    }
});