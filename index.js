const express = require("express");
const JogoSchema = require("./models/Jogo");
const mongoose = require("./database");

const app = express();
const port = 3000;
app.use(express.json());

// função que verifica a validade de um id que vem da req
const idValido = id => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(422).send({ error: "Id Inválido!"});
    };
};

// função que verifica se o documento(objeto) do DB foi encontrado
const encontrarJogo = jogo => {
    if (!jogo) {
        res.status(404).send({ error: "Jogo não encontrado!"});
    };
};

// verificar se o jogo está Ok
const jogoOk = jogo => {
    if (!jogo || !jogo.nome || !jogo.imagem || !jogo.classInd) {
        res.status(400).send({ error: "Jogo Inválido!"});
    };
};

app.get("/", (req, res) => {
    res.send({info: "Lista de Jogos do Caio"});
});

app.get("/jogos", async (req, res) => {
    const jogos = await JogoSchema.find();
    res.send({ jogos });
});

app.post("/jogos", async (req, res) => {
    const jogo = req.body;
    jogoOk(jogo);
    const novoJogo = await new JogoSchema(jogo).save();
    res.status(201).send( {novoJogo} );
})

app.get("/jogos/:id", async (req, res) => {
    const id = req.params.id;
    idValido(id);
    const jogo = await JogoSchema.findById(id);
    encontrarJogo(jogo);
    res.send({ jogo });
});

app.put("/jogos/:id", async (req, res) => {
    const id = req.params.id;
    idValido(id);
    const jogo = await JogoSchema.findById(id);
    encontrarJogo(jogo);
    const alteracaoJogo = req.body;
    jogoOk(jogo);
    await JogoSchema.findOneAndUpdate( { _id: id }, alteracaoJogo);
    const jogoAtualizado = await JogoSchema.findById(id);
    res.send({ jogoAtualizado });
});

app.delete("/jogos/:id", async (req, res) => {
    const id = req.params.id;
    idValido(id);
    const jogo = await JogoSchema.findById(id);
    encontrarJogo(jogo);
    await JogoSchema.findByIdAndDelete(id);
    res.send({ jogo });
});

app.listen(port, () =>
    console.log(`Servidor rodando em http://localhost:${port}`)
);