import "dotenv/config";
import cors from "cors";

const dynamicCorsOptions = function (req, callback) {
	let corsOptions;

	if (req.method === "GET") {
		corsOptions = { origin: "*" };
	} else {
		corsOptions = { origin: process.env.ADMIN_PANEL_ORIGIN };
	}
	callback(null, corsOptions);
};

export const dynamicCors = cors(dynamicCorsOptions);
