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
        const { rows } = await client.query("SELECT * FROM users");
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
            return res.status(200).send({ msg: "Informe o nome, email e senha." })
        }

        const user = await client.query(`SELECT FROM Users where email='${email}'`);
        if (user.rows.length === 0) {
            let { rows } = await client.query(`INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${password}') RETURNING *`)
            res.status(200).send({
                msg: "Sucesso em cadastrar usuario.",
                result: rows[0]
            });
        } else {
            res.status(200).send({
                msg: "Usuario ja cadastrado."
            });
        }
    } catch (error) {
        res.status(500).send({ msg: "Erro de conexão com o servidor" });
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
