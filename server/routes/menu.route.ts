import express from "express" 
import upload from "../middlewares/multer";
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { addMenu, editMenu,deleteMenu } from "../controller/menu.controller";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("image"), addMenu);
router.route("/:id").put(isAuthenticated, upload.single("image"), editMenu);
router.route("/:id").delete(isAuthenticated, deleteMenu);
 
export default router;
