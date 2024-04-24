<template>
  <div class="page-wrapper">
    <div v-if="isLoading"></div>
    <div
      v-if="!isLoading && chatRooms.length > 0"
      class="roomContainer"
      style="width: 100%"
    >
      <h1 class="title">Bored Room</h1>
      <div class="row">
        <div v-for="room in chatRooms" :key="room.id" class="col-12">
          <router-link :to="{ name: 'chatroom', params: { roomId: room.id } }">
            <div class="shadow card p-3 mb-2">
              <div class="d-flex justify-content-between">
                <div class="d-flex flex-row align-items-center">
                  <div class="ms-2 c-details">
                    <h6 class="mb-0">{{ room.name }}</h6>
                  </div>
                </div>
                <div class="badge">
                  <span>{{ room.currentUsers ?? 0 }}</span>
                </div>
              </div>
              <div class="mt-3">
                <div class="container-bar">
                  <div
                    class="timer-bar"
                    :style="{ width: getSkillBarWidth(room) + '%' }"
                    :data-room-id="room.id"
                  ></div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div class="float">
        <router-link :to="{ name: 'createroom' }">
          <button>Créer ma Room</button>
        </router-link>
      </div>
    </div>

    <div v-else class="text-center">
      <div class="content">
        <h1 class="title">Aucune Room pour l'instant</h1>
        <div class="image-container">
          <img
            style="width: 7.5rem"
            src="/images/mascottes/happy.svg"
            alt="Smiley Icon"
          />
        </div>
        <h1 class="title">Sois le premier à en créer une !</h1>
        <router-link :to="{ name: 'createroom' }">
          <button class="create-button">Créer ma Room</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { socket } from "@/socket";
import axios from "axios";

export default {
  data() {
    return {
      chatRooms: [],
      newRoomName: "",
      isLoading: true,
    };
  },
  mounted() {
    this.fetchChatRooms();
    this.fetchChatRoomss();

    socket.on("roomCreated", (newRoom) => {
      this.chatRooms.push(newRoom);
      this.updateBackground();
    });

    socket.on("roomRemoved", () => {
      this.chatRooms = this.chatRooms.filter((room) => room.timerBarWidth > 0);
      this.updateBackground();
    });
  },
  beforeRouteUpdate() {
    this.fetchChatRooms();
    this.updateBackground();
  },
  methods: {
    fetchChatRooms() {
      this.isLoading = true;
      socket.emit("getChatRooms");
      socket.on("chatRoomsList", (chatRoomsData) => {
        this.chatRooms = chatRoomsData;
        this.isLoading = false;
        this.updateBackground();
      });
    },

    fetchChatRoomss() {
      axios
        .get("http://localhost:5000/api/rooms")
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {});
    },

    createChatRoom() {
      if (this.newRoomName.trim() !== "") {
        socket.emit("createRoom", this.newRoomName);
        this.newRoomName = "";
      }
    },

    startTimer(room) {
      if (!room.timerInterval) {
        // Start the timer interval if not already running
        room.timerInterval = setInterval(() => {
          this.updateTimer(room);
        }, 1000); // Update every second
      }
    },

    getSkillBarWidth(room) {
      // Calculate skill bar width based on remaining time and expiration time
      const now = Date.now();
      const expirationTime = room.expiryDate; // Assuming there's an expirationTime property
      const totalTime = expirationTime - room.createDate;
      const remainingTime = expirationTime - now;
      const width = (remainingTime / totalTime) * 100; // Convert to percentage
      return Math.max(0, width); // Ensure non-negative value
    },

    stopTimer(room) {
      if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
      }
    },

    updateTimer(room) {
      // Calculate new time percentage and update timer bar
      const width = this.getSkillBarWidth(room);
      room.timerBarWidth = width;

      // Update CSS style dynamically (using inline styles for simplicity)
      const timerBarElement = document.querySelector(
        `div[data-room-id="${room.id}"]`
      );

      if (timerBarElement) {
        timerBarElement.style.width = `${width}%`;
        timerBarElement.classList.remove(...timerBarElement.classList); // Remove all existing classes
        if (width > 60) {
          timerBarElement.classList.add("timer-bar--full");
        } else if (width > 33) {
          timerBarElement.classList.add("timer-bar--medium");
        } else {
          timerBarElement.classList.add("timer-bar--low");
        }
      }

      if (width === 0) {
        this.stopTimer(room);
        socket.emit("removeRoom", room.id);
      }
    },

    updateBackground() {
      const body = document.body;

      if (this.chatRooms.length === 0) {
        body.classList.add("empty-chat-rooms");
      } else {
        body.classList.remove("empty-chat-rooms");
      }
    },
  },
  watch: {
    chatRooms: {
      handler() {
        this.chatRooms.forEach((room) => {
          this.startTimer(room);
        });
      },
      deep: true,
    },
  },
};
</script>

<style>
/* Styles CSS pour la page d'accueil */
body.empty-chat-rooms {
  background-image: url("/images/background_unbored.jpg"); /* Path to your image */
  background-size: cover; /* Adjust as needed */
  /* Add any other styles for the empty state, like min-height */
}

.page-wrapper {
  display: flex;
  flex-direction: column; /* Align items vertically */
  align-items: center; /* Center horizontally */
  min-height: 100vh; /* Ensure it takes up full viewport height */
}

.title {
  font-size: 1.5rem !important;
}

.content {
  flex-grow: 1; /* Take up remaining space */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}

.create-button {
  font-weight: bold;
  margin-top: 2.5rem;
  background-color: black; /* Example button color */
  width: 100%;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
}

.image-container {
  margin-top: 2rem;
  margin-left: 10rem;
}

a {
  width: 100%;
}

/* Make sure that padding behaves as expected */
* {
  box-sizing: border-box;
}

.container-bar {
  width: 100%; /* Full width */
  background-color: #ddd; /* Grey background */
  height: 10px; /* Adjust bar height as needed */
  border-radius: 20px;
}

/* Skill bar element */
.timer-bar {
  height: 100%; /* Full height of container */
  background-color: #92dd00; /* Initial green color */
  transition: background-color 0.5s ease-in-out;
  border-radius: 20px; /* Add rounded corners */
}

.timer-bar--full {
  background-color: #92dd00;
  height: 100%; /* Full height of container */
  transition: background-color 0.5s ease-in-out;
  border-radius: 20px; /* Add rounded corners */
}

.timer-bar--medium {
  background-color: #ffb600;
  height: 100%; /* Full height of container */
  transition: background-color 0.5s ease-in-out;
  border-radius: 20px; /* Add rounded corners */
}

.timer-bar--low {
  background-color: #f24822;
  height: 100%; /* Full height of container */
  transition: background-color 0.5s ease-in-out;
  border-radius: 20px; /* Add rounded corners */
}

.roomContainer {
  border-style: none;
}

h5 {
  font-family: "Figtree", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
}

.shadow {
  /* syntaxe: offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.float {
  position: fixed;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  border: none;
  position: relative;
  margin-bottom: 30px;
  margin-top: 10px;
  width: 100%;
}

.c-details span {
  font-weight: 300;
  font-size: 13px;
}

.icon {
  width: 50px;
  height: 50px;
  background-color: #eee;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 39px;
}

.badge span {
  background-color: #9b00ff;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  display: flex;
  color: white;
  font-weight: bold;
  justify-content: center;
  align-items: center;
}

.progress {
  height: 10px;
  border-radius: 10px;
}

.progress div {
  background-color: red;
}

.text1 {
  font-size: 14px;
  font-weight: 600;
}

.text2 {
  color: #a5aec0;
}
</style>
