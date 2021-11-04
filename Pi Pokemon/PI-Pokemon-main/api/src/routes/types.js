const { Router } = require('express');
const { Type } = require('../db')   


const router = Router();

router.get('/', async (req, res) => {
        try{
            let types = await Type.findAll({
                attributes: ['name', 'id']
            })
            return res.send(types)
        } catch(e){
            return res.status(500).send(`Server error: ${e}`)
        }
    })





module.exports = router;
