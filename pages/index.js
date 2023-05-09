import { useRef } from "react";

export default function Home() {
	const descriptionBtn = useRef("");
	const numField = useRef("");
	const loadingMsg = useRef("");
	const Images = useRef("");

	const generate = () => {
		const description = descriptionBtn.current.value;
		const num = Number(numField.current.value);
		const customModel = getId("customModel").value;
		let model = getId("modelSelect").value;
		if (customModel.length > 0 && model == "custom") {
			console.log("Custom model selected");
			model = customModel;
		}
		console.log("Num is " + num);
		console.log("Model:", model);

		if (description && num <= 10 && num >= 1) {
			Images.current.innerHTML = "";
			loadingMsg.current.textContent = "Processing...";
			loadingMsg.current.style.color = "white";

			const jsonObject = {
				prompt: description,
				n: num,
				size: "512x512",
				model,
			};

			fetch("/api/image", {
				method: "POST",
				body: JSON.stringify(jsonObject),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
				},
			}).then((res) =>
				res.json().then((data) => {
					console.log(data);
					if (data.status === true) {
						loadingMsg.current.textContent = "";

						data.list.forEach((image) => {
							const element = `<img class="images" src=${image.url}></img>`;
							Images.current.innerHTML += element;
						});
					} else {
						loadingMsg.current.textContent = data.message;
						loadingMsg.current.style.color = "Red";
					}
				})
			);
		} else {
			loadingMsg.current.textContent = "Use correct values";
			loadingMsg.current.style.color = "Red";
		}
	};

	return (
		<div>
			<h1>Text to image generator</h1>
			<div id="box">
				<label htmlFor="description">Prompt</label>
				<input
					ref={descriptionBtn}
					type="text"
					id="description"
					placeholder="Image description"
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							generate();
						}
					}}
				/>

				<br />
				<br />
				<label>Image Model</label>
				<select
					id="modelSelect"
					onChange={() => {
						let model = getId("modelSelect").value;
						if (model == "custom") {
							getId("customModel").style.display = "inline";
						} else {
							getId("customModel").style.display = "none";
						}
					}}
				>
					<option value="dalle">DALL.E</option>
					<option value="midjourney">Midjourney</option>
					<option value="realistic-vision-v13">
						Realistic Vision V13
					</option>
					<option value="anything-v4">Anything V4</option>
					<option value="synthwave-diffusion">
						Synthwave Diffusion
					</option>
					<option value="custom">
						Custom Stable Diffusion model
					</option>
				</select>
				<input
					type="text"
					id="customModel"
					placeholder="Custom Model ID"
				/>
				<br />
				<br />
				<span>Number of images to generate (Max 10) </span>
				<input
					ref={numField}
					type="number"
					id="num"
					min={1}
					max={10}
					defaultValue={1}
				/>
				<br />
				<br />

				<button onClick={generate} id="generate">
					Generate
				</button>

				<p ref={loadingMsg}></p>
			</div>

			<div ref={Images}></div>
		</div>
	);
}

function getId(id) {
	return document.getElementById(id);
}
