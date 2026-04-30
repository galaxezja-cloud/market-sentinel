const express =require('express');
const fs = require('fs');
const cors = require('cors')
const {exec}= require('child_process');



const app=express();
const port=process.env.port || 5000;

app.use(cors());
app.use(express.json());

let alerts=[];

async function start_scraping() {

    const pythonExe = "C:/Users/Mr. PY/PycharmProjects/API Scarping/.venv/Scripts/python.exe";
    const scriptPath = "C:/Users/Mr. PY/PycharmProjects/API Scarping/main.py";

    exec(`"${scriptPath}" "${pythonExe}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Python Stderr: ${stderr}`);
            return;
        }

        try {
            
             alerts = JSON.parse(stdout); 
            console.log("Sentinel Pipeline Active. Received:", alerts.length, "high-impact events.");

        } catch (parseError) {
    console.log("--- PYTHON OUTPUT START ---");
    console.log(stdout); 
    console.log("------------");
    console.error("Parse Error:", parseError.message);
}
    });
}
app.get('/api/signal/info/data' ,async (req,res)=>{
     res.json({
        status: "success",
        timestamp: new Date().toISOString(),
        data: alerts
    });
});

app.listen(port,()=>{
    console.log(`Server live on http://localhost:${port}`)
});
start_scraping()
setInterval(start_scraping, 1000*60*5);

