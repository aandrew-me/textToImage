const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
	apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
	if (req.method == "POST") {
		let jsonReq = req.body;
		console.log(jsonReq);
		try {
			const response = await openai.createImage(jsonReq);
			const imageList = response.data.data;
			console.log(response.data.data);
			res.status(200).json({ list: imageList, status: true });
		} catch (error) {
			console.log(error.response.data.error.message);
      let message = error.message
      if (error.response.data.error.message){
        message = error.response.data.error.message
      }
			res.status(403).json({ message, status: false });
		}
	} else {
		res.status(200).json({ Status: "Send post request" });
	}
}
