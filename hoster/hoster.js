const express = require('express')
const app =  express()
const port = 8000

app.use("/static", express.static('./static/'));    

app.get('/', (req, res) => {
    res.set('Cross-Origin-Opener-Policy', 'same-origin')
    res.set('Cross-Origin-Embedder-Policy', 'require-corp')
    res.sendFile('./index.html', {root: __dirname})
})

app.listen(port, () => console.log('Started server'))
