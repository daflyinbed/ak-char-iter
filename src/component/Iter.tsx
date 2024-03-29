import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { concat, indexOf } from "lodash";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Paper from "@material-ui/core/Paper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { DataTable } from "./DataTable";
import { HandbookData, Fix } from "../data/schema";
import "./iter.css";
import data from "../data/output";

import { MultiSelect } from "./MultSelect";
import { Chips } from "./Chips";
import { parseMD } from "../utils/parser";

const TypesMap: Record<string, string> = {
  画师: "painter",
  配音: "dubber",
  性别: "gender",
  战斗经验: "combatExperience",
  出生地: "birthplace",
  出生日: "birthday",
  种族: "race",
  身高: "height",
  感染状态: "infectionStatus",
  物理强度: "physicalStrength",
  战场机动: "battlefieldManeuver",
  生理耐受: "physiologicalTolerance",
  战术规划: "tacticalPlanning",
  战斗技巧: "combatSkills",
  源石技艺适应性: "originiumArtsAssimilation",
  体细胞与源石融合率: "cellOriginiumAssimilation",
  血液源石结晶密度: "bloodOriginiumCrystalDensity",
};
const TypesMap2: Record<string, string> = {
  painter: "画师",
  dubber: "配音",
  gender: "性别",
  combatExperience: "战斗经验",
  birthplace: "出生地",
  birthday: "出生日",
  race: "种族",
  height: "身高",
  infectionStatus: "感染状态",
  physicalStrength: "物理强度",
  battlefieldManeuver: "战场机动",
  physiologicalTolerance: "生理耐受",
  tacticalPlanning: "战术规划",
  combatSkills: "战斗技巧",
  originiumArtsAssimilation: "源石技艺适应性",
  cellOriginiumAssimilation: "体细胞与源石融合率",
  bloodOriginiumCrystalDensity: "血液源石结晶密度",
};
const useStyles = makeStyles({
  root: {
    maxWidth: 800,
  },
  multiSelect: {
    margin: "0 4px",
    flex: "1",
  },
  center: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  chips: {
    flexWrap: "wrap",
  },
  content: {
    width: "calc(100% - 80px)",
  },
  half: {
    maxWidth: "330px",
    minWidth: "300px",
  },
  heightSlider: {
    maxWidth: "700px",
    minWidth: "300px",
    width: "100%",
    marginTop: "8px",
  },
  halfSlider: {
    marginTop: "8px",
  },
});
function calcPossibleTypes(data: HandbookData[]): Record<string, string[]> {
  console.log("calc");
  const result: Record<string, Set<string>> = {
    painter: new Set(),
    dubber: new Set(),
    gender: new Set(),
    combatExperience: new Set(),
    birthplace: new Set(),
    birthday: new Set(),
    race: new Set(),
    physicalStrength: new Set(),
    battlefieldManeuver: new Set(),
    physiologicalTolerance: new Set(),
    tacticalPlanning: new Set(),
    combatSkills: new Set(),
    originiumArtsAssimilation: new Set(),
  };
  function getFixed(data: Fix<string, string> | string): string {
    if (typeof data == "object") {
      return data.fix || "其他";
    }
    return data;
  }
  data.forEach((v) => {
    result.painter.add(v.painter);
    result.dubber.add(v.dubber);
    result.gender.add(v.gender);
    result.combatExperience.add(getFixed(v.combatExperience));
    result.birthplace.add(getFixed(v.birthplace));
    result.birthday.add(getFixed(v.birthday));
    result.race.add(getFixed(v.race));
    result.physicalStrength.add(getFixed(v.physicalStrength));
    result.battlefieldManeuver.add(getFixed(v.battlefieldManeuver));
    result.physiologicalTolerance.add(getFixed(v.physiologicalTolerance));
    result.tacticalPlanning.add(getFixed(v.tacticalPlanning));
    result.combatSkills.add(getFixed(v.combatSkills));
    result.originiumArtsAssimilation.add(getFixed(v.originiumArtsAssimilation));
  });
  const result2: Record<string, string[]> = {
    infectionStatus: ["感染", "未感染", "其他"],
  };
  Object.keys(result).forEach((v) => {
    result2[v] = Array.from(result[v]).filter((v) => v);
  });
  return result2;
}

