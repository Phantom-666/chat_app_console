import http from "http"
import { Server } from "socket.io"

const server = http.createServer()
const io = new Server(server)

const users: string[] = []

const findIndex = (array: string[], element: string) => {
  let value = -1

  for (let i = 0; i < array.length; ++i) {
    if (array[i] === element) {
      value = i

      break
    }
  }

  return value
}

io.listen(3001)

io.on("connection", (client) => {
  console.log("connected", client.id)

  if (users.length === 2) {
    client.disconnect()

    return
  }

  users.push(client.id)

  if (users.length === 2) {
    users.map((id, i) => {
      const friend = i === 0 ? 1 : 0

      io.to(id).emit("readyToChat", {
        message: `ready to chat with ${users[friend]}`,
        to: users[friend],
      })
    })
  }

  console.log(users)

  client.on("clientConsoleLog", (data) => {
    console.log(`Message from client ${client.id}:`, data.message)

    io.to(data.to).emit("getMessage", { message: data.message })
  })

  client.on("disconnect", () => {
    const index = findIndex(users, client.id)
    users.splice(index, 1)
    console.log(users)
  })
})
server.listen(3000)
