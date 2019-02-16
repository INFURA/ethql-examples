const fetch = require('node-fetch');
const fs = require('fs');

fetch(`https://ethql-denver.infura.io`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: `
	{ block(tag: LATEST) { number } }
    `,
  }),
})
  .then(result => result.json())
  .then(console.log)
  .catch( (err) => {
    console.log(err);
  });

