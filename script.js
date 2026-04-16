function minifySimple(code) {
  // コメント削除
  code = code
    .replace(/\/\/.*$/gm, "")          // 行コメント
    .replace(/\/\*[\s\S]*?\*\//g, ""); // ブロックコメント

  // 変数名収集
  const varRegex = /\b(?:let|const|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
  const names = [];
  let m;
  while ((m = varRegex.exec(code)) !== null) {
    if (!names.includes(m[1])) names.push(m[1]);
  }

  // 変数名マッピング a, b, c...
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const map = {};
  names.forEach((name, i) => {
    map[name] = alphabet[i] || ("v" + i); // 26超えたら v26 みたいに
  });

  // 変数名置き換え
  for (const [orig, short] of Object.entries(map)) {
    const re = new RegExp("\\b" + orig + "\\b", "g");
    code = code.replace(re, short);
  }

  // 空白・改行圧縮（かなり雑でOK）
  code = code
    .replace(/\s+/g, " ")   // 連続空白を1つに
    .replace(/\s*([=+\-*/{}();,:<>])\s*/g, "$1") // 演算子周りの空白削除
    .trim();

  return code;
}
