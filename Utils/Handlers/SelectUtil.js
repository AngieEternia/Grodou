const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
const Logger = require(`../Logger`);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/Selects/*/*.js`)).map(async selectMenuFile => {
        const selectMenu = require(selectMenuFile);
        if (!selectMenu.name) return Logger.warn(`Select-Menu non-chargé : merci d'indiquer un nom ↓\n➡️  Fichier : ${selectMenuFile}`);
        client.selects.set(selectMenu.name, selectMenu);
    });
};