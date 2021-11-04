const express = require('express');
const { Pokemon, Type } = require('../db')   
const router = express.Router();
const axios = require('axios')


router.use(express.json())

function filterTypesFromURL(arr) {
    const array = []
    arr.map((t) => array.push(t.type.name))
    return array;
}

function mapTypes(arr){
    return arr.map(type => {
        return {
            name: type.name,
            id: Number(type.id)
        }
    })
}

router.get('/', async (req, res) => {
    let { name } = req.query

    if(!name) {
   
        try{
            const pokesArr = (await axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=40')).data.results

            let promArr = [] 
            for(let p of pokesArr) {
                promArr.push(axios.get(p.url))
            }
            let resultAPI = (await Promise.all(promArr))
            .map(poke => {
                return ({
                    id: poke.data.id,
                    name: poke.data.name,
                    types: filterTypesFromURL(poke.data.types),
                    img: poke.data.sprites.other.dream_world.front_default || poke.data.sprites.other.home.front_default, 
                    hp: poke.data.stats[0].base_stat
                })
            })

            let db = await Pokemon.findAll({
                attributes: ['name', 'id', 'img', 'hp'],
                include: {
                    model: Type
                }
            })
            
            let resultDB = db.map(poke =>{
                return ({
                    id: poke.id,
                    name: poke.name,
                    img: poke.img,
                    hp: poke.hp,
                    types: mapTypes(poke.types)
                })
            })
            allResults = resultAPI.concat(resultDB)
            return res.send(allResults)

        } catch(err) {
            return res.status(500).send(`Server error: ${err}`)
        }
    }
    console.log(name)
    try {
        name = name.toLowerCase().trim()
        let dataDB = await Pokemon.findAll({
            where:{
                name: name
            },
            include: {
                model: Type
            }
        })
        console.log(dataDB)

        let pokemonsDB = dataDB.map(poke => {
            return ({
                id:poke.id,
                name: poke.name,
                img: poke.img,
                types: mapTypes(poke.types)
            })
        })

        let pokemonAPI

        try {
            let dataAPI = (await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)).data
            pokemonAPI = {
                id: dataAPI.id,
                name: dataAPI.name,
                types: filterTypesFromURL(dataAPI.types),
                img: dataAPI.sprites.other.dream_world.front_default || dataAPI.sprites.other.home.front_default
            }
        
        } catch (e) {
            pokemonAPI = e
        }

        if(!pokemonsDB.length && pokemonAPI.name === 'Error') throw new Error('404 No se encontró al pokemon')
        if(pokemonAPI.name === 'Error') return res.send(pokemonsDB)
   
        console.log('GET /')

        return res.send([...pokemonsDB, pokemonAPI])
   
    } catch (e) {
        return e.message.includes('404')
            ? res.status(404).send('No se encontró al pokemon')
            : res.status(500).send(`Server error: ${e}`)
    }
}),




router.post('/', async (req, res) => {
    try {
    const {name, weight, height, img, hp, speed, attack, defense, types} = req.body;
    
    const poke = await Pokemon.create({ 
        name: name.toLowerCase().trim(),  
        weight, 
        height, 
        img, 
        hp, 
        speed, 
        attack, 
        defense, 
    }) 
    await poke.addTypes(types)
    let id = poke.id
    let posted = (await Pokemon.findByPk(id ,{
        attributes: { 
            exclude: ['createdAt', 'updatedAt','height','weight','speed','defense','attack']
        },
        include: {
            model: Type
        }
    })).toJSON()
    posted = {...posted, types: mapTypes(posted.types)}
    console.log('POST /')
    return res.status(201).send(posted)
} catch (e) {
    res.status(500).send(`Server error: ${e}`)
}
}),


router.get('/:id', async (req, res) => {
    const {id} = req.params
    try{
        let pokemon 
        if(id.length > 10){ //si el id coincide con db
            
            pokemon = (await Pokemon.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: Type
                }
            })).toJSON()
            pokemon = {...pokemon, types: mapTypes(pokemon.types)}
            
        }else{ //si el id coincide con API
            
            let obj = (await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)).data
        
            pokemon = {
                name: obj.name,
                height: obj.height,
                id: id,
                weight: obj.weight,
                hp: obj.stats[0].base_stat,
                attack: obj.stats[1].base_stat,
                defense: obj.stats[2].base_stat,
                speed: obj.stats[5].base_stat,
                img: obj.sprites.other.dream_world.front_default || 'https://raw.githubusercontent.com/itsjavi/pokemon-assets/master/assets/svg/pokeball.svg',
                gif: obj.sprites.versions['generation-v']['black-white'].animated.front_default,
                types: filterTypesFromURL(obj.types)
            }
        }
        console.log('GET /:ID')
        return res.send(pokemon) 
    }catch(err){
        return err.name.includes('Error') 
            ? res.status(404).send('No se pudo encontrar al pokemon')
            : res.status(500).send(`Server error: ${err}`)
    }
}),








module.exports = router;
