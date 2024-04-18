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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
      // Rediriger puis afficher le toast de succès
      router.push({ name: "boredRoom" }).then(() => {
        toast.success("Connexion réussie!", {
          autoClose: 2000,
        });
      });
    } else {
      // Utiliser toast pour les erreurs serveur
      toast.error(
        data.message || "Une erreur est survenue lors de la connexion.",
        {
          autoClose: 5000,
        }
      );
    }
  } catch (error) {
    console.error("Erreur de connexion", error);
    // Utiliser toast pour les erreurs de réseau ou autres erreurs inattendues
    toast.error(error.message || "Erreur de connexion", {
      autoClose: 5000,
    });
  }
};
</script>

<style scoped>
/* Votre CSS ici */
</style>
