const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userRegister = require('../models/register')
const post = require('../models/posts')
const Comment = require('../models/comments')

router.get('/',(req,res)=>{
    res.send('hi from the Home page')
});

// For REGISTRATIOIN OF NEW USERS

router.post('/signUp',async(req,res)=>{
    const {name,username,email,phone,password,cPassword} = req.body;
   
   

    try{
        if(!name||!username||!email||!phone||!password||!cPassword){
            res.send('please fill all the information to signUp')
        }
        const userLogin = await userRegister.findOne({email:email})
        if(userLogin){
            res.send('email id already exist')
        }else if(password!=cPassword){

            res.send('password does not match')
        }else{    

            const user = new userRegister({name,username,email,phone,password,cPassword})
            const userRgst = await user.save()

            if(userRgst){
                res.send('registration sucessfull')
            }
        }


    }catch(err){
        console.log(err);
    }
})



// FOR LOGIN OF EXISTING USERS

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    if(!email||!password){
        res.send('fill all the given fields properly')
    }

    try{
        const userLogin = await userRegister.findOne({email:email})
        if (!userLogin){
            res.send('invalid credentials')
        }else{

            const isMatch = await bcrypt.compare(password,userLogin.password)

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie('jwt',token,{

                // 25892000000 = 30days in milliseconds
                expires: new Date(Date.now()+25892000000),
                httpOnly:true
            });

            if(!isMatch){
                res.send('invalid credentials')
            }else{
                res.send('Login sucessfull')
            }
        }


    }catch(err){
        console.log(err)
    }
})


// TO POST A BLOG

router.post('/post',async(req,res)=>{
    const{username,title,desc} = req.body;

    if(!username||!title||!desc){
        res.send('fill all required details')
    }

    try{

        const userLogin = await userRegister.findOne({username:username})
        if(userLogin){

            const data = new post({username,title,desc})
            const blogPosted = await data.save()
            if(blogPosted){
                res.send('Blog posted sucessfully')
            }else{
                res.send('error while posting in error')
            }
        }else{
            res.send('Try after login')
        }

    }catch(err){
        console.log(err)
    }
})


// TO COMMENT ON A BLOG

router.put('/:id',async(req,res)=>{
    const {username,comment} = req.body;
    const {id} = req.params;
    const userLogin = await userRegister.findOne({username:username})
    if(userLogin){
        const postAvail = await post.findById(id);
        if(postAvail){
            const comm = new Comment({comment,username})
            const saveComment = await comm.save()
            postAvail.comments.push(saveComment);
            const {comments} = postAvail;
            const updatePost = await post.findByIdAndUpdate(id,{comments:comments});
            if(updatePost){
                res.status(200).send("Comments Updated Successfully");
            }else{
                res.status(400).send("Cannot Update");
            }
        }
    }
   
})


module.exports = router