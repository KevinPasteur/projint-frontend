<template>
  <div class="page-wrapper">
    <div class="chat-room">
      <button @click="$router.push('/boredroom')">Back to Boredroom</button>
      <h2>Chat Room: {{ roomName }}</h2>
      <div class="messages">
        <div v-for="message in messages" :key="message.id">
          {{
            new Date(message.message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
          -
          <span
            class="sender"
            :class="{ 'my-message': message.message.senderId === userId }"
          >
            {{ message.message.username }}</span
          >: {{ message.message.content }}
        </div>
      </div>
      <div class="input-area float">
        <input
          v-model="messageText"
          type="text"
          placeholder="Entrez votre message..."
          @keyup.enter="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { socket } from "@/socket";

export default {
  data() {
    return {
      roomId: null,
      roomName: "",
      roomDescription: "",
      userId: "", // ID de l'utilisateur connecté
      username: "", // Nom de l'utilisateur connecté
      socket: null,
      messages: [],
      messageText: "",
    };
  },
  mounted() {
    socket.on("roomJoined", ({ roomId }) => {
      this.userId = JSON.parse(localStorage.getItem("user")).userId;
      this.username = JSON.parse(localStorage.getItem("user")).username;

      const objectMap = (obj, fn) =>
        Object.fromEntries(
          Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
        );

      axios
        .get("http://localhost:5000/api/rooms/" + roomId)
        .then((response) => {
          if (!response.data.roomId) this.$router.push("/boredroom");

          objectMap(response.data.messages, (message) =>
            this.messages.push(message)
          );

          this.roomId = response.data.roomId;
          this.roomName = response.data.name;
          this.roomDescription = response.data.description;
        })
        .catch((error) => {});
    });

    socket.on("newMessage", (message) => {
      this.messages.push(message);
    });

    socket.on("roomRemoved", () => {
      this.$router.push("/boredroom");
    });
  },
  methods: {
    sendMessage() {
      if (this.messageText.trim() !== "") {
        socket.emit("sendMessage", {
          roomId: this.roomId,
          message: {
            username: this.username,
            senderId: this.userId,
            content: this.messageText,
            timestamp: Date.now(),
          },
        });
        this.messageText = "";
      }
    },
  },
  watch: {
    "$route.params.roomId": {
      immediate: true, // Exécuter la fonction dès le montage du composant
      handler(newRoomId) {
        this.roomId = newRoomId;
        socket.emit("joinRoom", { roomId: newRoomId, username: this.username });
      },
    },
  },
};
</script>

<style>
.chat-room {
  /* Styles pour la chat room */
}
.messages {
  /* Styles pour la zone des messages */
}
.sender {
  /* Styles pour le nom de l'expéditeur */
}
.input-area {
  /* Styles pour la zone de saisie */
}

.my-message {
  color: green;
}

.float {
  position: fixed;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
