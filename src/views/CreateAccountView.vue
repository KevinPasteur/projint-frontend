<script setup>
import { ref, computed } from "vue";

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
  showErrors.value = true; // Attempt to submit, show errors if there are any
  user.value.email = userEmail.value;
  if (formIsValid.value) {
    try {
      const response = await fetch("http://localhost:5000/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user.value),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Utilisateur créé avec succès", data);
        // Reset form or redirect user here
        showErrors.value = false; // Reset error display on successful registration
      } else {
        alert(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Erreur de création d'utilisateur", error);
    }
  }
};
</script>

<template>
  <div class="create-user-form">
    <form @submit.prevent="submitForm">
      <input
        type="text"
        v-model="user.pseudo"
        placeholder="Pseudo"
        required
        maxlength="25"
      />
      <input type="text" v-model="user.prenom" placeholder="Prénom" required />
      <input type="text" v-model="user.nom" placeholder="Nom" required />
      <div class="email-input-container">
        <input
          type="text"
          v-model="user.email"
          placeholder="prénom.nom"
          required
          @blur="user.email = user.email.toLowerCase()"
        />
        <span class="email-domain">@heig-vd.ch</span>
      </div>
      <div v-if="!isValidEmailPrefix && showErrors">Email non valide</div>
      <input
        type="password"
        v-model="user.motDePasse"
        placeholder="Mot de passe"
        minlength="8"
        maxlength="128"
        required
        :class="{ 'is-invalid': !isValidPassword && showErrors }"
      />
      <div v-if="!isValidPassword && showErrors">
        Le mot de passe doit comporter au moins 8 caractères
      </div>
      <label for="anonyme">Anonyme :</label>
      <input type="checkbox" v-model="user.anonyme" id="anonyme" />
      <button type="submit">Créer un compte</button>
    </form>
  </div>
</template>

<style>
.is-invalid {
  border-color: red;
}
</style>
