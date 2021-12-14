let video = document.querySelector("#video")
let model;
let canvas  = document.querySelector("#canvas")
let ctx = canvas.getContext("2d")

const setupCamera =  () => {
    navigator.mediaDevices
        .getUserMedia({
            video: {width: 600, height: 400},
            audio: false
        })
        .then((stream) => {
            video.srcObject = stream
        })
    }

const detectFaces = async () => {
    const prediction = await model.estimateFaces(video, false);

   // console.log('prediction', prediction);

    ctx.drawImage(video, 0, 0, 600, 400)

    prediction.forEach((pred) => {
        ctx.beginPath();
        ctx.lineWidth = "4"
        ctx.strokeStyle = "#16a085"
        ctx.rect(
            pred.topLeft[0],
            pred.topLeft[1],
            pred.bottomRight[0] - pred.topLeft[0],
            pred.bottomRight[1] - pred.topLeft[1]
        );
        ctx.stroke()

    
        ctx.fillStyle = "#c0392b"
        pred.landmarks.forEach((landmarks) => {
            ctx.fillRect(landmarks[0], landmarks[1], 5, 5)
        })
    })
}

setupCamera()

video.addEventListener("loadeddata", async () => {
    model = await blazeface.load()
    setInterval(detectFaces, 40)
})