const possibleTypes = calcPossibleTypes(data as HandbookData[]);
const is = ["未感染", "感染", "其他"];
const isNull = (data: any): boolean =>
  !data && typeof data != "undefined" && data != 0;
const coaStr = (data: any): string => (!isNull(data) ? `${data}%` : "");
const bocdStr = (data: any): string => (!isNull(data) ? `${data}u/L` : "");
const makeStr = (type: string, data: any): string => {
  switch (type) {
    case "infectionStatus":
      return is[data];
    case "cellOriginiumAssimilation":
      return coaStr(data);
    case "bloodOriginiumCrystalDensity":
      return bocdStr(data);
    default:
      return data;
  }
};

export function MyCell(value: any, colID: string): JSX.Element {
  if (typeof value == "object") {
    const v = value.fix;
    return <div>{makeStr(colID, v)}</div>;
  } else {
    const v = value;
    return <div>{makeStr(colID, v)}</div>;
  }
}
export function Iter(): JSX.Element {
  const classes = useStyles();
  const [shownType, setShownType] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [ce, setCE] = useState<string[]>([]);
  const [birthplace, setBirthplace] = useState<string[]>([]);
  const [birthday, setBirthday] = useState<string[]>([]);
  const [race, setRace] = useState<string[]>([]);
  const [infectionStatus, setInfectionStatus] = useState<string[]>([]);
  const [painter, setPainter] = useState<string[]>([]);
  const [dubber, setDubber] = useState<string[]>([]);
  const [ps, setPS] = useState<string[]>([]);
  const [bm, setBM] = useState<string[]>([]);
  const [pt, setPT] = useState<string[]>([]);
  const [tp, setTP] = useState<string[]>([]);
  const [cs, setCS] = useState<string[]>([]);
  const [oa, setOA] = useState<string[]>([]);
  const [coa, setCOA] = useState<number[]>([0, 20]);
  const [bocd, setBOCD] = useState<number[]>([0, 1]);
  const [height, setHeightStatus] = useState<number[]>([130, 200]);

  const handleShownTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setShownType(event.target.value as string[]);
    event.stopPropagation();
  };
  const handleGenderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGender(event.target.value as string[]);
  };
  const handleCEChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCE(event.target.value as string[]);
  };
  const handleBirthplaceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setBirthplace(event.target.value as string[]);
  };
  const handleBirthdayChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setBirthday(event.target.value as string[]);
  };
  const handleRaceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRace(event.target.value as string[]);
  };
  const handleInfectionStatusChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setInfectionStatus(event.target.value as string[]);
  };
  const handlePSChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPS(event.target.value as string[]);
  };
  const handleBMChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBM(event.target.value as string[]);
  };
  const handlePTChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPT(event.target.value as string[]);
  };
  const handleTPChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTP(event.target.value as string[]);
  };
  const handleCSChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCS(event.target.value as string[]);
  };
  const handleOAChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOA(event.target.value as string[]);
  };
  const handleHeightChange = (event: any, newValue: number | number[]) => {
    setHeightStatus(newValue as number[]);
  };
  const handleCOAChange = (event: any, newValue: number | number[]) => {
    setCOA(newValue as number[]);
  };
  const handleBOCDChange = (event: any, newValue: number | number[]) => {
    setBOCD(newValue as number[]);
  };
  const handlePainterChange = (event: any, newValue: string[], reason: any) => {
    setPainter(newValue);
  };
  const handleDubberChange = (event: any, newValue: string[], reason: any) => {
    setDubber(newValue);
  };
  useEffect(() => {
    console.log(data);
    console.log(possibleTypes);
  }, []);
  const columns = concat(
    { id: "_name", name: "干员名" },
    shownType.map((v) => {
      return {
        id: TypesMap[v],
        name: v,
      };
    })
  );
  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          className={classes.center}
          classes={{ content: classes.content }}
        >
          <MultiSelect
            className={classes.multiSelect}
            options={Object.keys(TypesMap)}
            labelID="types-label"
            onChange={handleShownTypeChange}
            selected={shownType}
            labelRender={() => (
              <div>
                显示的属性({shownType.length}/{Object.keys(TypesMap).length})
              </div>
            )}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Chips className={classes.chips} size="medium" arr={shownType} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <div>基础档案筛选</div>
        </AccordionSummary>
        <AccordionDetails className={classes.center}>
          <Autocomplete
            className={classes.multiSelect + " " + classes.half}
            multiple
            options={possibleTypes.painter}
            disableCloseOnSelect
            size="small"
            limitTags={2}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={`画师 (${painter.length}/${possibleTypes.painter.length})`}
              />
            )}
            onChange={handlePainterChange}
          />
          <Autocomplete
            className={classes.multiSelect + " " + classes.half}
            multiple
            options={possibleTypes.dubber}
            disableCloseOnSelect
            size="small"
            limitTags={2}
            onChange={handleDubberChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={`配音 (${dubber.length}/${possibleTypes.dubber.length})`}
              />
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.gender}
            labelID="gender-label"
            onChange={handleGenderChange}
            selected={gender}
            labelRender={() => (
              <div>
                性别({gender.length}/{possibleTypes.gender.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.combatExperience}
            labelID="ce-label"
            onChange={handleCEChange}
            selected={ce}
            labelRender={() => (
              <div>
                战斗经验({ce.length}/{possibleTypes.combatExperience.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.birthplace}
            labelID="birthplace-label"
            onChange={handleBirthplaceChange}
            selected={birthplace}
            labelRender={() => (
              <div>
                出生地({birthplace.length}/{possibleTypes.birthplace.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.race}
            labelID="race-label"
            onChange={handleRaceChange}
            selected={race}
            labelRender={() => (
              <div>
                种族({race.length}/{possibleTypes.race.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.infectionStatus}
            labelID="infectionStatus-label"
            onChange={handleInfectionStatusChange}
            selected={infectionStatus}
            labelRender={() => (
              <div>
                是否感染({infectionStatus.length}/
                {possibleTypes.infectionStatus.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.birthday}
            labelID="birthday-label"
            onChange={handleBirthdayChange}
            selected={birthday}
            labelRender={() => (
              <div>
                出生日({birthday.length}/{possibleTypes.birthday.length})
              </div>
            )}
          />
          <div className={classes.heightSlider}>
            <div>
              身高 ({height[0]}cm - {height[1]}cm)
            </div>
            <Slider
              value={height}
              onChange={handleHeightChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={130}
              max={200}
            />
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <div>综合体检测试、临床诊断分析 筛选</div>
        </AccordionSummary>
        <AccordionDetails className={classes.center}>
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.physicalStrength}
            labelID="physicalStrength-label"
            onChange={handlePSChange}
            selected={ps}
            labelRender={() => (
              <div>
                物理强度({ps.length}/{possibleTypes.physicalStrength.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.battlefieldManeuver}
            labelID="battlefieldManeuver-label"
            onChange={handleBMChange}
            selected={bm}
            labelRender={() => (
              <div>
                战场机动({bm.length}/{possibleTypes.battlefieldManeuver.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.physiologicalTolerance}
            labelID="physiologicalTolerance-label"
            onChange={handlePTChange}
            selected={pt}
            labelRender={() => (
              <div>
                生理耐受({pt.length}/
                {possibleTypes.physiologicalTolerance.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.tacticalPlanning}
            labelID="tacticalPlanning-label"
            onChange={handleTPChange}
            selected={tp}
            labelRender={() => (
              <div>
                战术规划({tp.length}/{possibleTypes.tacticalPlanning.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.combatSkills}
            labelID="combatSkills-label"
            onChange={handleCSChange}
            selected={cs}
            labelRender={() => (
              <div>
                战斗技巧({cs.length}/{possibleTypes.combatSkills.length})
              </div>
            )}
          />
          <MultiSelect
            className={classes.multiSelect + " " + classes.half}
            options={possibleTypes.originiumArtsAssimilation}
            labelID="originiumArtsAssimilation-label"
            onChange={handleOAChange}
            selected={oa}
            labelRender={() => (
              <div>
                源石技艺适应性({oa.length}/
                {possibleTypes.originiumArtsAssimilation.length})
              </div>
            )}
          />
          <div className={`${classes.half} ${classes.halfSlider}`}>
            <div>
              体细胞与源石融合率 ({coa[0]}% - {coa[1]}%)
            </div>
            <Slider
              value={coa}
              onChange={handleCOAChange}
              valueLabelDisplay="auto"
              aria-labelledby="coa-slider"
              min={0}
              max={20}
              step={0.2}
            />
          </div>
          <div className={`${classes.half} ${classes.halfSlider}`}>
            <div>
              血液源石结晶密度 ({bocd[0]}u/L - {bocd[1]}u/L)
            </div>
            <Slider
              value={bocd}
              onChange={handleBOCDChange}
              valueLabelDisplay="auto"
              aria-labelledby="bocd-slider"
              step={0.01}
              min={0}
              max={1}
            />
          </div>
        </AccordionDetails>
      </Accordion>
      <Paper>
        <DataTable
          data={data as HandbookData[]}
          columns={columns}
          filter={{
            painter: { data: painter, filter: "include" },
            dubber: { data: dubber, filter: "include" },
            gender: { data: gender, filter: "include" },
            combatExperience: { data: ce, filter: "include" },
            birthplace: { data: birthplace, filter: "include" },
            birthday: { data: birthday, filter: "include" },
            race: { data: race, filter: "include" },
            height: { data: height, filter: "between" },
            infectionStatus: {
              data: infectionStatus.map((v) => is.indexOf(v)),
              filter: "include",
            },
            physicalStrength: { data: ps, filter: "include" },
            battlefieldManeuver: { data: bm, filter: "include" },
            physiologicalTolerance: { data: pt, filter: "include" },
            tacticalPlanning: { data: tp, filter: "include" },
            combatSkills: { data: cs, filter: "include" },
            originiumArtsAssimilation: { data: oa, filter: "include" },
            cellOriginiumAssimilation: { data: coa, filter: "between" },
            bloodOriginiumCrystalDensity: { data: bocd, filter: "between" },
          }}
          compareFunc={compare}
          render={MyCell}
        ></DataTable>
      </Paper>
    </div>
  );
}
const textOrder = ["缺陷", "普通", "标准", "优良", "卓越", "■■"];

function compare(a: any, b: any, id: string): number {
  const num = [
    "height",
    "cellOriginiumAssimilation",
    "bloodOriginiumCrystalDensity",
    "infectionStatus",
  ];
  const text = [
    "combatExperience",
    "physicalStrength",
    "battlefieldManeuver",
    "physiologicalTolerance",
    "tacticalPlanning",
    "combatSkills",
    "originiumArtsAssimilation",
  ];
  let type = "string";
  if (num.indexOf(id) != -1) {
    type = "number";
  } else if (text.indexOf(id) != -1) {
    type = "text";
  } else if (id == "birthday") {
    type = "date";
  }
  switch (type) {
    case "number":
      return a - b;
    case "string":
      return (a as string).localeCompare(b);
    case "text":
      return textOrder.indexOf(a) - textOrder.indexOf(b);
    case "date":
      const [am, ad] = parseMD(a);
      const [bm, bd] = parseMD(b);
      const [deltaM, deltaD] = [am - bm, ad - bd];
      if (deltaM == 0) {
        return deltaD;
      } else {
        return deltaM;
      }
    default:
      return (a as string).localeCompare(b);
  }
}
