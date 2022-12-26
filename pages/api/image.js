const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()


const configuration = new Configuration({
	apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method == "POST"){
    let jsonReq = req.body
    console.log(jsonReq);
    const response = await openai.createImage(jsonReq);
    const imageList = response.data.data
    console.log(response.data.data);
    res.status(200).json({"list":imageList})
  }
  else{
    res.status(200).json({"Status":"Send post request"})
  }
}
