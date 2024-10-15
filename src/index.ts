import { createServer } from "./infrastructures/server";

const { httpServer } = createServer(); // Dapatkan httpServer dan io

const PORT = process.env.APP_PORT || 3000; // Set port default jika APP_PORT tidak didefinisikan

// Mulai server HTTP
httpServer.listen(PORT, () => {
    console.log(`${process.env.APP_NAME} running on port ${PORT}`);
});
