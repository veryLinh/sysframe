require('../../lib-signal/settings/settings')
const {
  default: makeWASocket,
  prepareWAMessageMedia,
  InteractiveMessage,
  useMultiFileAuthState,
  DisconnectReason,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  utilsFlagHandler,
  jidDecode,
  proto,
  Browsers
} = require(viewserc)

const {
  startTelegramBot
} = require('../../x-system/telegram/XianZhi')
const axios = require('axios')
const chalk = require('chalk')
const fs = require('fs')
const FileType = require('file-type')
const nou = require('node-os-utils')
const os = require('os')
const path = require('path')
const pino = require('pino')
const PhoneNumber = require('awesome-phonenumber')

const {
  fork,
  exec,
  execSync
} = require('child_process')
const {
  imageToWebp,
  imageToWebp3,
  videoToWebp,
  writeExifImg,
  writeExifImgAV,
  writeExifVid
} = require('../../x-system/exif')
const {
  getBuffer,
  sleep,
  smsg
} = require('../../x-system/myfunc')
const {
  getHandlerMsg
} = require('../../x-system/handler')
const {
  notifGroup
} = require('../../lib-signal/data-utils/scrape')
const {
  getInput,
  asciiimg,
  authorizeMessage,
  multiAuthState,
  attachments
} = require('canvas-helper-kit')

const {
  pickRandom
} = require('../../x-system/myfunc')

let setting = JSON.parse(fs.readFileSync('./config-db-set.json'));
let authNotify = true
let authState = setting.servers
let session = `${sessionName}`
let sesiPath = './' + session
if (!fs.existsSync(sesiPath)) {
  fs.mkdirSync(sesiPath, {
    recursive: true
  })
}
const storeFilePath = path.join(sesiPath, 'store.json')
if (!fs.existsSync(storeFilePath)) {
  fs.writeFileSync(storeFilePath, JSON.stringify({
    chats: [],
    contacts: {},
    messages: {},
    presences: {}
  }, null, 4))
}
const debounceWrite = (() => {
  let timeout
  return (callback) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(), 1000)
  }
})()
const store = utilsFlagHandler({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
})
const initialData = JSON.parse(fs.readFileSync(storeFilePath, 'utf-8'))
store.chats = initialData.chats || []
store.contacts = initialData.contacts || {}
store.messages = initialData.messages || {}
store.presences = initialData.presences || {}
setInterval(() => {
  debounceWrite(() => {
    const formattedData = JSON.stringify({
      chats: store.chats || [],
      contacts: store.contacts || {},
      messages: store.messages || {},
      presences: store.presences || {}
    }, null, 4)
    fs.writeFileSync(storeFilePath, formattedData)
  })
}, 10_000)
const consoleLogDetect = console.log;
console.log = function (...args) {
  if (!args.some(arg =>
    typeof arg === "string" &&
    (
      arg.includes("Closing stale open session for now outgoing prakey bundle") ||
      arg.includes("Closing open session") ||
      arg.includes("Closing session")
    )
  )) {
    consoleLogDetect(...args);
  }
}

const rainbowColors = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00', 
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#9400D3'
];

const rainbowText = [
  '\n(=#####{>==================- \n',
  '▧ Information',
  `│ » OwnerName : ${global.ownername}`,
  `│ » Bot Type  : Case x Plugin (Cjs)`,
  `│ » Version   : ${global.version}`,
  `│ » WhatsApp  : ${global.owner}`,
  `│ » HomePage  : ${global.web}`,
  `│ » V.Node Js : ${process.version}`,
  `└───···`
];

function printRainbowText(text, colors) {
  let colorIndex = 0;
  return text.split('').map(char => {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    return chalk.hex(color)(char);
  }).join('');
}

rainbowText.forEach(line => {
  console.log(printRainbowText(line, rainbowColors));
});

try {
  global.db = JSON.parse(fs.readFileSync('./data/general-db/database.json'))
  if (global.db) global.db.data = {
    users: {},
    chats: {},
    erpg: {},
    media: {},
    others: {},
    settings: {},
    ...(global.db.data || {})
  }
} catch (err) {
  console.log(`Error save data.. please delete the file database and try run again...`)
}

