import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/process-video", (req, res) => {
    // Get the video url from the request body
    const inputVideoPath = req.body.inputFilePath;
    const outputVideoPath = req.body.outputFilePath;

    if (!inputVideoPath || !outputVideoPath) {
        res.status(400).send("Bad Request: Missing file path");
    }

    ffmpeg(inputVideoPath)
    .outputOptions("-vf", "scale=-1:360") // Resize to 360p
    .on("end", () => {
        res.status(200).send("Video processing complete!");
    })
    .on("error", (err) => {
        console.log(`Error: ${err.message}`)
        res.status(500).send("Internal Server Error: " + err.message);
    })
    .save(outputVideoPath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Video processing service running at http://localhost:${port}`)});