<template>
  <div class="login-view">
    <div class="centreVertical">
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/unboredAccueil.svg"
      width="200px"
    />
    <form @submit.prevent="submitLoginForm">
      <label for="email">Adresse HEIG</label>
      <div class="champs" id="emailInputContainer">
        <input
          id="email"
          type="text"
          v-model="loginEmail"
          placeholder="prenom.nom"
          required
        />
        <span class="email-domain">@heig-vd.ch</span>
      </div>
      <div class="champs">
        <label for="password">Mot de Passe</label>
        <input
          id="password"
          type="password"
          v-model="loginPassword"
          required
          minlength="8"
          placeholder="********"
        />
      </div>
      <div class="boutton">
        <button type="submit">Me Connecter</button>
      </div>
    </form>
    <p class="lien">J'ai oublié mon mot de passe</p>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();
const loginEmail = ref("");
const loginPassword = ref("");
const baseDomain = "@heig-vd.ch";
const userEmail = computed(() => loginEmail.value + baseDomain);

const submitLoginForm = async () => {
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail.value,
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
img {
  margin-bottom: 1rem;
}

.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 84vh;
}

.centreVertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

#email {
  width: 73%;
  height: 40px;
  border-radius: 10px;
  background-color: #F1F1F1;
  border-style: none;
  padding: 0 1rem 0 1rem;
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

#emailInputContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  display: block;
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  margin-bottom: 0.2rem;
}

input {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background-color: #f1f1f1;
  color: #1c1c1c;
  border-style: none;
  padding: 0 1rem 0 1rem;
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

#email {
  width: 65%;
}

::placeholder {
  color: #bcbcbc;
}

.champs {
  margin-bottom: 2rem;
}

button {
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  border-style: none;
  color: white;
  background-color: #9b00ff;
}

.lien{
  text-decoration: underline;
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

form{
  width: 100%;
  margin: 0 1rem 0 1rem;
  max-width: 400px;
}
</style>
