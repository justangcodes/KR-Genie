import { devs, staff } from '../../data';
import db from '../../modules';
import { createEmbed } from '../../modules/messageUtils';
import { commandsLog } from '../../modules/logger';

export const name = 'remove';
export const dev = true;
export async function execute(message, args) {
    if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
        return;
    if (!args[0])
        return message.reply(createEmbed(message.author, 'RED', 'Provide a user for me to erase from existence'));
    const target = message.client.users.fetch(args[0].replace(/\D/g, ''));
    try {
        await target;
    } catch (error) {
        message.reply(createEmbed(message.author, 'RED', 'Unknown user'));
        return;
    }
    target.then(async(user) => {
        await db.delete(user.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully erased all data for the user \`${user.username}\``));
        commandsLog(message.author, 'unban', `${message.author.tag} unbanned ${target.tag}`, message.guild, args, 'Action : Unban');
    });
}
