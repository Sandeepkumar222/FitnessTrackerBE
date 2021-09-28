const express = require("express")
const exercisesRouter = express.Router()


//importing mongodb
const mongo = require("../shared/mongo")

//importing service

const exercisesService = require("../services/exercisesService")

exercisesRouter.get("/",async(req,res) => {
    const posts = await exercisesService.getExercises()
    res.send(posts);
})

exercisesRouter.get("/:id",async(req,res) => {
    const posts = await exercisesService.getExercise(req.params.id)
    res.send(posts);
})

exercisesRouter.post("/",async(req,res) => {
    const post = await exercisesService.addExercises(req.body);
    res.send(post)
})

exercisesRouter.put("/:id",async(req,res) => {
    const post = await exercisesService.updateExercise(req.params.id,req.body) ;
    res.send(post)
})

exercisesRouter.delete("/:id",async(req,res) => {
    await exercisesService.deleteExercise(req.params.id);
    res.send({});
})


module.exports = exercisesRouter; 
