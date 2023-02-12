socket.on('joined', function (data) {
  console.log(data);
});

socket.on('receive', function (data) {
  console.log(data);
});

socket.on('attemptconnect', function (data) {
  console.log(data);
});
