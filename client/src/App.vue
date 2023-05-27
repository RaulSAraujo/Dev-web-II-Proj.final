<template>
  <div
    style="
      width: 80vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <div v-if="modeUser">
      <button
        @click="desactiveMode()"
        style="
          background-color: transparent;
          display: flex;
          margin-bottom: 10px;
        "
      >
        <span class="material-symbols-outlined"> arrow_back </span>
        Voltar
      </button>

      <div style="width: 450px; margin-bottom: 10px">
        <form
          @submit.prevent="formData.id === null ? registerUser() : updateUser()"
          style="display: grid; grid-template-columns: auto; grid-gap: 5px"
        >
          <input placeholder="Nome" type="text" v-model="formData.name" />
          <input placeholder="Email" type="email" v-model="formData.email" />
          <input
            placeholder="Senha"
            type="password"
            v-model="formData.password"
          />
          <button type="submit">
            {{ formData.id === null ? "REGISTRAR" : "EDITAR" }}
          </button>
        </form>
        <p>{{ message }}</p>
      </div>
    </div>

    <div v-else>
      <div
        style="
          width: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        "
      >
        <h2 style="margin: 0 50px 0 180px">USUARIOS</h2>
        <button @click="activeMode()">REGISTRAR</button>
      </div>

      <table v-if="users.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>
              <button
                class="round-button"
                @click="activeEditMode(item)"
                style="margin: 0px 5px 0px 10px"
              >
                <span class="icon-button material-symbols-outlined">
                  edit
                </span>
              </button>
              <button
                class="round-button"
                @click="deleteUser(item)"
                style="color: red"
              >
                <span class="icon-button material-symbols-outlined">
                  delete
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-else
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5px;
          background-color: rgb(0, 0, 0, 0.4);
          border-radius: 8px;
        "
      >
        <span>Nenhum usuario cadastrado.</span>
      </div>

      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      modeUser: false,
      formData: {
        id: null,
        name: "",
        email: "",
        password: "",
      },
      message: "",
      users: [],
    };
  },
  created() {
    this.listUser();
  },
  methods: {
    listUser() {
      axios
        .get("http://localhost:3000/users")
        .then((response) => {
          console.log(response);
          this.users = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async registerUser() {
      try {
        const res = await axios.post(
          "http://localhost:3000/users",
          this.formData
        );

        console.log("res", res);
        this.message = res.data.msg;
        if (res.status === 200 && res.data.msg !== "Usuario ja cadastrado.") {
          this.users.push(res.data.result);
        }
      } catch (err) {
        console.log("error", err);
        this.message = err;
      }
    },
    async updateUser() {
      try {
        const res = await axios.put(
          `http://localhost:3000/users/${this.formData.id}`,
          this.formData
        );

        console.log("res", res);
        this.message = res.data.msg;
        if (res.status === 200) {
          let index = this.users.findIndex(
            (user) => res.data.result.id == user.id
          );
          this.users[index].name = res.data.result.name;
          this.users[index].email = res.data.result.email;
          this.users[index].password = res.data.result.password;
        }
      } catch (err) {
        console.log("error", err);
        this.message = err;
      }
    },
    deleteUser(user) {
      axios
        .delete(`http://localhost:3000/users/${user.id}`)
        .then((response) => {
          this.message = response.data;
          if (response.status === 200) {
            let index = this.users.indexOf(user);
            this.users.splice(index, 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    activeMode() {
      this.modeUser = true;
      this.editUser = false;
      this.message = "";
    },
    desactiveMode() {
      this.modeUser = false;
      this.message = "";
      this.formData.id = null;
      this.formData.name = "";
      this.formData.email = "";
      this.formData.password = "";
    },
    activeEditMode(item) {
      this.modeUser = true;
      this.editUser = true;
      this.message = "";
      this.formData.id = item.id;
      this.formData.name = item.name;
      this.formData.email = item.email;
      this.formData.password = item.password;
    },
  },
};
</script>

<style>
table {
  width: 450px;
  border-collapse: separate;
  border-spacing: 5px;
  border-collapse: collapse;
}
td,
th {
  padding: 5px;
  border: 1px solid #a09f9f;
}
input {
  padding: 5px;
}
.round-button {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 5px;
  color: #ffffff;
  margin: 0;
  padding: 0;
}
.icon-button {
  font-size: 20px;
}
</style>