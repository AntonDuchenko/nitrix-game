import createServer from "./createServer";

const PORT = process.env.SERVER_PORT || 5000;

createServer().listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
