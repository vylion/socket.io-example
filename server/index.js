var port = process.env.PORT || 9000
var io = require('socket.io')(port)

var people = {}

io.on('connection', function (socket) {
  socket.broadcast.emit('welcome')
  console.log('user connected', socket.id)
	socket.emit('init_position', people)
  socket.on('disconnect', function () {
    console.log('user disconnected', socket.id)
		socket.broadcast.emit('rm_position', people[socket.id])
		delete people[socket.id]
  })
  socket.on('update_position', function (info) {
    console.log('Updating position', socket.id)
		info.id = socket.id
		people[socket.id] = info
		socket.broadcast.emit('update_position', info)
  })
})

console.log('server started on port', port)