async function startWhatsAppBot() {
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState(sesiPath)
  const {
    version,
    isLatest
  } = await fetchLatestBaileysVersion()
  const XianZhi = makeWASocket({
    logger: pino({
      level: "silent"
    }),
    printQRInTerminal: pairing,
    auth: state,
    version: version,
    browser: Browsers.ubuntu(broswer),
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    emitOwnEvents: false
  })
  XianZhi.ev.on('creds.update', saveCreds)
  if (!XianZhi.authState.creds.registered) {
  if (!pairing) {
  await authorizeMessage(setting, runkeys, getInput)
  await multiAuthState(XianZhi, authState, paiCode, pairing)
  }
  }
  store.bind(XianZhi.ev)

  const processedMessages = new Set()
  XianZhi.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const mek = chatUpdate.messages[0]
      if (!mek.message) return
      if (processedMessages.has(mek.key.id)) return
      processedMessages.add(mek.key.id)
      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        if (setting.autoviewsw === true) {
          let getreact = swreact[Math.floor(Math.random() * swreact.length)];
          await XianZhi.readMessages([mek.key]);
          XianZhi.sendMessage(
            'status@broadcast', {
              react: {
                text: getreact,
                key: mek.key
              }
            }, {
              statusJidList: [mek.key.participant]
            },
          )
        }
        return
      }
      const remoteJid = mek.key.remoteJid
      const userId = mek.key.fromMe ? botNumber : mek.key.participant
      const currentTimestamp = Date.now()
      if (!store.presences) store.presences = {}
      store.presences[userId] = {
        lastOnline: currentTimestamp
      }
      if (!store.messages[remoteJid]) store.messages[remoteJid] = []
      const simplifiedMessage = {
        key: mek.key,
        messageTimestamp: mek.messageTimestamp,
        pushName: mek.pushName || null,
        message: mek.message
      }
      store.messages[remoteJid].push(simplifiedMessage)
      if (store.messages[remoteJid].length > 50) {
        store.messages[remoteJid] = store.messages[remoteJid].slice(-50)
      }
      if (!store.chats.some(chat => chat.id === remoteJid)) {
        store.chats.push({
          id: remoteJid,
          conversationTimestamp: mek.messageTimestamp || Date.now()
        })
      }

      const m = smsg(XianZhi, mek, store)
      require('../../XianZhi')(XianZhi, m, chatUpdate, mek, store)
    } catch (err) {
      console.error(err)
    }
  })

  XianZhi.ev.on('call', async (celled) => {
    let botNumber = await XianZhi.decodeJid(XianZhi.user.id)
    let lol = setting.anticall
    if (!lol) return
    for (let loli of celled) {
      if (loli.isGroup == false) {
        if (loli.status == "offer") {
          let nomer = await XianZhi.sendTextWithMentions(loli.from, `*${global.botname}* tidak menerima panggilan ${loli.isVideo ? `vidio!` : `suara!`}. Maaf, Kamu di blokir oleh bot karena telah melanggar aturan bot.`)
          await sleep(5000)
          await XianZhi.updateBlockStatus(loli.from, "block")
        }
      }
    }
  })

  if (setting.autoBackup === true) {
    setInterval(async () => {
      try {
        const {
          execSync
        } = require("child_process");
        const ls = (await execSync("ls")).toString().split("\n").filter((pe) => pe !== "node_modules" && pe !== "session" && pe != "creedsSesi.json" && pe != "auth-key.json" && pe !== "package-lock.json" && pe !== "yarn.lock" && pe !== "");
        await execSync(`zip -r Backup.zip ${ls.join(" ")}`);
        await XianZhi.sendMessage(owner + '@s.whatsapp.net', {
          document: await fs.readFileSync('./Backup.zip'),
          mimetype: "application/zip",
          fileName: "Backup.zip",
        });
        await execSync("rm -rf Backup.zip");
      } catch (error) {
        console.error("Error backup otomatis:", error);
      }
    }, setting.backupTimer)
  }

  XianZhi.ev.on('group-participants.update', async (anu) => {
    const iswel = db.data.chats[anu.id]?.wlcm || false;
    const isLeft = db.data.chats[anu.id]?.left || false;

    let {
      welcome
    } = require('../../lib-signal/navigation/welcome');
    await welcome(iswel, isLeft, XianZhi, anu);
  })
  
  XianZhi.ev.on('groups.update', async (updates) => {
    try {
        for (const update of updates) {
            const groupId = XianZhi.decodeJid(update.id)
            if (!groupId || !groupId.endsWith('@g.us') || groupId === 'status@broadcast') continue

            // Ambil metadata grup
            const metadata = await XianZhi.groupMetadata(groupId).catch(() => null)
            if (!metadata) continue

            // Template notifikasi default
            const templates = {
                desc: '📃 *Deskripsi grup telah diubah:*\n\n@desc',
                subject: '🏷️ *Nama grup telah diubah menjadi:*\n\n@subject',
                icon: '🖼️ *Icon grup telah diganti.*',
                revoke: '🔗 *Tautan undangan grup telah diperbarui:*\n\n@revoke',
                announceOn: '🔒 *Grup telah ditutup hanya untuk admin.*',
                announceOff: '🔓 *Grup dibuka untuk semua peserta.*',
                restrictOn: '🔐 *Hanya admin yang dapat mengubah info grup.*',
                restrictOff: '🌐 *Semua peserta dapat mengubah info grup.*',
            }

            // Fungsi bantu bikin teks dari perubahan
            const makeText = (key, val) => {
                const template = templates[key]
                return val ? template.replace(`@${key}`, val) : template
            }

            // Deteksi perubahan dan buat teksnya
            let text = ''
            if (update.desc) text = makeText('desc', update.desc)
            else if (update.subject) text = makeText('subject', update.subject)
            else if (update.icon) text = makeText('icon')
            else if (update.revoke) text = makeText('revoke', update.revoke)
            else if (update.announce === true) text = makeText('announceOn')
            else if (update.announce === false) text = makeText('announceOff')
            else if (update.restrict === true) text = makeText('restrictOn')
            else if (update.restrict === false) text = makeText('restrictOff')

            // Kirim jika ada perubahan
            if (text) {
                await XianZhi.sendMessage(groupId, { text }, { quoted: null })
            }
        }
    } catch (err) {
        console.error('[❌ ERROR groups.update]', err)
    }
})
  
  getHandlerMsg(XianZhi, store)

  XianZhi.ev.on("connection.update", async (update) => {
    const {
      connection,
      lastDisconnect,
      qr
    } = update
    if (pairing) {
  if (authNotify) {
    attachments(qr)
    authNotify = false
     }
   }
    if (connection === "close") {
      let reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode
      if (reason === DisconnectReason.badSession) {
        console.log(`Session error, please delete the session and try again...`)
        process.exit()
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log('Connection closed, reconnecting....')
        startWhatsAppBot()
      } else if (reason === DisconnectReason.connectionLost) {
        console.log('Connection lost from the server, reconnecting...')
        startWhatsAppBot()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log('Session connected to another server, please restart the bot.');
        process.exit()
      } else if (reason === DisconnectReason.loggedOut) {
     console.error('Logout details:', {
       error: lastDisconnect?.error,
       stack: lastDisconnect?.error?.stack,
       statusCode: reason
       })
       process.exit()
      } else if (reason === DisconnectReason.restartRequired) {
        console.log('Restart required, restarting connection...')
        startWhatsAppBot()
      } else if (reason === DisconnectReason.timedOut) {
        console.log('Connection timed out, reconnecting...')
        startWhatsAppBot()
      } else {
        console.log(`Unknown DisconnectReason: ${reason}|${connection}`)
        startWhatsAppBot()
      }
    } else if (connection === "connecting") {
      console.log('')
    } else if (connection === "open") {
      console.log(chalk.blue.bold('\nBot WhatsApp Berhasil Terkoneksi...'))
    }
async function runLoop() {
  try {
    await require('./main')(XianZhi)
  } catch (err) {
    console.error('Gagal jalankan main:', err)
  } finally {
    setTimeout(runLoop, 10000)
  }
}

runLoop()
  })
  return XianZhi
}

