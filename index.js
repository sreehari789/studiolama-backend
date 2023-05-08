const express= require('express')
const cheerio = require('cheerio');
const axios = require('axios') 

// creste server
const server= express()
server.use(express.json())

// setup port for the server
PORT=8000
server.listen(PORT,()=>{
    console.log(`server running on port number${PORT}`);
})


server.post('/data',async(req,res)=>{

        const url= req.body.url

        try{
        
        const response = await axios.get(url)
        const html= response.data
        const $ = cheerio.load(html);
        
        const articles = $('.td-ss-main-content')
        
        // empty array to push data
        const items=[];
        
        articles.each(function(){
            const title =$(this).find('h2').text()
            const discription =$(this).find('p').text()
            const imageUrl =$(this).find('p img').attr('src')
        
        items.push({
            title,
            discription,
            imageUrl
        })
        })
        console.log(items);
          
        res.status(200).send({statusCode:200,status:'url scraped successfully',data:items})
        
        // will throw a valid error if trying to use any other method 
        server.all('/data', (req, res) => {
            res.status(405).json({ statusCode:405, message: 'This method not allowed' });
          });
        }

        catch(error){
        console.log(error);
        res.status(500).send({statusCode:500,status:'error while scraping url'})
        
        }

})

