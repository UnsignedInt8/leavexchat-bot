import * as TT from 'telegraf/typings/telegram-types';
import * as XMLParser from '../lib/XmlParser';

import { Contact, Message } from 'wechaty';
import { ContactType, MessageType } from 'wechaty-puppet';

import { AllHtmlEntities } from 'html-entities';
import Bot from '../Bot';
import HTMLTemplates from '../lib/HTMLTemplates';
import Logger from '../lib/Logger';
import { TelegrafContext } from 'telegraf/typings/context';
import download from 'download';
import isGif from 'is-gif';
import lang from '../strings';
import { writeFile } from './UpdateTmpFile';

const html = new AllHtmlEntities();
const banNotifications = [
  '分享的二维码加入群聊',
  '加入了群聊',
  `" 拍了拍 "`,
  'with anyone else in this group chat',
  'joined the group chat via',
  'to the group chat',
  ' tickled ',
  'invited you to a group chat with',
  '邀请你加入了群聊，群聊参与人还有',
  '与群里其他人都不是微信朋友关系，请注意隐私安全',
  '你通过扫描二维码加入群聊，群聊参与人还有：',
  '" 拍了拍自己'
];

export default async (self: Bot, msg: Message, ctx: TelegrafContext) => {
  let id = ctx.chat.id;
  let user = self.clients.get(id);

  let from = msg.talker();
  let room = msg.room();

  if (room) {
    const topic = await room.topic();
    if (user.muteList.includes(topic)) return;
  }

  let type = msg.type() as any;
  let text = msg
    .text()
    .replace(/\<br\/\>/g, ' \n')
    .replace(/<[^>]*>?/gm, '');

  if (user.wechatId === from.id && !user.receiveSelf) return;
  if (!user.receiveOfficialAccount && from.type() === ContactType.Official) return;
  if (!user.receiveGroups && room) return;

  let alias = await from.alias();

  // if (self.muteList.includes(from.name())) {
  //   return;
  // }

  // if (alias && self.muteList.includes(alias)) {
  //   return;
  // }

  let nickname = from.name() + (alias ? ` (${alias})` : '');
  nickname = nickname + (room ? ` [${await room.topic()}]` : '');

  if (
    user.contactLocked &&
    user.currentContact instanceof Contact &&
    alias === (await (user.currentContact as Contact).alias()) &&
    from.name() === (user.currentContact as Contact).name()
  ) {
    nickname = `${nickname}[${lang.message.contactLocked('').trim()}]`;
  }

  let sent: TT.Message;

  if (nickname.includes('Friend recommendation message')) {
    await handleFriendApplyingXml(text, ctx);
    return;
  }

  switch (type) {
    case MessageType.Text:
      if (!text) break;
      let isXml = text.startsWith(`&lt;?xml version="1.0"?&gt;`);

      if (isXml) {
        if (await handleContactXml(text, nickname, ctx)) break;
      } else if (room && banNotifications.some(n => text.includes(n))) {
        // junk info
        break;
      } else {
        sent = await ctx.replyWithHTML(HTMLTemplates.message({ nickname, message: text }));
      }
      break;

    case MessageType.Attachment:
      try {
        let xml = html.decode(msg.text());
        let markdown = from.type() === ContactType.Official ? XMLParser.parseOffical(xml) : XMLParser.parseAttach(xml);
        sent = await ctx.replyWithMarkdown(HTMLTemplates.markdown({ nickname, content: markdown }));
      } catch (error) {
        Logger.error(error.message);
      }

      break;

    case MessageType.Contact:
      await handleContactXml(text, nickname, ctx);
      break;
    // case MessageType.RedEnvelope:
    //   sent = await ctx.replyWithHTML(HTMLTemplates.message({ nickname, message: lang.message.redpacket }));
    //   break;

    case MessageType.Audio:
      let audio = await msg.toFileBox();
      let source = await audio.toBuffer();
      let duration = source.byteLength / (2.95 * 1024);
      sent = (await ctx.replyWithVoice({ source }, { caption: nickname, duration })) as TT.Message;
      break;

    case MessageType.Image:
      let image = await msg.toFileBox();

      if (image.mimeType === 'image/gif') {
        const buffer = await image.toBuffer();
        if (isGif(buffer)) {
          sent = await ctx['replyWithAnimation']({ source: buffer }, { caption: `${nickname}` });
          break;
        }
      }

      sent = await ctx.replyWithPhoto({ source: await image.toStream() }, { caption: nickname });
      break;

    case MessageType.Video:
      let video = await msg.toFileBox();
      sent = await ctx.replyWithVideo({ source: await video.toStream() }, {
        caption: nickname
      } as any);
      break;

    default:
      if (!room) sent = await ctx.replyWithHTML(HTMLTemplates.message({ nickname, message: lang.message.notSupportedMsg }));
      break;
  }

  if (!sent) {
    return;
  }

  if (!user.firstMsgId) user.firstMsgId = sent.message_id;
  user.msgs.set(sent.message_id, { contact: room || from, wxmsg: msg });

  if (!user.contactLocked) {
    if (user.currentContact?.id !== (room || from).id) {
      await writeFile(`${self.id}${id}`, { recentContact: { name: room ? await room.topic() : from.name() } });
    }

    user.currentContact = room || from;
  }

  // The bot just knows recent messages
  if (sent.message_id < self.keepMsgs) return;
  let countToDelete = sent.message_id - self.keepMsgs;

  do {
    user.msgs.delete(countToDelete);
    countToDelete--;
  } while (countToDelete > 0);
};

async function handleContactXml(text: string, from: string, ctx: TelegrafContext) {
  try {
    const xml = html.decode(text);
    const c = XMLParser.parseContact(xml);
    if (!c.wechatid && !c.nickname && !c.headerUrl) return false;

    const caption = `
[${lang.contact.card}]

${lang.contact.nickname}: ${c.nickname}
${lang.contact.gender}: ${lang.contact[c.sex]}
${lang.contact.province}: ${c.province}
${lang.contact.city}: ${c.city}
${lang.contact.wechatid}: ${c.wechatid}
----------------------------
${from}`;

    const header = await download(c.headerUrl);
    await ctx.replyWithPhoto({ source: header }, { caption });

    return true;
  } catch (error) {
    Logger.error(error.message);
  }

  return false;
}

async function handleFriendApplyingXml(text: string, ctx: TelegrafContext) {
  try {
    const xml = html.decode(text);
    const c = XMLParser.parseFriendApplying(xml);
    if (!c.applyingMsg) return false;

    const reply = `
[${lang.contact.card}]

${lang.contact.nickname}: ${c.nickname}
${lang.contact.gender}: ${lang.contact[c.sex]}
${lang.contact.applying}: ${c.applyingMsg}
${lang.contact.wechatid}: ${c.wechatid}
----------------------------
${lang.contact.friend}`;

    const header = await download(c.headerUrl);
    await ctx.replyWithPhoto({ source: header }, { caption: reply });

    return true;
  } catch (error) {
    Logger.error(error.message);
  }

  return false;
}
