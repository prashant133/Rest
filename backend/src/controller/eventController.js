const EventPost = require("../model/eventModel.js");
const { uploadOnCloudinary, deleteImage } = require("../utils/cloudinary.js");


const handleError = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({ error: error.message });
};

const validatePostData = ({ title, description }) => {
  if (!title || !description) {
    throw new Error("Title and description are required");
  }
  if (description.length > 500) {
    throw new Error("Description must be less than 500 characters");
  }
};

const createEventPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    validatePostData({ title, description });

    const localFilePath = req.file?.path;
    const uploadedImage = await uploadOnCloudinary(localFilePath);

    const newEventPost = new EventPost({
      title,
      description,
      img: uploadedImage?.secure_url || null,
    });

    await newEventPost.save();
    res.status(201).json(newEventPost);
  } catch (err) {
    handleError(res, err, err.message.includes("required") || err.message.includes("characters") ? 400 : 500);
  }
};

 const getEventPost = async (req, res) => {
  try {
    const post = await EventPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    handleError(res, err);
  }
};

 const deleteEventPost = async (req, res) => {
  try {
    const post = await EventPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await deleteImage(imgId);
    }

    await EventPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

 const editEventPost = async (req, res) => {
  try {
    const { title, description, img } = req.body;
    const postId = req.params.id;
    validatePostData({ title, description });

    const post = await EventPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let imageUrl = post.img;
    if (img && img !== post.img) {
      if (post.img) {
        const imgId = post.img.split("/").pop().split(".")[0];
        await deleteImage(imgId);
      }
      imageUrl = await uploadOnCloudinary(img);
    }

    post.title = title;
    post.description = description;
    post.img = imageUrl;

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    handleError(res, err, err.message.includes("required") || err.message.includes("characters") ? 400 : 500);
  }
};

 const getUserEventPosts = async (req, res) => {
  try {
    const posts = await EventPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    handleError(res, err);
  }
};

 const getEventFeedPosts = async (req, res) => {
  try {
    const posts = await EventPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts || []);
  } catch (err) {
    handleError(res, err);
  }
};
module.exports = {
  createEventPost,
  getEventPost,
  deleteEventPost,
  editEventPost,
  getUserEventPosts,
  getEventFeedPosts,
};