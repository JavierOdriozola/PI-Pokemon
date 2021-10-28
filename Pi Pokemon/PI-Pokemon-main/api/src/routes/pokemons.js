const { Router } = require('express');
const { Pokemon } = require('../db')   
const router = Router();

router.get('/', (req, res, next) => {
    return Pokemon.findAll()
    .then((pokemons) => {
        res.send(pokemons)
    })

})

router.post('/', async (req, res, next) => {
    const {name, weight, height, img, hp, speed, attack, defense, types} = req.body;
    const newPokemon = await Pokemon.create({ 
        name, 
        weight, 
        height, 
        img, 
        hp, 
        speed, 
        attack, 
        defense, 
        types
    }) 
    res.send(newPokemon)
})

router.put('/', (req, res, next) => {
    res.send('put /pokemons')
})

router.delete('/', (req, res, next) => {
    res.send('delete /pokemons')
})





module.exports = router;
