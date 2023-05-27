<template>
  <form
    @submit.prevent="registerUser"
    style="display: grid; grid-template-columns: auto; grid-gap: 5px"
  >
    <input type="text" v-model="formData.name" />
    <input type="email" v-model="formData.email" />
    <input type="password" v-model="formData.password" />
    <button type="submit">REGISTRAR</button>
    <pre>{{ formData.message }}</pre>
  </form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
        message: "",
      },
    };
  },
  methods: {
    registerUser() {
      console.log(this.formData);
      this.formData.message;
    },
  },
};
</script>

<style>
</style>