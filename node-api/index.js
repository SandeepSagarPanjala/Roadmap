var http = require("http");

var server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("Hello, World!");
    res.end();
  }

  if (req.url === "/api/customers") {
    res.write(
      JSON.stringify([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
      ]),
    );
    res.end();
  }
});

server.listen(3000);
