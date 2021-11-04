const { Router } = require('express');
const pokemons = require('./pokemons')
const types = require('./types')

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemons', pokemons); // /api/pokemons/
router.use('/types', types); // /api/types/






module.exports = router;
