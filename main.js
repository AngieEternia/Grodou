const { Client, Collection, Partials, color } = require("discord.js");
require("dotenv").config();
const Logger = require(`./Utils/Logger`);
const Database = require(`./Utils/Database`)

const client = new Client({
    intents: /*3276799*/ 38791,
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember,
        Partials.GuildScheduledEvent
    ],
});

["commands", "buttons", "selects"].forEach(
    (x) => (client[x] = new Collection())
);

["EventUtil", "CommandUtil", "ButtonUtil", "SelectUtil"].forEach((handler) => {
    require(`./Utils/Handlers/${handler}`)(client);
});

client.db = Database;
client.color = "#ed70a4";
client.snipe = new Map()
client.embedFootIcon = "https://eternia.fr/public/media/grodoubot/grodouRunLeft.gif";
client.embedFooter = "Grodou, le Big Boss";
client.function = {
    createID: require(`./Utils/Functions/createID`)
};

process.on("exit", (code) => {
    Logger.client(`Le processus s'est arrêté avec le code: ${code} !`);
});

process.on("uncaughtException", (err, origin) => {
    Logger.error(`UNCAUGHT_EXCEPTION: ${err}`);
    console.error(`Origine: ${origin}`);
});

process.on("unhandledRejection", (reason, promise) => {
    Logger.warn(`UNHANDLED_REJECTION: ${reason}`);
    console.log(promise);
});

process.on("warning", (...args) => Logger.warn(...args));

client.login(process.env.TOKEN);