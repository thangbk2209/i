var express=require("express");
var app=express();
var port=process.env.PORT||8080;
var mongo=require("mongodb").MongoClient;
var Bing=require("node-bing-api")({accKey:"NTfjlBHjRMe3V3/fHaRVT6uEFXU0h0BhSI2zRoRUXe8"});
var mongoURL = 'mongodb://thangbk2209:thang2209@ds059516.mlab.com:59516/url-fcc-thangbk2209';
app.get("/",function(req,res){
    res.send("hello!!!");
})
app.get("/api/imagesearch/:string",function(req,res){
    var myString=req.params.string;
    console.log(myString);
    var time=new Date();
    var results=[];
    mongo.connect(mongoURL,function(err,db){
        if(err){
            console.log(err);
        }
        var collect=db.collection("image-search");
        var data={
            term:myString,
            when:time
        }
        collect.insert(data,function(err){
            if(err){
                console.log("can't insert data to database!!!");
            }
            db.close();
        })
    })
    Bing.images(myString,{skip:20},function(err,response,body){
        if(err){
            console.log(err);
        }
        var bod=body.d.results;

        for(var i=0;i<bod.length;i++){
            var kq=bod[i];
            var tim_kiem={
                "url":kq.MediaUrl,
                "snippet":kq.Title,
                "thumbnail": kq.Thumbnail.MediaUrl,
                "context":kq.SourceUrl
            }
         results.push(tim_kiem);
        }

        res.send(results);
       // console.log(bod);
    })
    //res.send(results);
})
app.get("/api/latest/imagesearch/",function(req,res){
    console.log("start");
    //var time=new Date();
    mongo.connect(mongoURL,function(err,db){
        if(err){
            console.log(err);
        }
        var collect=db.collection("image-search");
        collect.find(
            {
                
            }).toArray(function(err,docs){
            if(err){
                console.log(err);
            }
            if(docs.length>0){
                var tenLastest=[];
                for(var i=docs.length-1 ; i>docs.length-11;i--){
                var lastest={
                    "term":docs[i].term,
                    "when":docs[i].when
                }
                    tenLastest.push(lastest);
                }
                res.send(tenLastest);
            }else{
                res.send("not found!!!");
                
            }
        })
        db.close();
    })
    
})


app.listen(port,function(){
    console.log("Linstening on port: "+port);
})