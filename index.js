const express = require('express')
const app = express()
app.use(express.json())
const pool = require('./db')


app.get('/pegar/usuario', async function (req, res) {
    try{
        //Consultar dados da tabela
        const [rows, fields] = await pool.query('SELECT * FROM usuario')

        return res.status(200).json([rows])
    } catch (error){
        console.error(error)
        return res.status(500).json({message: 'Erro ao obter os USUARIOS no banco de dados.'})
    }
})

app.get('/pegar/faculdade', async (req,res) => {
    try{
        //Consultar dados da tabela
        const [rows, fields] = await pool.query('SELECT * FROM faculdade')
        
        return res.status(200).json([rows])
    } catch (error){
        console.error(error)
        return res.status(500).json({message: 'Erro ao obter as FACULDADES no banco de dados.'})
    }

})

app.get('/faculdade/localizacao', async (req,res) => {
    
    const { localidade } = req.body

    console.log("aqui é o request.", req.body)

    if ( localidade === undefined  || !localidade ){
        return res.status(400).json({message: "Informe a localidade."})

    }
    try{
        const [rows, fields] = await pool.query('SELECT * FROM faculdade WHERE localidade = ?', [localidade])
        console.log("linha do BD", rows)

        if(rows.length === 0 ){
            return res.status(400).json({ message: 'Localização não esta encontrada.'})
        }

        const localidades = rows.map(row => row.localidade);
        console.log ("Localidade:" + localidades)
        return res.status(200).json(localidades);
        
    } catch (error){
        console.error(error)
        return res.status(500).json({message: 'Erro ao Registrar no banco de dados.'})
    }

})

app.get("/deletar/usuario", async (req,res) => {
    
    const { id } = req.body

    console.log("aqui é request", req.body)

    if( id === undefined || id === null || !id ){
        return res.status(400).json({message: "Informe o ID do usuário."})
    }

    try{
        const [rows, fields] = await pool.query('SELECT * FROM usuario WHERE id = ?', [id])
        console.log("linha do BD", rows)

        if(rows.id === null){
            return res.status(400).json({ message: 'Este id não esta cadastrado.'})
        }

        await pool.query('DELETE FROM usuario WHERE id = ?' , [rows[0].id])

        return res.status(200).json({message: 'Usuario DELETADO!!'})
    } catch (error){
        console.error(error)
        return res.status(500).json({message: 'Erro ao Registrar no banco de dados.'})
    }

    
})

app.post("/criar/usuario", async (req,res) => {
    
    const { nome, senha } = req.body

    if(!nome || !senha){
        return res.status(400).json({message: "Preencha todos os campos."})
    }

    try{
        const [rows, fields] = await pool.query('SELECT * FROM usuario WHERE nome = ?', [nome])
        if(rows.length > 0){
            return res.status(400).json({ message: 'Este nome ja esta cadastrado.'})
        }

        await pool.query('INSERT INTO usuario (nome, senha) VALUES (?,?)' , [nome,senha])

        return res.status(201).json({message: 'Usuario REGISTRADO!'})
    } catch (error){
        console.error(error)
        return res.status(500).json({message: 'Erro ao Registrar no banco de dados.'})
    }

    
})

app.put("/pegar/:id", async function(req, res){
    var { id } = req.params

    res.status(200).json({id: id})
})

app.listen(3000, function(){
    console.log("Servidor rodando em: http://localhost:3000/pegar")
})