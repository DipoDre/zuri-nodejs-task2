const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://jsonplaceholder.typicode.com/posts';
const resultPath = path.join(__dirname, 'result');
const postsPath = path.join(__dirname, 'result', 'posts.json');


let request = https.get(url, response => {
    
    if (response.statusCode !== 200) {
        console.error('Did not get an OK from the server. Code: ${res.statusCode}');
        response.resume();
    }

    else if (response.headers["content-type"] !== 'application/json; charset=utf-8') {
        console.error('Invalid content-type');
        response.resume();
    }
    else {
    
        let body = "";
        response.setEncoding("utf-8");
        response.on("data", chunk => { body += chunk; });
        response.on("end", () => {

            if(!fs.existsSync('./result')) {
    
                fs.mkdir(resultPath, err => {
                    if(err) {
                        console.log('Error occured while creating the Result Directory.')
                    }
                })
            }
            
            fs.writeFile(postsPath, body, err => {
                if (err) {
                    console.error('Error encountered while writing to Posts.json');
                }
                
            });
        
        });
        response.on("error", error => console.log(error.message));
    }
});
    

request.on("error", error => {
    if(error.code == 'ENOTFOUND') {
        console.log({message: 'Domain is unavailable or cannot be reached.', code: error.code});
    } else {
        console.log({message: 'An Error Occurred', code: error.code});
    }

});


