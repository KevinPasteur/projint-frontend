<template>
  <div class="login-view">
    <h1>Connexion</h1>
    <form @submit.prevent="submitLoginForm">
      <div>
        <label for="email">Email:</label>
        <input id="email" type="email" v-model="loginEmail" required />
      </div>
      <div>
        <label for="password">Mot de Passe:</label>
        <input
          id="password"
          type="password"
          v-model="loginPassword"
          required
          minlength="8"
        />
      </div>
      <button type="submit">Connexion</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loginEmail = ref("");
const loginPassword = ref("");

const submitLoginForm = async () => {
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail.value,
        motDePasse: loginPassword.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Connexion réussie!");
      router.push({ name: "boredRoom" }); // Rediriger vers BoredRoomView
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Erreur de connexion", error);
    alert(error.message || "Erreur de connexion");
  }
};
</script>

<style scoped>
/* Votre CSS ici */
</style>
