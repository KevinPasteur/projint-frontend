<template>
  <div class="page-wrapper">
    <div v-if="isLoading"></div>
    <div v-if="!isLoading && chatRooms.length > 0" style="width: 100%">
      <ul class="list-group">
        <li v-for="room in chatRooms" :key="room.id" class="list-group-item">
          <router-link :to="{ name: 'chatroom', params: { roomId: room.id } }">
            <!-- Structure de la card (similaire aux exemples précédents) -->
            <div class="card" style="width: 100% !important">
              <div class="card-body">
                <h5 class="card-title">{{ room.name }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">
                  {{ room.description }}
                </h6>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge bg-primary">
                    {{ room.connectedUsers }} connectés
                  </span>
                </div>
                <br />
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
        </li>
      </ul>
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
      console.log("total time: " + totalTime);
      console.log(width);
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
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  min-height: 100vh; /* Ensure it takes up full viewport height */
}

.title {
  font-size: 2.2rem;
  font-weight: bold;
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
}

/* Skill bar element */
.timer-bar {
  height: 100%; /* Full height of container */
  background-color: green; /* Initial green color */
  transition: background-color 0.5s ease-in-out;
  border-radius: 2px; /* Add rounded corners */
}

.timer-bar--full {
  background-color: green;
  height: 100%; /* Full height of container */
  transition: background-color 0.5s ease-in-out;
  border-radius: 2px; /* Add rounded corners */
}

.timer-bar--medium {
  background-color: orange;
  height: 100%; /* Full height of container */
  transition: background-color 0.5s ease-in-out;
  border-radius: 2px; /* Add rounded corners */
}

.timer-bar--low {
  background-color: red;
  height: 100%; /* Full height of container */
  transition: background-color 0.5s ease-in-out;
  border-radius: 2px; /* Add rounded corners */
}
</style>
