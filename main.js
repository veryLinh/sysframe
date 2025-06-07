const fs = require('fs');
const fetch = require('node-fetch');
const path = './config-db-set.json';
let ceklist = true

const keysSetting = [
  "public", "propbio", "cityown", "autoaigc", "autoaipc", "autobio", "onlyRegister",
  "anticall", "autoblok212", "autoread", "autotyping", "autorecording", "autorespond",
  "autosholat", "autoviewsw", "autoBackup", "autostiker", "gconly", "pconly",
  "onlygcjoin", "grupaddSet", "tipewelcome", "multiprefix", "noprefix", "prefixset",
  "similarity", "antispams", "spamsCount", "warnCount", "toxicCount", "Antilink2Count",
  "rpgsetStats", "gamewaktu", "autolimit", "GlimitCount", "limitCount", "saldoCount",
  "tipemenu", "tipemenuall", "servers", "timesgetown", "backupTimer", "javascriptt",
  "pythonn", "cc", "csss", "nodejss", "reactt"
];

const keysGlobal = [
  "pairing", "paiCode", "broswer", "runkeys", "sessionName", "storename", "botname",
  "ownername", "owner", "botNumber", "version", "packname", "author", "web", "wm",
  "wmbotfo", "chjid", "gcjid", "sch", "sgc", "stg", "syt", "sig", "thumb", "thumb2",
  "audiofetch", "reactload"
];

function loadLocalSettings() {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function syncFromAPI(XianZhi, userName) {
  try {
    const res = await fetch(`https://api.verylinh.my.id/users?name=${userName}`);
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);

    const remote = await res.json();
    let setting = JSON.parse(fs.readFileSync('./config-db-set.json'))
fs.watchFile('./config-db-set.json', () => {
  try {
    setting = JSON.parse(fs.readFileSync('./config-db-set.json'))
  } catch (e) {
    console.error('[SETTING] Gagal reload:', e)
  }
})

    for (const key of keysSetting) {
      if (remote[key] !== undefined) {
        setting[key] = remote[key];
        fs.writeFileSync(path, JSON.stringify(setting, null, 2));
      }
    }

    await updateGlobals(remote);
    return remote;
  } catch (err) {
    console.error('Gagal sync dari API:', err);
    return null;
  }
}

function updateGlobals(remote) {
  for (const key of keysGlobal) {
    if (remote[key] !== undefined) global[key] = remote[key];
  }

  if (global.botsewa) {
    Object.assign(global.botsewa, {
      day5: remote.day5 ?? global.botsewa.day5,
      day10: remote.day10 ?? global.botsewa.day10,
      day15: remote.day15 ?? global.botsewa.day15,
      day30: remote.day30 ?? global.botsewa.day30,
      dayunli: remote.dayunli ?? global.botsewa.dayunli,
    });
  }

  if (remote.XianZhii) global.XianZhii = remote.XianZhii;
}