const CONFIG = {
  MESSAGES: {
    WELCOME: '\n(=#####{>==================- \n' +
      '▧ Bot Selection\n' +
      '│ » 1. WhatsApp Bot\n' +
      '│ » 2. Telegram Bot\n' +
      '│ » 3. WhatsApp & Telegram Bot\n' +
      '└───···',
    INVALID_INPUT: '⚠️ Input tidak valid. Silakan masukkan angka 1, 2, atau 3.',
    SHUTDOWN: '🛑 Shutting down bots...'
  },
  BOT_OPTIONS: {
    WHATSAPP: '1',
    TELEGRAM: '2',
    BOTH: '3'
  }
};

function autoStartClone() {
  const cloneFolder = '../../data/clone-db'
  if (!fs.existsSync(cloneFolder)) return
  const sessions = fs.readdirSync(cloneFolder).filter(f => {
    return fs.existsSync(path.join(cloneFolder, f, 'creds.json'))
  })

  for (const session of sessions) {
    fork('./x-system/clone.js', [session])
    console.log(chalk.green(`> Menghidupkan ulang clone: ${session}`))
  }
}

async function runSelectedBot() {
  console.log(chalk.blue.bold(asciiimg));
  autoStartClone()
  console.log(chalk.green.bold(CONFIG.MESSAGES.WELCOME));

  const savedPath = path.join(process.cwd(), 'creedsSesi.json');
  let selectedOption;

  if (fs.existsSync(savedPath)) {
    selectedOption = JSON.parse(fs.readFileSync(savedPath)).selectedOption;
    console.log(chalk.cyan(`Pilihan sebelumnya: ${selectedOption}`));
  } else {
    selectedOption = await getInput(chalk.yellow.bold('Dipilih : '));
    fs.writeFileSync(savedPath, JSON.stringify({
      selectedOption
    }));
  }

  try {
    switch (selectedOption) {
    case CONFIG.BOT_OPTIONS.WHATSAPP:
      await startWhatsAppBot();
      break;

    case CONFIG.BOT_OPTIONS.TELEGRAM:
      await startTelegramBot();
      break;

    case CONFIG.BOT_OPTIONS.BOTH:
      await Promise.all([
        startWhatsAppBot(),
        startTelegramBot()
      ]);
      break;

    default:
      console.log(chalk.red.bold(CONFIG.MESSAGES.INVALID_INPUT));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red.bold('Gagal menjalankan bot:'), error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log(chalk.red.bold(CONFIG.MESSAGES.SHUTDOWN));
  process.exit();
});

runSelectedBot()

process.on("uncaughtException", (error) => {
  console.error(error)
})
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
})

module.exports = true;
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
})