const { Router } = require('express');
const pokemonRoute = require('./pokemons')
const typesRoute = require('./types')

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemons', pokemonRoute); // /api/pokemons/
router.use('/types', typesRoute); // /api/types/







module.exports = router;
