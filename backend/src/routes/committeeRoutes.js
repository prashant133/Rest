const express = require("express");
const {
  createCommitteeMember,
  getAllCommitteeMembers,
  getCommitteeMemberById,
  updateCommitteeMember,
  deleteCommitteeMember,
  getCommitteeTitles,
} = require("../controller/committeeController");
const upload = require("../middleware/multer");
const router = express.Router();  


// Routes for committee members (admin-only)
router
  .route("/")
  .get(getAllCommitteeMembers) // Public access to view committee members
  .post( upload.fields([{ name: "profilePic", maxCount: 1 }]), createCommitteeMember);
router.get("/titles", getCommitteeTitles);
router
  .route("/:id")
  .get(getCommitteeMemberById)
  .put( upload.fields([{ name: "profilePic", maxCount: 1 }]), updateCommitteeMember)
  .delete( deleteCommitteeMember);

   

module.exports = router;