const dns = require('dns');


require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');

const db = require('./connection');
const Shortened = require('./Shortened');

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', async (req, res, next) => {
  try {
    const { url = undefined } = req.body;
    console.log(url);
    const storedUrl = await Shortened.findOne({ original_url: url });

    if (storedUrl) {
      const { original_url, short_url } = storedUrl;
      return res.json({ original_url, short_url });
    }

     const result = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url);
        console.log(result);
      if(!result) {
         return res.json({ error: 'invalid url' });
      }
      
  const checkUrl = new URL(url);
  dns.lookup(checkUrl.host, async (err, address, family) => {
  if (err) {
   return res.status(400).json({ error: 'invalid url' });
  }
  const total =  await Shortened.all()
  console.log(total);
   const { original_url, short_url } = await Shortened.create({
      original_url: url,
      short_url: total + 1,
    });
    res.json({ original_url, short_url });
});
   
  } catch (error) {
    console.log(error);
    if(error.name === 'TypeError' && error.name === 'ValidationError') {
      return res.status(400).json({ error: 'invalid url' });
    }
    return res.status(400).json({error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', async (req, res, next) => {
  const {short_url} = req.params;
  const url = await Shortened.findOne({short_url});
  
 if(!url) {
    return res.status(400).json({error: 'Unregistered Url'});
 }
 return res.redirect(url.original_url);
})

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(process.env.PORT, function () {
  console.log(`Listening on port ${port}`);
});
