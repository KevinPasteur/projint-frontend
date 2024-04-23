<template>
  <div class="signup-view">
    <h1>Inscription avec un Code</h1>
    <form @submit.prevent="submitCode">
      <div>
        <label for="code">Code d'inscription:</label>
        <input
          id="code"
          type="text"
          v-model="signupCode"
          required
          placeholder="000-000-000-000"
        />
      </div>
      <button type="submit">Vérifier et s'inscrire</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const router = useRouter();
const signupCode = ref("");

const submitCode = async () => {
  try {
    const response = await fetch("http://localhost:5000/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: signupCode.value }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("tokenC", data.tokenC);
      toast.success("Code valide! Redirection vers la création de compte.", {
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push({
          name: "createAccount",
        });
      }, 2000);
    } else {
      toast.error(data.message || "Code invalide ou déjà utilisé.", {
        autoClose: 5000,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du code", error);
    toast.error("Problème de connexion ou erreur serveur.", {
      autoClose: 5000,
    });
  }
};
</script>

<style scoped>
/* Votre CSS ici */
</style>
