<template>
  <div class="page-wrapper">
    <div class="row w-100 mb-3">
      <div class="col-4">
        <router-link to="/boredroom" class="router-link retour">
          <
        </router-link>
      </div>
      <div class="col-8 create-room-header"><h1>Crée ta Room</h1></div>
    </div>

    <form @submit.prevent="createRoom" class="w-100">
      <div class="form-group">
        <label for="roomName">Nom</label>
        <input
          type="text"
          id="roomName"
          placeholder="Nom"
          v-model="roomName"
          required
        />
      </div>
      <div class="form-group">
        <label for="roomDescription">Description</label>
        <textarea
          id="roomDescription"
          placeholder="Description"
          v-model="roomDescription"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="endDate">Date de fin</label>
        <VueDatePicker class="date" v-model="date"></VueDatePicker>
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
label {
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
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

.create-room-header {
  display: flex;
  align-items: flex-end;
}
</style>
