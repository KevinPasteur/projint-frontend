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
    const response = await fetch(
      "https://academic-brandie-unbored.koyeb.app/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail.value,
          motDePasse: loginPassword.value,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.userToReturn));
      // Rediriger puis afficher le toast de succès
      router.push({ name: "boredroom" }).then(() => {
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

#emailInputContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  margin-bottom: 0.2rem;
}

::placeholder {
  color: #bcbcbc;
}

.champs {
  margin-bottom: 2rem;
}

button {
  border-radius: 10px;
}

.button {
  display: flex;
  justify-content: center;
}

@media (min-width: 769px) {
  button {
    width: 400px;
  }
  #email {
    width: 65%;
  }
}

@media (max-width: 768px) {
  button {
    min-width: 400px;
    max-width: 400px;
  }
  #email {
    width: 75%;
  }
}

@media (max-width: 425px) {
  .centreVertical {
    width: 360px;
  }
  button {
    min-width: 360px;
    max-width: 360px;
  }
  #email {
    width: 72%;
  }
}

@media (max-width: 375px) {
  .centreVertical {
    width: 310px;
  }
  button {
    min-width: 310px;
    max-width: 310px;
  }
  #email {
    width: 67%;
  }
}

@media (max-width: 320px) {
  .centreVertical {
    width: 255px;
  }
  button {
    min-width: 255px;
    max-width: 255px;
  }
  #email {
    width: 60%;
  }
}

form {
  width: 100%;
  margin: 0 1rem 0 1rem;
  max-width: 400px;
}
</style>
