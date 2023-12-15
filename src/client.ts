import io from "socket.io-client"
import readline from "readline"

const socket = io("http://localhost:3001")

socket.on("connect", () => {
  console.log("Connected to the server!")
})

let to = ""

const loopQuestion = () =>
  new Promise((res, rej) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question("", (message) => {
      res(message)
      rl.close()
    })
  })

socket.on("readyToChat", async (data) => {
  console.log("Received data from server:", data.message)

  to = data.to

  while (true) {
    const message = await loopQuestion()

    socket.emit("clientConsoleLog", { message, to })
  }
})

socket.on("getMessage", (data) => {
  console.log("\nreceived message : ", data.message)
})

socket.on("disconnect", () => {
  console.log("Disconnected from the server!")
})
