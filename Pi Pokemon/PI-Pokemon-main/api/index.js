//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn, Type } = require('./src/db.js');
const axios = require('axios');


// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(3001, async () => {
    try{
      let types = (await axios.get('https://pokeapi.co/api/v2/type')).data.results
      types = types.map(t => ({
        name: t.name
      }))
      let prom = types.map(type=>Type.create(type))
      
      Promise.all(prom)
        .then(res => {
          console.log('Tipos precargados!') 
        }) 

    }catch(err){
      console.log('Error: ',err)
    }
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});
