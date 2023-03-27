const User = require('../models/User');

const router = require('express').Router();


//update user

router.put("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){

        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                 res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            });
            res.status(200).json("Account hash been updated");
        }catch(err){
             res.status(500).json(err);
        }
    }else{
         res.status(403).json("Acount Updated")
    }
});




//delete user

router.delete("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
             await User.findByIdAndDelete(req.params.id )
            res.status(200).json("Account hash been deletedd");
        }catch(err){
             res.status(500).json(err);
        }
    }else{
         res.status(403).json("Acount Deleted")
    }
});





//get a user
router.get("/:id", async (req, res) =>{
    try{
        const user = await User.findById(req.params.id);
        const{password,updatedAt, ...other} = user._doc
        res.status(200).json(other);

    }catch(err){
         res.status(500).json(err);
    }
});





// follow a user 



router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try{

            const user = await User.findById(req.params.id);
            const curruntUser = await User.findById(req.params.useId);


            if(!user.followers.includes(req.body.userId)){
                await user.updateOne( { $push: { followers: req.body.userId }});
                await curruntUser.updateOne( { $push: {followings: req.body.id }});
                res.status(200).json("user has been followed");

            } else{
                res.status(403).json("you already follow this user");
            }
        } catch(err){
         res.status(500).json(err);

        }
    } else {
        res.status(403).json("You cant follow yourself");
    }
});


// Unfollow

router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try{

            const user = await User.findById(req.params.id);
            const curruntUser = await User.findById(req.params.useId);


            if(user.followers.includes(req.body.userId)){
                await user.updateOne( { $pull: { followers: req.body.userId }});
                await curruntUser.updateOne( { $pull: {followings: req.body.id }});
                res.status(200).json("user has been unfollowed");

            } else{
                res.status(403).json("you already unfollow this user");
            }
        } catch(err){
         res.status(500).json(err);

        }
    } else {
        res.status(403).json("You cant unfollow yourself");
    }
});


module.exports  = router;