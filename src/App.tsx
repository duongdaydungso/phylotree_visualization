import React, { useState } from "react";

import {
  PhyloVizWrapper,
  PhylotreeVisualization,
  exportImage,
} from "./components";

import "./App.css";
import { PhyloVizComponent } from "./components/phyloviz_component/phyloviz_component";

//   const newick =
//     "(LngfishAu:0.1712920518,(LngfishSA:0.1886950015,LngfishAf:0.1650939272):0.1074934723,(Frog:0.2567782559,((((Turtle:0.2218655584,(Crocodile:0.3063185169,Bird:0.2314909181):0.0651737381):0.0365470299,Sphenodon:0.3453327943):0.0204990607,Lizard:0.3867277545):0.0740995375,(((Human:0.1853482056,(Seal:0.0945218205,(Cow:0.0823893414,Whale:0.1013456886):0.0404741864):0.0252648881):0.0341157851,(Mouse:0.0584468890,Rat:0.0906222037):0.1219452651):0.0608099176,(Platypus:0.1922418336,Opossum:0.1511451490):0.0373121980):0.1493323365):0.1276903176):0.0942232386);";
const newick =
  "(LngfishAu:0.1719701100,(LngfishSA:0.1886808867,LngfishAf:0.1644491074)100/100/1/100:0.1087920616,(Frog:0.2578038925,((((Turtle:0.2233271857,(Crocodile:0.3082539507,Bird:0.2315153950)97.5/96.7/1/97:0.0653098323)83.1/76.8/0.993/67:0.0358359250,Sphenodon:0.3469967273)41.2/53.5/0.552/50:0.0198995128,Lizard:0.3865087507)98.8/98.8/1/99:0.0751759947,(((Human:0.1855732387,(Seal:0.0948685218,(Cow:0.0818779989,Whale:0.1016071305)99.6/99.2/1/99:0.0405693917)71.1/70.3/0.983/68:0.0246111268)91.7/89/1/87:0.0334775846,(Mouse:0.0587317507,Rat:0.0906720496)100/100/1/100:0.1233749965)99.4/99.5/1/99:0.0604351787,(Platypus:0.1912926848,Opossum:0.1516743301)95/95.9/1/99:0.0379715595)100/100/1/100:0.1491564171)100/100/1/100:0.1294184984)99.8/100/1/100:0.0950509487);";

