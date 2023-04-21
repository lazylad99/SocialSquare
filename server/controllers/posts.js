import Post from "../models/Post.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

/* CREATE */
export const createPost = async (req, res) => {
    // In case of errors, return Bad request along with errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, description, picturePath, location} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);

    } catch (err) {
        res.status(409).json({message: err.message})
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);

    } catch (err) {
        res.status(409).json({message: err.message});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);

    } catch (err) {
        res.status(409).json({message: err.message});
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes : post.likes },
            { new: true}
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(409).json({message: err.message});
    }
}

/* DELETE */
export const deletePost = async (req, res) => {
    try {
        const {id} = req.params;
        let post = await Post.findById(id);
        if(!post) return res.status(404).send("Not Found");

        if(post.userId.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
          }

          post = await Post.findByIdAndDelete(id);
        res.status(200).json({"Success": "Note has been deleted"});
          
    } catch (err) {
        res.status(409).json({message: err.message});
    }
}