async function pushToAPI(XianZhi, userName) {
  let setting = JSON.parse(fs.readFileSync('./config-db-set.json'))
fs.watchFile('./config-db-set.json', () => {
  try {
    setting = JSON.parse(fs.readFileSync('./config-db-set.json'))
  } catch (e) {
    console.error('[SETTING] Gagal reload:', e)
  }
})

  const payload = {
  active: true,
  propbio: setting.propbio,
  cityown: setting.cityown,
  public: setting.public,
  autoaigc: setting.autoaigc,
  autoaipc: setting.autoaipc,
  autobio: setting.autobio,
  onlyRegister: setting.onlyRegister,
  anticall: setting.anticall,
  autoblok212: setting.autoblok212,
  autoread: setting.autoread,
  autotyping: setting.autotyping,
  autorecording: setting.autorecording,
  autosholat: setting.autosholat,
  autoviewsw: setting.autoviewsw,
  autoBackup: setting.autoBackup,
  autostiker: setting.autostiker,
  gconly: setting.gconly,
  pconly: setting.pconly,
  onlygcjoin: setting.onlygcjoin,
  grupaddSet: setting.grupaddSet,
  tipewelcome: setting.tipewelcome,
  multiprefix: setting.multiprefix,
  noprefix: setting.noprefix,
  prefixset: setting.prefixset,
  similarity: setting.similarity,
  antispams: setting.antispams,
  setdone: setting.setdone,
  setproses: setting.setproses,
  spamsCount: setting.spamsCount,
  warnCount: setting.warnCount,
  toxicCount: setting.toxicCount,
  Antilink2Count: setting.Antilink2Count,
  rpgsetStats: setting.rpgsetStats,
  gamewaktu: setting.gamewaktu,
  autolimit: setting.autolimit,
  GlimitCount: setting.GlimitCount,
  limitCount: setting.limitCount,
  saldoCount: setting.saldoCount,
  tipemenu: setting.tipemenu,
  tipemenuall: setting.tipemenuall,
  servers: setting.servers,
  timesgetown: setting.timesgetown,
  backupTimer: setting.backupTimer,
  javascriptt: setting.javascriptt,
  pythonn: setting.pythonn,
  cc: setting.cc,
  csss: setting.csss,
  nodejss: setting.nodejss,
  reactt: setting.reactt,
  pairing: global.pairing,
  paiCode: global.paiCode,
  broswer: global.broswer,
  runkeys: global.runkeys,
  sessionName: global.sessionName,
  storename: global.storename,
  botname: global.botname,
  ownername: global.ownername,
  owner: global.owner,
  botNumber: global.botNumber,
  version: global.version,
  packname: global.packname,
  author: global.author,
  web: global.web,
  wm: global.wm,
  wmbotfo: global.wmbotfo,
  chjid: global.chjid,
  gcjid: global.gcjid,
  sch: global.sch,
  sgc: global.sgc,
  stg: global.stg,
  syt: global.syt,
  sig: global.sig,
  thumb: global.thumb,
  thumb2: global.thumb2,
  audiofetch: global.audiofetch,
  reactload: global.reactload,
  day5: global.botsewa.day5,
  day10: global.botsewa.day10,
  day15: global.botsewa.day15,
  day30: global.botsewa.day30,
  dayunli: global.botsewa.dayunli
  };

  try {
    const res = await fetch(`https://api.verylinh.my.id/users?name=${userName}`);
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);
    const existing = await res.json();
    const postRes = await fetch(`https://api.verylinh.my.id/users?name=${userName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!postRes.ok) throw new Error('Push failed: ' + postRes.status);
  } catch (err) {
    console.error('Push gagal:', err.message);
  }
}

async function updateSettingBot(XianZhi, key, value, userName) {
  let setting = loadLocalSettings();
  if (setting[key] === value) return;

  setting[key] = value;
  setting.updatedAt = Date.now();
  if (global.hasOwnProperty(key)) global[key] = value;

  fs.writeFileSync(path, JSON.stringify(setting, null, 2));
  await pushToAPI(XianZhi, userName);
}

async function updateFetch(XianZhi) {
  const { crocessKills } = require('canvas-helper-kit');
  const botNumber = await XianZhi.decodeJid(XianZhi.user.id).replace(/[^0-9]/g, '');
  const userName = await crocessKills(botNumber);

  await pushToAPI(XianZhi, userName);
}

module.exports = async function (XianZhi) {
  try {
    let setting = {};
    try {
      setting = JSON.parse(fs.readFileSync('./config-db-set.json'));
    } catch (e) {
      console.error('[SETTING] Gagal load awal:', e);
    }

    fs.watchFile('./config-db-set.json', () => {
      try {
        setting = JSON.parse(fs.readFileSync('./config-db-set.json'));
      } catch (e) {
        console.error('[SETTING] Gagal reload:', e);
      }
    });
    if (setting.autowebset) {
    const { crocessKills } = require('canvas-helper-kit');
    const botNumber = await XianZhi.decodeJid(XianZhi.user.id).replace(/[^0-9]/g, '');
    const userName = await crocessKills(botNumber);

    if (!userName) {
      return console.log(`Username tidak ditemukan dari ${botNumber}`);
    }

      await syncFromAPI(XianZhi, userName);
    }
  } catch (err) {
    console.error('Terjadi error saat sinkronisasi:', err);
  }
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update file: ${__filename}`);
  delete require.cache[file];
  require(file);
});