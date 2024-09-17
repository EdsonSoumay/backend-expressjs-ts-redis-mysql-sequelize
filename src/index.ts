import createServer from "./helpers/server";
const app = createServer()

app.listen(process.env.APP_PORT, () => {
	console.log((`${process.env.APP_NAME} running on port ${process.env.APP_PORT}`))
});