//   const newick =
//     "(s1001:0.0000020763,((((((((((((((((((((s1002:0.9877636908,(s1064:0.0000025377,(s1104:1.0383422557,s1143:0.5664016789):0.8537553704):1.2427312954):0.2975281582,((((((((((((((((((((((s1005:0.0000023902,s1125:1.5069173240):1.0765029280,(s1159:0.0000023665,(s1174:0.8560425379,s1176:1.1375434873):1.2541154703):0.4515571073):0.0115798897,s1048:1.1099320174):1.4414688628,s1054:2.1276805985):0.0984253585,s1084:0.0000027552):0.6241208292,s1163:0.8096715694):0.4382621479,s1119:0.5184934066):0.2833831689,s1060:0.8640863180):0.0000023631,s1194:1.3777686005):0.3711204771,s1095:1.1873743323):0.0000025744,s1152:0.8286244409):0.8530279316,s1158:0.0000025715):1.0414872095,s1131:0.6417150319):0.0011437829,s1010:0.9471084812):1.3301829369,s1106:0.0000020861):2.4702852507,(s1013:0.0000027619,(s1029:0.1448071781,(s1127:1.9510664754,s1187:0.0000027173):1.4042104116):1.6354954033):0.0000021231):0.7140265703,s1165:1.0983575252):0.3602639385,s1027:0.7331086022):0.2152127379,(s1069:1.0045650650,s1145:0.7779056600):0.5914576859):0.7241023116,s1067:1.1231604990):0.0000022670,s1070:0.0000020409):0.1821303617,(s1039:1.6373722781,s1180:0.0000020566):1.3312476324):0.9637779924):0.4667872337,s1135:0.0000020238):1.6548603919,s1162:0.0667723012):1.2828621833,(s1101:0.1669561673,s1198:1.3308271637):0.3173884603):0.6846836887,(((((((((((s1009:0.4871323920,s1190:1.3981898925):0.0000027910,((s1044:1.6965096449,s1138:0.0000028761):1.0771886981,s1173:0.9756822827):0.3816477883):1.2105279793,(((((((s1020:1.1107242034,s1041:0.5558930128):0.0701223510,s1110:1.1814083051):0.3865416931,s1073:0.4412062760):0.0000025164,((s1042:0.9454722404,s1075:0.4908624367):0.0000022033,s1185:0.9784204507):0.9454492985):0.4616001979,s1058:0.5496892348):0.4418344648,s1150:0.6670089903):0.5351478097,(s1148:0.0000026635,(s1179:1.0465254119,s1195:1.9931089777):0.6287293205):1.2245594680):0.5114646972):0.0000022693,s1192:0.0000024700):2.2337363425,(s1012:1.2712544360,s1049:0.1872512372):0.5261178678):0.0000021088,s1133:2.0296507766):0.0000028047,(s1031:0.8614192814,((s1091:0.3283620342,(s1093:1.5201774316,s1100:0.2386814464):1.2042716672):0.6950014118,s1178:0.7014114415):0.1156157104):0.2537139061):0.0000024617,(s1094:1.1546811611,s1103:0.8628050808):0.1763938668):0.4508377244,s1189:0.4091666817):0.3216133927,(((s1046:1.7174716807,((((s1051:0.4471987780,(s1053:1.4234981346,s1126:0.7152300195):0.1255031308):1.1085528237,(s1086:1.4508639199,s1161:0.0000028100):1.5723359179):0.3104104283,s1089:0.0000020973):1.2003378207,s1144:1.4379830153):0.2398093657):0.0927819495,s1074:0.0000022093):0.0000027595,s1167:2.8664108169):0.8070410372):0.2003794556,((s1021:1.0582525598,s1136:0.7679685534):0.0863201174,(((((((s1022:0.1283858524,s1092:1.1204609890):0.6288018822,((((s1030:0.9661971159,s1076:1.4450116359):0.4521875681,s1037:0.0390057171):1.8453154804,s1170:0.0000026737):0.4849322216,s1056:1.0067040824):0.3076508706):0.0634567463,s1183:0.9388135949):0.3760653540,s1109:1.2072013159):0.3538067805,s1062:0.6074772775):0.4124189698,s1200:0.3263627768):1.5131227556,s1108:0.0000029252):0.7256353743):0.2985933313):0.2054234012):0.1712556998,(s1066:1.4981098777,s1175:0.0000028666):0.5088924283):0.7251275349,((((((((((((((((((s1003:0.0027676337,(s1008:0.0000022749,s1038:1.5429872791):2.1181820941):0.3846406716,(((((((s1032:0.8897885635,(s1078:0.7365817190,(s1080:1.1885817451,s1088:0.9982702409):0.0000027623):0.4864664362):0.3109849904,s1129:0.5365571337):0.2148467488,s1057:0.9333834225):0.2195397045,s1139:0.4896824804):0.6711996748,s1149:1.2187928341):0.4956234512,s1045:0.2988860149):0.4034457709,(s1115:0.0000021843,((s1120:0.0000022362,(((s1134:0.2380681205,s1142:1.2647617487):0.9247005665,s1137:1.3101493050):0.2100059215,s1154:0.4835078838):1.1344825698):0.8028000675,s1128:1.0531293214):1.0970106337):1.2348957036):0.8602898851):0.3507050937,(((((s1014:0.8574472079,((s1023:1.9048882709,s1028:0.0000025823):0.9390616817,s1055:0.5314840550):0.0992073506):0.0693257046,(s1083:1.4657686355,s1151:0.0823021755):0.7940107819):1.4372473021,s1193:0.0312356064):1.6630608663,s1082:0.2375473708):0.6273005462,(s1071:1.0752272580,s1164:0.5596511908):0.0000029904):0.8029011578):0.2736410450,(s1011:0.3702059539,((s1033:0.8623425642,s1147:1.0075845419):0.9167593990,s1098:0.3075071929):0.6333312042):0.4343162026):0.3399375053,((s1035:0.7029183396,s1155:1.8497859434):0.4381397453,s1036:0.4533299234):0.2716782320):0.8959216873,((s1063:1.3186444523,(s1077:0.6922370467,s1160:0.8646565104):0.5143329303):0.3764743552,s1157:0.0000029805):0.1696018174):0.6860076889,(((((s1007:0.9826559499,(s1085:1.8633636135,s1140:0.0000028040):0.6702586584):0.5940896256,(((s1025:1.4258786892,s1191:0.7104171487):0.2014609527,s1132:1.4318697886):0.3691381881,s1118:0.6205982473):0.3888100637):0.6111656412,s1172:0.4374040623):0.3447200693,s1040:1.0721305564):0.3359174990,(s1059:1.9123373637,s1114:0.2378990864):0.0000026297):0.4305909027):0.2101242355,(((s1107:0.8216515601,s1112:0.6683609778):0.2791419786,s1146:0.5846859227):1.7283815559,s1168:0.0000028905):1.0893225734):0.8823924439,s1079:0.0000020480):1.2631773203,s1121:0.7086398998):0.0000021653,s1141:0.9064988926):0.5153264124,((s1043:1.5228216166,s1184:1.3565464872):0.0000022019,s1181:0.0000025783):0.2979602198):0.2012539637,s1102:1.1742037101):0.2738957588,(s1004:0.0000021555,((((s1017:0.4858450984,(s1124:1.8899964509,s1188:0.8081611275):0.1648279110):0.4754206330,s1117:0.6714787820):0.9808589151,s1153:0.0969654193):1.1530378995,s1182:0.6658770455):1.1828961802):0.8712439568):0.2619086274,s1061:1.0044557049):0.8271008617,s1065:0.0000027651):0.6806435642,s1171:1.1004420121):0.4495733867,s1026:0.6986759499):0.3919353872):0.2027291587,(((((s1024:0.0000020957,s1050:1.8546456456):0.9047884182,s1169:0.8440753341):0.2296251055,s1130:1.4393454426):0.1895146630,s1072:0.5195270370):0.9953364728,s1113:0.0000022177):0.9664990197):0.5047526280,s1111:0.0000022316):1.4275672524,s1019:1.0689015497):0.8999318218,s1197:0.0000020582):0.0321905379,s1047:1.6943412866):1.1986237711,(s1018:1.3154403534,((((((s1052:0.1751719696,s1186:1.7866353294):0.6222680338,(s1123:0.8698455025,s1196:0.9096581130):0.0000027048):0.0000025972,(s1081:0.1357690531,(s1097:0.0000024431,s1199:1.9124549139):1.6062333063):1.3291123729):0.7502985748,((s1096:1.1114344346,s1156:0.1009281693):0.8565864967,s1116:0.5882602818):0.2002318458):0.1386970569,s1068:0.5322894820):0.0000028818,s1177:1.2082049928):0.5128910328):0.2242691300):0.2326243582,s1122:0.1725352996):0.7592655231,s1015:0.7476825781):1.2402342309,s1087:0.0000024950):0.2833784943,(s1034:1.2664828096,s1166:0.6961284732):0.5539158881):0.6753831351,s1105:0.3991983512):1.0966187949,((s1006:0.5219737338,s1099:1.1947939704):0.8409146416,s1090:0.0000020559):0.1085737045):1.4515751375,s1016:1.4720890846)";

