(() => {
  "use strict";
  // 読みが固定の言葉だけにふりがなを付ける（文脈で読みが変わる漢字には付けない）
  const DICT = {
    "世界遺産": "せかいいさん", "国立公園": "こくりつこうえん", "炊き込みご飯": "たきこみごはん",
    "万里の長城": "ばんりのちょうじょう", "熱帯雨林": "ねったいうりん", "間欠泉": "かんけつせん",
    "キャノピーウォーク": "きゃのぴーうぉーく", "旧市街": "きゅうしがい", "港町": "みなとまち",
    "固有種": "こゆうしゅ", "先住民": "せんじゅうみん", "遊牧民": "ゆうぼくみん",
    "保護区": "ほごく", "大聖堂": "だいせいどう", "修道院": "しゅうどういん", "礼拝堂": "れいはいどう",
    "会議場": "かいぎじょう", "競技場": "きょうぎじょう", "本拠地": "ほんきょち",
    "博物館": "はくぶつかん", "図書館": "としょかん", "観覧車": "かんらんしゃ",
    "郷土料理": "きょうどりょうり", "家庭料理": "かていりょうり", "国民食": "こくみんしょく",
    "食文化": "しょくぶんか", "香辛料": "こうしんりょう", "保存食": "ほぞんしょく",
    "戦没者": "せんぼつしゃ", "奴隷貿易": "どれいぼうえき", "貿易": "ぼうえき",
    "色鮮やか": "いろあざやか", "鮮やか": "あざやか", "美しい": "うつくしい",
    "石灰岩": "せっかいがん", "大理石": "だいりせき", "石造り": "いしづくり",
    "富士山": "ふじさん", "姫路城": "ひめじじょう", "茶畑": "ちゃばたけ",
    "世界一": "せかいいち", "最大級": "さいだいきゅう", "有数": "ゆうすう",
    "博物": "はくぶつ", "遺跡": "いせき", "砂漠": "さばく", "寺院": "じいん", "教会": "きょうかい",
    "宮殿": "きゅうでん", "王宮": "おうきゅう", "皇帝": "こうてい", "女王": "じょおう", "国王": "こくおう",
    "王国": "おうこく", "古代": "こだい", "中世": "ちゅうせい", "歴史": "れきし", "文明": "ぶんめい",
    "帝国": "ていこく", "独立": "どくりつ", "自由": "じゆう", "平和": "へいわ", "記念": "きねん",
    "国境": "こっきょう", "沿岸": "えんがん", "中央": "ちゅうおう", "北部": "ほくぶ", "南部": "なんぶ",
    "東部": "とうぶ", "西部": "せいぶ", "地方": "ちほう", "都市": "とし", "最大": "さいだい", "最高": "さいこう",
    "有名": "ゆうめい", "国旗": "こっき", "首都": "しゅと", "大陸": "たいりく", "自然": "しぜん",
    "文化": "ぶんか", "伝統": "でんとう", "象徴": "しょうちょう", "料理": "りょうり", "祭り": "まつり",
    "音楽": "おんがく", "建物": "たてもの", "施設": "しせつ", "広場": "ひろば", "動物": "どうぶつ",
    "漁師": "りょうし", "芸術": "げいじゅつ", "芸能": "げいのう", "舞踊": "ぶよう", "楽器": "がっき",
    "演奏": "えんそう", "装飾": "そうしょく", "壁画": "へきが", "彫刻": "ちょうこく", "模様": "もよう",
    "刺繍": "ししゅう", "織物": "おりもの", "陶器": "とうき", "屋根": "やね", "庭園": "ていえん",
    "噴水": "ふんすい", "劇場": "げきじょう", "国会": "こっかい", "議会": "ぎかい", "聖地": "せいち",
    "神聖": "しんせい", "神話": "しんわ", "仏教": "ぶっきょう", "仏像": "ぶつぞう", "仏塔": "ぶっとう",
    "神殿": "しんでん", "巡礼": "じゅんれい", "祈り": "いのり", "追悼": "ついとう", "産業": "さんぎょう",
    "工芸": "こうげい", "名産": "めいさん", "主食": "しゅしょく", "食事": "しょくじ", "食材": "しょくざい",
    "野菜": "やさい", "果物": "くだもの", "肉汁": "にくじゅう", "朝食": "ちょうしょく", "軽食": "けいしょく",
    "発酵": "はっこう", "黄金": "おうごん", "木造": "もくぞう", "青銅": "せいどう", "金属": "きんぞく",
    "宝石": "ほうせき", "翡翠": "ひすい", "真珠": "しんじゅ", "珊瑚": "さんご", "象牙": "ぞうげ",
    "羊毛": "ようもう", "木綿": "もめん", "氷河": "ひょうが", "火山": "かざん", "渓谷": "けいこく",
    "峡谷": "きょうこく", "断崖": "だんがい", "岩山": "いわやま", "洞窟": "どうくつ", "鉱山": "こうざん",
    "棚田": "たなだ", "温泉": "おんせん", "熱帯": "ねったい", "高山": "こうざん", "大地": "だいち",
    "半島": "はんとう", "海峡": "かいきょう", "地球": "ちきゅう", "酸素": "さんそ", "空気": "くうき",
    "人々": "ひとびと", "家族": "かぞく", "仲間": "なかま", "職人": "しょくにん", "作曲家": "さっきょくか",
    "建築家": "けんちくか", "詩人": "しじん", "作家": "さっか", "童話": "どうわ", "民話": "みんわ",
    "物語": "ものがたり", "伝説": "でんせつ", "英雄": "えいゆう", "戦士": "せんし", "騎士": "きし",
    "民族": "みんぞく", "部族": "ぶぞく", "住民": "じゅうみん", "市民": "しみん", "観客": "かんきゃく",
    "選手": "せんしゅ", "代表": "だいひょう", "競技": "きょうぎ", "試合": "しあい", "相撲": "すもう",
    "競馬": "けいば", "収穫": "しゅうかく", "儀式": "ぎしき", "習慣": "しゅうかん", "風習": "ふうしゅう",
    "文化財": "ぶんかざい", "宝物": "たからもの", "国宝": "こくほう", "標高": "ひょうこう", "全長": "ぜんちょう",
    "人口": "じんこう", "世紀": "せいき", "当時": "とうじ", "現在": "げんざい", "未来": "みらい",
    "全国": "ぜんこく", "国内": "こくない", "海外": "かいがい", "東京": "とうきょう", "茶道": "さどう",
    "寿司": "すし", "桜": "さくら", "象": "ぞう", "馬": "うま", "牛": "うし", "羊": "ひつじ", "豚": "ぶた",
    "鳥": "とり", "魚": "さかな", "鯨": "くじら", "亀": "かめ", "蛇": "へび", "蝶": "ちょう", "花": "はな",
    "梅": "うめ", "松": "まつ", "竹": "たけ", "紅葉": "もみじ", "森": "もり", "林": "はやし", "大木": "たいぼく",
    "種": "たね", "葉": "は", "根": "ね", "幹": "みき", "枝": "えだ", "鶏": "にわとり"
  };
  const WORDS = Object.keys(DICT).sort((a, b) => b.length - a.length);
  const KEY = "wq-furigana";
  let on = localStorage.getItem(KEY) !== "off";

  function rubify(text) {
    let out = null;
    let i = 0;
    let buf = "";
    const flush = () => { if (buf) { (out ||= []).push(document.createTextNode(buf)); buf = ""; } };
    while (i < text.length) {
      let hit = null;
      for (const w of WORDS) {
        if (text.startsWith(w, i)) { hit = w; break; }
      }
      if (hit) {
        flush();
        const ruby = document.createElement("ruby");
        ruby.dataset.furi = "1";
        ruby.appendChild(document.createTextNode(hit));
        const rt = document.createElement("rt");
        rt.textContent = DICT[hit];
        ruby.appendChild(rt);
        (out ||= []).push(ruby);
        i += hit.length;
      } else {
        buf += text[i];
        i++;
      }
    }
    flush();
    return out;
  }

  function apply(root) {
    if (!on || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !/[一-鿿]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p || p.closest("ruby,script,style,rt")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parts = rubify(node.nodeValue);
      if (parts && parts.some(p => p.nodeType !== 3)) {
        const frag = document.createDocumentFragment();
        parts.forEach(p => frag.appendChild(p));
        node.replaceWith(frag);
      }
    }
  }

  function remove(root) {
    root.querySelectorAll("ruby[data-furi]").forEach(r => {
      r.replaceWith(document.createTextNode(r.firstChild ? r.firstChild.nodeValue : ""));
    });
  }

  const app = document.getElementById("app");
  const btn = document.getElementById("furiganaBtn");
  function syncBtn() {
    if (!btn) return;
    btn.innerHTML = "ふりがな <b>" + (on ? "ON" : "OFF") + "</b>";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  if (btn) {
    btn.addEventListener("click", () => {
      on = !on;
      localStorage.setItem(KEY, on ? "on" : "off");
      if (on) apply(app); else remove(app);
      syncBtn();
    });
  }
  syncBtn();
  apply(app);
  let queued = false;
  const obs = new MutationObserver(() => {
    if (!on || queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(app); });
  });
  if (app) obs.observe(app, { childList: true, subtree: true, characterData: true });
})();
