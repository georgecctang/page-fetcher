const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const path = process.argv[2];
const localPath = process.argv[3];


request(path, (error, response, body) => {
  if (error) {
    console.error('Invalid URL. Please try again.');
    process.exit();
  };

  const length = response.headers['content-length'];
  console.log('Status Code:', response.statusCode);
  console.log('Status Status:', response.statusMessage);

  if (response.statusCode !== 200) {
    process.exit();
  }

  // Recursively ask for response; only 'y' or 'n' will be accepted
  const recursiveAsyncReadLine = function () {
    rl.question(`File path ${localPath} already exists. Overwrite? [y/n]: `, (answer) => {
      if (answer === 'n') {
          console.log(`Aborted: ${localPath} is not overwritten.`);
          return process.exit();
      } else if (answer === 'y') {
          fs.writeFile(localPath, body, (err) => {
            if (err) throw err;
            console.log(`Downloaded and saved ${length} bytes to ${localPath}`);
            return process.exit();  
          });
      } else {
        recursiveAsyncReadLine();
      }
    })};
  
  if (fs.existsSync(localPath)) {
    recursiveAsyncReadLine();
  } else {
    fs.writeFile(localPath, body, (err) => {
      if (err) throw err;
      console.log(`Downloaded and saved ${length} bytes to ${localPath}`);
      process.exit();
    });
  }
});


// const recursiveAsyncReadLine = function () {
//   rl.question(`File path ${localPath} already exists. Overwrite? [y/n]: `, (answer) => {
//     switch (answer) {
//       case 'n':
//         console.log(`Aborted. File ${localPath} is NOT overwritten.`);
//         return process.exit();
//       case 'y':          
//         fs.writeFile(localPath, body, (err) => {
//           if (err) throw err;
//           console.log(`Downloaded and saved ${length} bytes to ${localPath}`);
//           process.exit();  
//         });
//       default:
//         console.log(answer);
//         recursiveAsyncReadLine();
//     }

//   }
// )}