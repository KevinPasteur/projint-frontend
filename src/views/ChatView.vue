<template>
  <div class="page-wrapper">
    <div class="chat-room">
      <div class="headerChat">
        <div class="row w-100 ml-5" style="margin-left: 10%">
          <div class="col-1">
            <router-link to="/boredroom" class="router-link"> < </router-link>
          </div>
          <div class="col titleChat">
            <h2 class="h2Chat">{{ roomName }}</h2>
          </div>
        </div>
      </div>

      <div class="messages" ref="messageContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="{ messageRight: message.message.senderId === userId }"
        >
          <div
            :class="{
              messageBulle: message.message.senderId !== userId,
              messageBulleOwner: message.message.senderId === userId,
            }"
          >
            <div class="row">
              <div class="col-12" v-if="message.message.senderId !== userId">
                <span
                  class="sender"
                  :class="{ 'my-message': message.message.senderId === userId }"
                >
                  {{ message.message.username }}</span
                >
              </div>
              <div class="col-12">
                {{ message.message.content }}
              </div>
            </div>
          </div>
          {{
            new Date(message.message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </div>
      </div>

      <div class="footer">
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
        .get("https://academic-brandie-unbored.koyeb.app/api/rooms/" + roomId)
        .then((response) => {
          if (!response.data.roomId) this.$router.push("/boredroom");

          if (response.data.messages) {
            objectMap(response.data.messages, (message) =>
              this.messages.push(message)
            );
          }

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
  height: calc(
    100vh - 120px
  ); /* Adjust height based on header and footer heights */
  overflow-y: scroll; /* Enable scrolling for the message area */
  overflow: hidden;
}

@media (max-width: 1024px) {
  .chat-room {
    margin-top: 5%;
    height: calc(
      95vh - 120px
    ); /* Adjust height based on header and footer heights */
  }
}

.chat-room::-webkit-scrollbar {
  /* Hide the default scrollbar track */
  display: none;
}

.chat-room::-webkit-scrollbar-thumb {
  /* Hide the scrollbar thumb */
  display: none;
}

.titleMessage {
  font-size: large;
}

.footer {
  position: fixed; /* Ensures the footer stays at the bottom */
  bottom: 0; /* Places the footer at the very bottom of the screen */
  height: 60px; /* Sets the desired height for the footer */
  background-color: white; /* Sets the background color to white */
  display: flex; /* Allows horizontal arrangement of content */
  justify-content: center; /* Distributes content horizontally */
  align-items: center; /* Aligns content vertically in the center */
  padding: 0 10px; /* Adds some padding on the sides */
  margin: auto;
  max-width: 1250px;
  width: 100%;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.titleChat {
  display: flex;
  align-items: flex-end;
}

.h2Chat {
  font-size: 30px !important;
}

.messageBulle {
  min-width: min-content; /* Ensure width is at least the content size */
  max-width: 65%; /* Limit maximum width to 65% */
  background-color: #bcbcbc;
  color: white;
  border-radius: 10px;
  padding: 10px;
}

.messageBulleOwner {
  min-width: min-content; /* Ensure width is at least the content size */
  max-width: 65%; /* Limit maximum width to 65% */
  background-color: #9b00ff;
  color: white;
  border-radius: 10px;
  padding: 10px;
}

.sender {
  font-size: large;
  font-weight: bold;
}
.input-area {
  /* Styles pour la zone de saisie des messages */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 80%;
}

.centreh2 {
  text-align: center;
}

#text {
  color: white;
  padding: 0.5rem 1rem 1rem 0.5rem;
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
}

h2 {
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
}

.my-message {
  color: green;
}

.headerChat {
  width: 100%;
  position: fixed; /* Ensures the header stays at the top */
  top: 0; /* Places the header at the very top of the screen */
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100px; /* Sets the desired height for the header */
  background-color: white; /* Sets the background color to white */
  display: flex; /* Allows horizontal arrangement of content */
  justify-content: space-between; /* Distributes content horizontally */
  align-items: center; /* Aligns content vertically in the center */
  padding-top: 5vh;
}

.page-wrapper-chat {
  display: flex;

  width: 70%;
  margin: auto;
}

.messageRight {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.float {
  position: fixed;
  max-width: 400px;
  width: 70vw;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
