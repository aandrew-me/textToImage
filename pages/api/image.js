import axios from "axios";

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
	if (req.method == "POST") {
		let jsonReq = req.body;
		console.log(jsonReq);

		// For openai dalle model
		if (jsonReq.model === "dalle") {
			try {
				const response = await openai.createImage({
					prompt: jsonReq.prompt,
					n: jsonReq.n,
					size: jsonReq.size,
				});
				const imageList = response.data.data;
				console.log(response.data.data);
				res.status(200).json({ list: imageList, status: true });
			} catch (error) {
				console.log(error.response.data.error.message);
				let message = error.message;
				if (error.response.data.error.message) {
					message = error.response.data.error.message;
				}
				res.status(403).json({ message, status: false });
			}
		}
		// For other models
		else {
			const data = {
				key: process.env.STABLEDIFFUSION_API_KEY,
				model_id: jsonReq.model,
				prompt: jsonReq.prompt,
				negative_prompt: "",
				width: "512",
				height: "512",
				samples: "1",
				num_inference_steps: "30",
				safety_checker: "no",
				enhance_prompt: "no",
				seed: "null",
				guidance_scale: 7.5,
				webhook: null,
				track_id: null,
			};

			let response = await axios.post(
				"https://stablediffusionapi.com/api/v3/dreambooth",
				data
			);

			if (response.data.status != "error"){
				let imageList = response.data.output;
				let newImageList = [];
				imageList.forEach((element) => {
					newImageList.push({ url: element });
				});
				console.log(newImageList);
				res.status(200).json({ list: newImageList, status: true });
			} else {
				console.log(response.data.messege)
				res.status(403).json({ "message": response.data.messege, status: false });
			}
			
		}
	} else {
		res.status(200).json({ Status: "Send post request" });
	}
}
