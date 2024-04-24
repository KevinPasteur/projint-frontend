<template>
  <div class="create-room-page">
    <div class="header">
      <router-link to="/boredroom" class="router-link"> < </router-link>
      <h1>Crée ta Room</h1>
    </div>
    <form @submit.prevent="createRoom">
      <div class="form-group">
        <label for="roomName">Nom</label>
        <input type="text" id="roomName" v-model="roomName" required />
      </div>
      <div class="form-group">
        <label for="roomDescription">Description</label>
        <textarea id="roomDescription" v-model="roomDescription"></textarea>
      </div>
      <div class="form-group">
        <label for="endDate">Date de fin</label>
        <VueDatePicker v-model="date"></VueDatePicker>
      </div>
      <br />
      <button type="submit">Créer la room</button>
    </form>
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
.header {
  display: flex;
  flex-direction: row;
  /* Styles pour la chat room */
  font-size: 1.5rem;
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
  margin: 0;
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
</style>
