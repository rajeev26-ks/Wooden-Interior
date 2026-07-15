// import express from 'express';
// import { signUp,login,findUsers,findUserByIdByBody,findUserByIdByParams, userUpdate, deleteUser } from '../controller/userController.js'

// const userRouter = express.Router()

// userRouter.post("/signUp",signUp)
// userRouter.post("/login", login)
// userRouter.get("/findUsers", findUsers)
// userRouter.post("/findUserByIdByBody", findUserByIdByBody)
// userRouter.get("/findUserByIdByParams/:id",findUserByIdByParams)
// userRouter.put("/userUpdate", userUpdate)
// userRouter.delete("/deleteUser/:id", deleteUser)
// router.get('/all', getAllUsers);
// router.put('/update-role/:id', updateUserRole);
// router.delete('/delete/:id', deleteUser);
// export default userRouter;

import express from 'express';
import { 
  signUp, 
  login, 
  findUsers, 
  findUserByIdByBody, 
  findUserByIdByParams, 
  userUpdate, 
  deleteUser, // Yeh aapka pehle se chal raha delete controller hai
  updateUserRole // Controller se ise import kar lena (agar functions alag file me hain)
} from '../controller/userController.js';

const userRouter = express.Router();

// 🔐 Authentication Endpoints
userRouter.post("/signUp", signUp);
userRouter.post("/login", login);

// 👥 General User Data Fetching
userRouter.get("/findUsers", findUsers);
userRouter.post("/findUserByIdByBody", findUserByIdByBody);
userRouter.get("/findUserByIdByParams/:id", findUserByIdByParams);
userRouter.put("/userUpdate", userUpdate);

// 🛠️ Admin Dashboard Live Sync Endpoints (Cleaned & Unified)
userRouter.get('/all', findUsers); // Frontend par direct state mapping ke liye 'findUsers' ko hi handle karega
userRouter.put('/update-role/:id', updateUserRole); // Role toggle handler endpoint
userRouter.delete("/delete/:id", deleteUser); // Frontend direct '/user/delete/:id' hit karega

export default userRouter;