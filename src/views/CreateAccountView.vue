<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import API from "../axiosConfig";

const user = ref({
  pseudo: "",
  prenom: "",
  nom: "",
  email: "",
  motDePasse: "",
  anonyme: false,
  idCentreInterets: [],
  idEmojis: [],
});
const router = useRouter();
const showErrors = ref(false);
const baseDomain = "@heig-vd.ch";
const userEmail = computed(() => user.value.email + baseDomain);

const isValidEmailPrefix = computed(() => user.value.email.length > 0);
const isValidPassword = computed(() => user.value.motDePasse.length >= 8);

const formIsValid = computed(
  () =>
    user.value.pseudo &&
    user.value.prenom &&
    user.value.nom &&
    isValidEmailPrefix.value &&
    isValidPassword.value
);

const submitForm = async () => {
  showErrors.value = true; // Show errors if there are any on attempting to submit
  user.value.email = userEmail.value;
  if (formIsValid.value) {
    try {
      const response = await API.post("/create-user", user.value);
      const data = response.data;
      if (response.status === 201) {
        // Vérifiez si le statut est 201
        console.log("Utilisateur créé avec succès", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userID", data.userId);
        showErrors.value = false;
        //delete the tokenC from the local storage
        localStorage.removeItem("tokenC");
        toast.success("Compte créé avec succès!");
        router.push({ name: "boredRoom" });
      } else {
        // Ceci n'est probablement pas nécessaire car les réponses autre que 2xx lanceront une exception
        toast.error(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      // Ici, affichez l'erreur retournée par le serveur, si disponible
      const errorMessage = error.response?.data?.message || error.message;
      toast.error("Erreur lors de la création du compte : " + errorMessage);
    }
  }
};
</script>

<template>
  <div class="create-user-form">
    <div class="containAll">
      <h1>Inscription</h1>
      <form @submit.prevent="submitForm">
        <div class="prenomNom container">
          <div class="prenom">
            <label for="prenom">Ton prénom</label>
            <input
              type="text"
              id="prenom"
              v-model="user.prenom"
              placeholder="Prénom"
              required
            />
          </div>
          <div class="nom">
            <label for="nom">Ton nom</label>
            <input
              type="text"
              id="nom"
              v-model="user.nom"
              placeholder="Nom"
              required
            />
          </div>
        </div>
        <div class="containerPseudo container">
          <label for="pseudo">Pseudo</label>
          <input
            type="text"
            v-model="user.pseudo"
            id="pseudo"
            placeholder="Ton pseudo"
            required
            maxlength="25"
          />
        </div>
        <div class="emailContainer container">
          <label for="email">Adresse HEIG</label>
          <div class="email-input-container">
            <input
              id="email"
              type="text"
              v-model="user.email"
              placeholder="prénom.nom"
              required
              @blur="user.email = user.email.toLowerCase()"
            />
            <span class="email-domain">@heig-vd.ch</span>
          </div>
          <div v-if="!isValidEmailPrefix && showErrors">Email non valide</div>
          <div class="containerPassword container"></div>
          <label for="motDePasse">Mot de passe</label>
          <input
            id="motDePasse"
            type="password"
            v-model="user.motDePasse"
            placeholder="********"
            minlength="8"
            maxlength="128"
            required
            :class="{ 'is-invalid': !isValidPassword && showErrors }"
          />
          <div v-if="!isValidPassword && showErrors">
            Le mot de passe doit comporter au moins 8 caractères
          </div>
        </div>
        <div class="anonymeContainer container">
          <input type="checkbox" v-model="user.anonyme" id="anonyme" />
          <label for="anonyme" class="labelAnonyme"
            >Je souhaite afficher mon pseudo pour garder mon anonymat sur
            l'application</label
          >
        </div>
        <button type="submit">Créer un compte</button>
      </form>
    </div>
  </div>
</template>

<style>
.is-invalid {
  border-color: red;
}

.create-user-form {
  /* align verticallement */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 84vh;
}

.containAll {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-bottom: 0;
  padding: 0;
}

h1 {
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  margin-bottom: 1rem;
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

#anonyme {
  height: 20px;
}

.prenomNom {
  display: flex;
  justify-content: space-between;
}

.nom {
  width: 48%;
}

.prenom {
  width: 48%;
}

#email {
  width: 65%;
}

.email-input-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

p {
  font-size: 12px;
}

.container {
  margin-bottom: 1rem;
}

form {
  max-width: 400px;
}

/* Pour le input anonyme */

/* Conteneur pour l'alignement */
.anonymeContainer {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

/* Masquer la case à cocher par défaut */
.anonymeContainer input[type="checkbox"] {
  display: none;
}

/* Style pour le label et le faux checkbox */
.anonymeContainer label {
  position: relative;
  padding-left: 35px; /* Espace pour le faux input */
  cursor: pointer;
  display: flex;
  align-items: center; /* Alignement vertical du texte et du faux input */
  height: 30px; /* Hauteur fixe pour mieux contrôler l'alignement */
}

/* Création du cercle non coché */
.anonymeContainer label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%); /* Centrage vertical parfait du cercle */
  width: 20px;
  height: 20px;
  border: 2px solid #bcbcbc;
  border-radius: 50%;
  background-color: #f1f1f1;
}

/* Quand la case est cochée, ajouter un cercle intérieur */
.anonymeContainer input[type="checkbox"]:checked + label::before {
  border-color: #bcbcbc;
  background: #f1f1f1;
}

/* Ajout d'un indicateur pour la case cochée */
.anonymeContainer input[type="checkbox"]:checked + label::after {
  content: "";
  position: absolute;
  left: 4px;
  top: calc(
    50% + 0px
  ); /* Ajustement en fonction de la taille de l'indicateur */
  transform: translateY(-50%); /* Centrage vertical */
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #9b00ff;
}

.labelAnonyme {
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  margin-left: 1rem;
}
</style>
