import * as fs from "fs";
import { HandbookData, InfectionStatus } from "../src/data/schema";
const handbook = JSON.parse(
  fs.readFileSync(
    "E:\\ak\\ArknightsUnpacker\\Gamedata\\gamedata\\excel\\handbook_info_table.json",
    { encoding: "utf-8" }
  )
);
const table = JSON.parse(
  fs.readFileSync(
    "E:\\ak\\ArknightsUnpacker\\Gamedata\\gamedata\\excel\\character_table.json",
    { encoding: "utf-8" }
  )
);
const ID_NAME_MAP = Object.keys(table).reduce((pre, cur) => {
  pre[cur] = table[cur].name;
  return pre;
}, <Record<string, string>>{});
const result = analyse(handbook.handbookDict);
fs.writeFileSync(
  "E:\\gitee\\ak-char-iter\\output.json",
  JSON.stringify(result)
);
function analyse(handbookData: any[]): HandbookData[] {
  return Object.keys(handbookData).map((v) => {
    const o = handbook.handbookDict[v];
    const storyTextAudio = o.storyTextAudio;
    const result: HandbookData | Record<string, any> = {};
    result.painter = o.drawName;
    result.dubber = o.infoName;
    result._name = ID_NAME_MAP[o.charID];
    result._id = o.charID;
    for (let i = 0; i < storyTextAudio.length; i++) {
      if (storyTextAudio[i].storyTitle == "基础档案") {
        const temp = /【性别】(.*?)\n【战斗经验】(.*?)\n【出身地】(.*?)\n【生日】(.*?)\n【种族】(.*?)\n【身高】(.*?)\n/m.exec(
          storyTextAudio[i].stories[0].storyText
        );
        if (temp?.length == 7) {
          result.gender = temp[1].trim();
          result.combatExperience = temp[2].trim();
          result.birthplace = temp[3].trim();
          result.birthday = temp[4].trim();
          result.race = temp[5].trim();
          result.height = parseInt(temp[6].trim()) || null;
        } else {
          console.warn(
            `基础档案 not match ${ID_NAME_MAP[o.charID]}\n${
              storyTextAudio[i].stories[0].storyText
            }`
          );
          result.gender = null;
          result.combatExperience = null;
          result.birthplace = null;
          result.birthday = null;
          result.race = null;
          result.height = null;
        }
        if (/非感染者/.test(storyTextAudio[i].stories[0].storyText)) {
          result.infectionStatus = InfectionStatus.noInfected;
        } else if (/感染者/.test(storyTextAudio[i].stories[0].storyText)) {
          result.infectionStatus = InfectionStatus.infected;
        } else {
          console.log(
            `InfectionStatus unknown \n ${storyTextAudio[i].stories[0].storyText}\n`
          );
          result.infectionStatus = InfectionStatus.unknown;
        }
      }
      if (storyTextAudio[i].storyTitle == "综合体检测试") {
        const temp = /【物理强度】(.*?)\n【战场机动】(.*?)\n【生理耐受】(.*?)\n【战术规划】(.*?)\n【战斗技巧】(.*?)\n【源石技艺适应性】(.*)/m.exec(
          storyTextAudio[i].stories[0].storyText
        );
        if (temp?.length == 7) {
          result.physicalStrength = temp[1].trim();
          result.battlefieldManeuver = temp[2].trim();
          result.physiologicalTolerance = temp[3].trim();
          result.tacticalPlanning = temp[4].trim();
          result.combatSkills = temp[5].trim();
          result.originiumArtsAssimilation = temp[6].trim();
        } else {
          console.warn(
            `综合体检测试 not match ${ID_NAME_MAP[o.charID]}\n${
              storyTextAudio[i].stories[0].storyText
            }`
          );
          result.physicalStrength = null;
          result.battlefieldManeuver = null;
          result.physiologicalTolerance = null;
          result.tacticalPlanning = null;
          result.combatSkills = null;
          result.originiumArtsAssimilation = null;
        }
      }
      if (storyTextAudio[i].storyTitle == "临床诊断分析") {
        const temp1 = /【?体细胞与源石融合率】?：?(.*?)%/m.exec(
          storyTextAudio[i].stories[0].storyText
        );
        if (temp1?.length == 2) {
          result.cellOriginiumAssimilation = parseFloat(temp1[1].trim());
        } else {
          console.warn(
            `体细胞与源石融合率 not match ${ID_NAME_MAP[o.charID]}\n${
              storyTextAudio[i].stories[0].storyText
            }`
          );
          result.cellOriginiumAssimilation = null;
        }
        const temp2 = /【?血液内?中?源石结?晶?密度】?：?(.*?)u\/L/m.exec(
          storyTextAudio[i].stories[0].storyText
        );
        if (temp2?.length == 2) {
          result.bloodOriginiumCrystalDensity = parseFloat(temp2[1].trim());
        } else {
          console.warn(
            `血液源石结晶密度 not match ${ID_NAME_MAP[o.charID]}\n${
              storyTextAudio[i].stories[0].storyText
            }`
          );
          result.bloodOriginiumCrystalDensity = null;
        }
      }
    }
    return <HandbookData>result;
  });
}
