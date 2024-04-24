<template>
  <div class="signup-view">
    <div class="contientTout">
      <div class="containerImg">
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/unboredAccueil.svg"
        width="200px"
      />
      </div>
      <form @submit.prevent="submitCode">
        <div class="containerCode">
          <label for="code">Entre ton code</label>
          <input
            id="code"
            type="text"
            v-model="signupCode"
            required
            placeholder="000-000-000-000"
          />
        </div>
        <button type="submit" class="center-button">Rejoindre unbored</button>
        <img
      alt="Vue logo"
      class="happy"
      src="@/assets/stickerHappy.svg"
    />
      </form>
      <div class="containerLien">
        <p class="lien">Je suis déjà membre</p>
      </div>
    </div>
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
.signup-view {
  position: relative; /* Position relative pour positionner les éléments enfants */
  height: 84vh;
}

.contientTout {
  position: absolute;
  top: 50%; /* Positionner le haut de l'élément à 50% du contenant parent */
  left: 50%; /* Positionner la gauche de l'élément à 50% du contenant parent */
  transform: translate(-50%, -50%); /* Centrer l'élément verticalement et horizontalement */
}

.containerImg {
  display: flex;
  justify-content: center;
}

.logo {
  margin-bottom: 3rem;
}

.happy {
  position: absolute;
  top: 300px;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
}

button {
  margin-top: 2rem;
  border-radius: 10px;
}

@media (max-width: 768px) {
  button {
    min-width: 400px;
  }
  .happy {
    top: 290px;
    width: 120px;
    left: 30px;
  }
}

@media (max-width: 425px) {
  button {
    min-width: 360px;
  }
  .happy {
    left: 35px;
    width: 100px;
  }
}

@media (max-width: 375px) {
  button {
    min-width: 310px;
  }
  .happy {
    left: 20px;
    width: 90px;
  }
}

@media (max-width: 320px) {
  button {
    min-width: 255px;
  }
  .happy {
    left: -10px;
    width: 86px;
  }
}

input {
  margin-bottom: 0.5rem;
  text-align: center;
}

.containerCode {
  /* centre ce qu'il y a dedans */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.containerLien {
  display: flex;
  justify-content: center;
}

.lien{
  display: inline-block;
  margin-top: 140px;
}
</style>
