const { Router } = require('express');



const router = Router();

router.get('/', (req, res, next) => {
    res.send('get /types')
})

router.post('/', (req, res, next) => {
    res.send('post /types')
})

router.put('/', (req, res, next) => {
    res.send('put /types')
})

router.delete('/', (req, res, next) => {
    res.send('delete /types')
})




module.exports = router;
