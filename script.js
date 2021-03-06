const Modal = {
    open() {
        //abre odal
        //insere a class active
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close() {
        //fecha o modal
        //remove a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    //LocalStorage tem propriedades por ser uma funcionalidade
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
        
    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()

    },

    incomes(){
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income;
    },

    expenses(){
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
                
            }
        })
        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        
        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense" 

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img  onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transa????o">
            </td>
        `

        return html
    },

    updateBalance(){
        document
            //pega pelo ID
            .getElementById('incomeDisplay')
            //Insere um objeto do Utils, o formatCurrency que formata em dinheiro
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    //Pega o valor
    //Trabalha sinais e formata????o

    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        return value
    },

    formatDate(date){

        //separar o ano, mes e o dia entre os tracinhos e vai colocar cada um dos numeros recebidos em uma posi????o dentro de um array
        const splittedDate = date.split("-")

        return`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        

        value = String(value).replace(/\D/g, "")

        //Deixa a pontua????o
        value = Number(value) / 100

        //Formata no dinheiro        
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }


}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    
    validateFields() {
        //Validar dados
        const {description, amount, date} = Form.getValues()
        
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        //Formatar os dados
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction){
        Transaction.add(transaction)
    },
    
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        
        try{
            // validar campos
            Form.validateFields()

            // pegar transa????o formatada
            const transaction = Form.formatValues()

            // salvar formul??io
            Form.saveTransaction(transaction)

            // apagar os dados do formul??rio
            Form.clearFields()

            // modal feche
            Modal.close()

        }catch (error) {
            alert(error.message)
        }           
        
    }
}

const App = {
    Init() {
        Transaction.all.forEach(function (transaction, index) {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
    reload() {
        DOM.clearTransactions()
        App.Init()
    },
}

App.Init()




