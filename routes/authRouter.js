import express from "express";
import userCtrl from "../controllers/userCtrl.js"
import middleware  from "../middleware/authMiddleware.js"

const router= express.Router();

router.post('/register',userCtrl.createUser);
router.post('/login',userCtrl.loginUserCtrl);
router.get('/all-users',userCtrl.getAllUser);
router.get("/",middleware.authMiddleware,middleware.isAdmin,userCtrl.getUserById);
router.delete('/delete',middleware.authMiddleware,userCtrl.deleteUserById)
router.put('/update',middleware.authMiddleware,userCtrl.updateUser)
router.put('/block/:id',middleware.authMiddleware,middleware.isAdmin,userCtrl.blockUser)
router.put('/unblock/:id',middleware.authMiddleware,middleware.isAdmin,userCtrl.unblockUser)


export default router;