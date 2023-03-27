const router = require("express").Router();

const Post = require("../models/Post");

// Create a Post
router.post("/", async (req, res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(200).json("savePost");

    }catch(err) {
        res.status(500).json(err);
    }  

})


// Update a Post

router.put("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body});
        res.status(200).json("Post Updated Now");
    }else{
        res.status(403).json("You can only update your posts")
    }
    }catch(err) {
        res.status(500).json(err);
    }   
});

// delete a Post
router.delete("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.deleteOne();
        res.status(200).json("Post Deleted Now");
    }else{
        res.status(403).json("You can only Delete your posts");
    }
    }catch(err) {
        res.status(500).json(err);
    }   
});



// like / dislike a Post

router.put("/:id/like", async (req, res)=>{
try{
    const post = await Post.findById(req.params.id);
    if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push: {likes: req.body.userId }});
        res.status(200).json("Post Liked Now");
    }else{
        await post.updateOne({$pull: {likes: req.body.userId }});
        res.status(200).json("Post Disliked Now");
    }
}catch(err) {
        res.status(500).json(err);
    } 
});



// get a Post

router.get("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);

    }catch(err) {
        res.status(500).json(err);
    } 
});




// gate times Posts


router.get("/timeline", async (req, res)=>{
    let postArray = [];
    try{
        const currantUser = await User.findById(req.body.userId);
        const userPosts = await Post.findById({userId: currantUser._id});
        const friendPosts = await Promise.all(
            currantUser.followings.map((friendId) =>{
               return Post.find({userId: friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts))

    }catch(err) {
        res.status(500).json(err);
    } 
});












module.exports  = router;