<template>
  <div class="chat-room">
    <button @click="$router.push('/boredroom')">Back to Boredroom</button>
    <h2>Chat Room: {{ roomId }}</h2>
    <div class="messages">
      <div v-for="message in messages" :key="message.id">
        <span class="sender">Test</span>: {{ message.message.content }}
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="messageText"
        type="text"
        placeholder="Entrez votre message..."
      />
      <button @click="sendMessage">Envoyer</button>
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
      userId: "", // ID de l'utilisateur connecté
      socket: null,
      messages: [],
      messageText: "",
    };
  },
  mounted() {
    socket.on("roomJoined", ({ roomId }) => {
      console.log("J'ai join");
      // on roomJoin Check if roomExist or go back to boredroom

      axios
        .get("http://localhost:5000/rooms/" + roomId)
        .then((response) => {
          console.log(response);
          if (!response.data) {
            //this.$router.push("/boredroom");
          }
        })
        .catch((error) => {
          this.$router.push("/boredroom");
        });

      //get previous messages
      socket.emit("getMessages", roomId);

      this.roomId = roomId;
    });

    socket.on("previousMessages", (messages) => {
      this.messages = messages;
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
      console.log(this.roomId);
      if (this.messageText.trim() !== "") {
        socket.emit("sendMessage", {
          roomId: this.roomId,
          message: {
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
</style>
