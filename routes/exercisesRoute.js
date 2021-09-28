const express = require("express")
const exercisesRouter = express.Router()


//importing mongodb
const mongo = require("../shared/mongo")

//importing service

const excercisesService = require("../services/exercisesService")

exercisesRouter.get("/",async(req,res) => {
    const posts = await excercisesService.getExcercises()
    res.send(posts);
})

exercisesRouter.get("/:id",async(req,res) => {
    const posts = await excercisesService.getExercise(req.params.id)
    res.send(posts);
})

exercisesRouter.post("/",async(req,res) => {
    const post = await excercisesService.addExercise(req.body);
    res.send(post)
})

exercisesRouter.put("/:id",async(req,res) => {
    const post = await excercisesService.updateExwrcise(req.params.id,req.body) ;
    res.send(post)
})

exercisesRouter.delete("/:id",async(req,res) => {
    await excercisesService.deleteExercise(req.params.id);
    res.send({});
})


module.exports = exercisesRouter; 