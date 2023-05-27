const express = require("express");
const app = express();
const cors = require("cors");
const { pool } = require("./data/data");
app.use(cors());
app.use(express.json());
app.listen(3000, () => {
    console.log("Server ativo na porta 3000");
})

// Encerrar as conexões do pool de conexões ao final do processo
process.on('SIGINT', () => {
    pool.end();
    process.exit();
});

app.get("/users", async (req, res) => {
    try {
        const client = await pool.connect();
        const { rows } = await client.query("SELECT * FROM Users");
        console.table(rows);
        res.status(200).send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro de conexão com o servidor");
    }
});

app.post("/users", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const client = await pool.connect();

        if (!name || !email || !password) {
            return res.status(401).send("Informe o id, nome, email e senha.")
        }

        const user = await client.query(`SELECT FROM Users where email='${email}'`);
        console.log(user)
        if (user.rows.length === 0) {
            await client.query(`INSERT INTO Users (id, nome, email, password) VALUES (uuid_generate_v4(), '${name}', '${email}', '${password}')`)
            res.status(200).send({
                msg: "Sucesso em cadastrar usuario.",
                result: {
                    id,
                    email,
                    password,
                    name
                }
            });
        } else {
            res.status(401).send("Usuario ja cadastrado.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro de conexão com o servidor");
    }
})

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const client = await pool.connect();
        if (!id || !name) {
            return res.status(401).send("Id não informados.")
        }

        const user = await client.query(`SELECT FROM Users where id=${id}`);
        if (user.rows.length > 0) {
            await client.query(`UPDATE Users SET name = '${name}',email ='${email}',password ='${password}' WHERE id=${id}`);
            res.status(200).send({
                msg: "Usuario atualizado com sucesso.",
                result: {
                    id,
                    name,
                    email,
                    password
                }
            });
        } else {
            res.status(401).send("Usuario não encontrado.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro de conexão com o servidor");
    }
})

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (id === undefined) {
            return res.status(401).send("Usuario não informado.")
        }

        const client = await pool.connect();
        const del = await client.query(`DELETE FROM Users where id=${id}`)

        if (del.rowCount == 1) {
            return res.status(200).send("Usuario deletado com sucesso.");
        } else {
            return res.status(200).send("Usuario não encontrado.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro de conexão com o servidor");
    }
})
