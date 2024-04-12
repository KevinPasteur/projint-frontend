<template>
    <button @click="connect()">Connect</button>
    <button @click="disconnect()">Disconnect</button>
    <button @click="createRoom()">Create Room</button>
</template>

<script>
import { socket } from "@/socket";

export default {
    name: "ConnectionManager",

    methods: {
        connect() {

            socket.connect();
            console.log(socket.connect());
        },
        createRoom() {
            socket.emit('create', 'room1');
        },
        disconnect() {
            socket.disconnect();
            console.log(socket.disconnect());
        }
    }
}
</script>