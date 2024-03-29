import { Router } from "express";
import { standardRouteErrorCallback } from "../index.js";
import schools from "../assets/schools.json" assert { type: "json"};

const router = Router();

router.get("/", (req, res) => {
    try {
        const { q = "", t = "" } = req.query;

        const result = schools.filter(({ name: schoolName, type }) => {
            let nameMatch = true, typeMatch = true;

            if (q) nameMatch = schoolName.toLowerCase().includes(q.toLowerCase());
            if (t) typeMatch = type === t;

            return typeMatch && nameMatch;
        });

        res.json({
            success: true,
            message: "OK",
            result
        });
    } catch (err) {
        console.error(err);
        standardRouteErrorCallback(res, req, err)
    }
});

export default router;