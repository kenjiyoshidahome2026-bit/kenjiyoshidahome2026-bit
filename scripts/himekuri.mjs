// 今日の日めくりを himekuri/YYYY-MM-DD.svg に焼く（GitHub Actions が毎朝 0 時 JST に走らせる）。
// 「今日」は日本時で数える＝ TZ=Asia/Tokyo で走らせる（himekuri の「今日／n日前」も端末の時計で数えるため）。
import { writeFileSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { 日カレンダー } from "himekuri";

const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" })
	.format(new Date()).split("-").map(Number);

const svg = 日カレンダー([y, m, d])
	.trim()
	// <img> で貼るので大きさを持たせる（viewBox だけだと幅 0 に潰れる閲覧環境がある）
	.replace("<svg ", `<svg width="400" height="400" `);

// ファイル名に日付を入れる（同じ名前のままだと GitHub とブラウザが前の日の絵を出し続ける）。前の日の絵は消す
const ymd = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const file = `himekuri/${ymd}.svg`;
mkdirSync("himekuri", { recursive: true });
for (const f of readdirSync("himekuri")) if (f.endsWith(".svg") && `himekuri/${f}` !== file) rmSync(`himekuri/${f}`);
writeFileSync(file, svg + "\n");
const readme = readFileSync("README.md", "utf8");
writeFileSync("README.md", readme.replace(/src="himekuri\/[^"]+\.svg[^"]*"/, `src="${file}"`));
console.log(`${file} ← ${y}-${m}-${d}`);
