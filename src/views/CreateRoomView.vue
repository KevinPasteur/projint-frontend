<template>
  <div class="create-room-page">
    <div class="containAll">
    <router-link to="/boredroom" class="router-link retour"> < </router-link>
    <div class="header">
      <h1 class="centered">Crée ta Room</h1>
    </div>
    <form @submit.prevent="createRoom">
      <div class="form-group">
        <label for="roomName">Nom</label>
        <input type="text" id="roomName" placeholder="Nom" v-model="roomName" required />
      </div>
      <div class="form-group">
        <label for="roomDescription">Description</label>
        <textarea id="roomDescription" placeholder="Description" v-model="roomDescription"></textarea>
      </div>
      <div class="form-group">
        <label for="endDate">Date de fin</label>
        <VueDatePicker class="date" v-model="date"></VueDatePicker>
      </div>
      <br />
      <button type="submit">Créer la room</button>
    </form>
  </div>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { socket } from "@/socket";

export default {
  components: {
    VueDatePicker,
  },
  data() {
    return {
      roomName: "",
      roomDescription: "",
      date: null,
    };
  },
  mounted() {
    const body = document.body;
    body.classList.remove("empty-chat-rooms");
  },
  methods: {
    createRoom() {
      if (this.date) {
        console.log("date");
        socket.emit("createRoom", {
          name: this.roomName,
          description: this.roomDescription,
          expiryDate: this.date.getTime(),
          createDate: Date.now(),
        });
      } else {
        // Handle the case where no date is selected
        alert("Veuillez sélectionner une date de fin.");
      }

      socket.on("roomCreated", (id) => {
        this.$router.push({ name: "chatroom", params: { roomId: id } });
      });
    },
  },
};
</script>

<style>
.create-room-page {
  display: flex;
  justify-content: center;
  align-items: center;
}

.containAll{
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.retour {
  /* descends de quelques pixels */
  position: absolute;
  top: 17px;
  left: 32px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
}

label {
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

h1 {
  margin-bottom: 1.5rem !important;
  width: 230px;
  text-align: center;
}

.router-link {
  font-size: 2rem;
  margin-right: 1rem;
}

a {
  display: block;
  text-decoration: none;

  font-weight: 600;
  color: #b2b4b8;
  transition-property: color, background;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
}

#roomDescription {
  height: 156px;
  border-radius: 10px;
  background-color: #f1f1f1;
  color: #1c1c1c;
  border-style: none;
  padding: 0.5rem 1rem 1rem 0.5rem;
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
}

@media (min-width: 769px) {
  button, .header{
    min-width: 400px;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  button, .header {
    min-width: 400px;
    max-width: 400px;
  }
  .retour {
  /* descends de quelques pixels */
  position: absolute;
  top: 17px;
  left: 180px;
}
}

@media (max-width: 425px) {
  button, .header {
    min-width: 360px;
    max-width: 360px;
  }
  .retour {
  /* descends de quelques pixels */
  position: absolute;
  top: 17px;
  left: 32px;
}
}

@media (max-width: 375px) {
  button, .header{
    min-width: 310px;
    max-width: 310px;
  }
  .retour {
  /* descends de quelques pixels */
  position: absolute;
  top: 17px;
  left: 32px;
}
}

@media (max-width: 320px) {
  button, .header {
    min-width: 255px;
    max-width: 255px;
  }
  .retour {
  /* descends de quelques pixels */
  position: absolute;
  top: 17px;
  left: 32px;
}
}

</style>