//   const newick = "(A:1,(B:1,C:1):1,(D:1,(E:1,F:1):1):1);";

export interface IAppProps {}

function showToolTip(tooltipData: any) {
  const { x, y, node, metadata } = tooltipData;

  if (!node && !metadata) return null;

  return (
    <div
      className="tooltip-container"
      style={{
        left: x + 20,
        top: y - 20,
      }}
    >
      {node && <div className="tooltip-title">{node.data.name}</div>}
      {metadata && (
        <div className="tooltip-content">
          <div>Color: {metadata.color}</div>
          <div>Shape: {metadata.shape}</div>
          <div>Size: {metadata.size}</div>
          <div>Label: {metadata.label}</div>
        </div>
      )}
    </div>
  );
}

export const App: React.FunctionComponent<IAppProps> = (props) => {
  const metadata: Array<Object> = [];

  // Extract species names from newick
  const species = newick
    .match(/\w+(?=:)/g)
    // .match(/s\d+/g)
    ?.filter((name, index, self) => self.indexOf(name) === index);

  // Create metadata for each species
  if (species) {
    species.forEach((name) => {
      metadata.push({
        name,
        color: name.length % 2 == 0 ? "green" : "yellow",
        shape: "square",
        size: 8,
        label: name,
        supportValue: {
          spvlA: 0.3,
          spvlB: 0.4,
          spvlC: 0.5,
          spvlD: 0.6,
        },
      });
    });
  }

  const [sort, setSort] = useState<string>();
  const [alignTips, setAlignTips] = useState<string>("left");
  const [isShowInternalNode, setIsShowInternalNode] = useState<boolean>(false);
  const [isShowScale, setIsShowScale] = useState<boolean>(false);
  const [isShowLabel, setIsShowLabel] = useState<boolean>(true);
  const [isShowBranchLength, setIsShowBranchLength] = useState<boolean>(false);
  const [searchingFilter, setSearchingFilter] = useState<
    Array<{ key: string; value: string }>
  >([{ key: "name", value: "" }]);
  const [isExportNewick, setIsExportNewick] = useState<boolean>(false);
  const [reloadState, setReloadState] = useState<boolean>(false);

  return (
    <div>
      <div className="button-group">
        <button
          type="button"
          onClick={() => {
            setReloadState(true);
          }}
        >
          Reload
        </button>
        <button
          type="button"
          onClick={() => {
            setSort("ascending");
          }}
        >
          Sort ascending
        </button>
        <button
          type="button"
          onClick={() => {
            setSort("descending");
          }}
        >
          Sort descending
        </button>
        <button
          type="button"
          onClick={() => {
            setAlignTips("left");
          }}
        >
          Align tips left
        </button>
        <button
          type="button"
          onClick={() => {
            setAlignTips("right");
          }}
        >
          Align tips right
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowInternalNode(!isShowInternalNode);
          }}
        >
          {isShowInternalNode ? "Hide internal node" : "Show internal node"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowLabel(!isShowLabel);
          }}
        >
          {isShowLabel ? "Hide label" : "Show label"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowScale(!isShowScale);
          }}
        >
          {isShowScale ? "Hide scale" : "Show scale"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShowBranchLength(!isShowBranchLength);
          }}
        >
          {isShowBranchLength ? "Hide branch length" : "Show branch length"}
        </button>
        <button
          type="button"
          onClick={() => {
            exportImage();
          }}
        >
          Export image
        </button>
        <button
          type="button"
          onClick={() => {
            setIsExportNewick(true);
          }}
        >
          Export newick
        </button>
        <form onSubmit={(event) => event.preventDefault()}>
          {searchingFilter.map((filter, index) => (
            <div key={index}>
              {index > 0 ? (
                <input
                  type="text"
                  placeholder="Key"
                  value={filter.key}
                  onChange={(event) => {
                    const newFilter = [...searchingFilter];
                    newFilter[index].key = event.target.value;
                    setSearchingFilter(newFilter);
                  }}
                />
              ) : (
                <div>Name</div>
              )}
              <input
                type="text"
                placeholder="Value"
                value={filter.value}
                onChange={(event) => {
                  const newFilter = [...searchingFilter];
                  newFilter[index].value = event.target.value;
                  setSearchingFilter(newFilter);
                }}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const newFilter = [...searchingFilter];
                    newFilter.splice(index, 1);
                    setSearchingFilter(newFilter);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setSearchingFilter([...searchingFilter, { key: "", value: "" }]);
            }}
          >
            Add filter
          </button>
        </form>
      </div>
      <PhylotreeVisualization
        input={newick}
        metadata={metadata}
        supportValueInput
        sort={sort}
        alignTips={alignTips}
        isShowInternalNode={isShowInternalNode}
        isShowScale={isShowScale}
        isShowLabel={isShowLabel}
        isShowBranchLength={isShowBranchLength}
        isExportNewick={isExportNewick}
        setIsExportNewick={setIsExportNewick}
        reloadState={reloadState}
        setReloadState={setReloadState}
        tooltip={showToolTip}
        searchingFilter={searchingFilter}
      />
    </div>
  );
};

export const AppWrapper = () => {
  const sourceData = {
    tree: {
      data: newick,
      dataType: "newick",
    },
  };

  return (
    <div>
      <PhyloVizWrapper>
        <PhyloVizComponent sourceData={sourceData} />
      </PhyloVizWrapper>
    </div>
  );
};
