// 百度地图，根据线段长度，等比例计算长度上的点经纬度位置，{latitude: ""，longitude: ""}
// 图片地图，根据线段长度，等比例计算长度上的点物理像数位置，{x: "", y: ""}
let fiberItem = {
  createTime: "",
  creator: "",
  id: "",
  mapId: "",
  mapElementId: "",
  elementType: "",
  mapOperationId: "",
  linkAreaId: "",
  name: "",
  linkName: "",
  finalStatus: "",
  headType: "",
  deviceType: "",
  source: "",
  channelType: "",
  channelId: "",
  channelName: "",
  captureAbility: "",
  lng: "",
  lat: "",
  pointX: "",
  pointY: "",
  pointZ: "",
  extInfo: "",
  collectId: "",
  mapOperation: {},
  customType: "",
  isUse: true,
}; // 用于构造点的模板
let alarmItem = {
  lineDrawConfig: {
    id: "",
    name: "areaAlarmLines",
    points: [0, 0, 0, 0],
    stroke: '#FF4444',
    strokeWidth: 3,
    lineCap: 'round',
    lineJoin: 'round',
    alpha: 0,
    opacity: 1,
    draggable: false,
    visible: false,
    zIndex: 6,
    detectionType: "pixel",
  },
  lineOriginData: {},
  points: [0, 0, 0, 0],
  lines: [],
  detail: {
    lineLength: 0,
    midPoint: {
      x: "",
      y: "",
    },
    startPoint: {
      x: "",
      y: "",
    },
    endPoint: {
      x: "",
      y: "",
    }
  },
};
// 声明定义封装类，继承抛出方法
class CKPlug {
  constructor(options = {}) { // 构造函数，一个类必须有constructor方法，如果没有显式定义，一个默认的constructor方法会被默认添加
    this.areaData = [];
    this.newAreaDataF7 = [];
    this.alarmLinesList = [];
    this.alarmLineData = [];
  }
  // 格式化初始数据，按照通道分类报警数据
  async dealData(options = {}, callback) {
    this.areaData = [];
    this.newAreaDataF7 = [];
    this.alarmLineData = [];
    let dataNew = options || []; // 地图元素列表数据
    if (!dataNew.length)  {
      let dealResult = {
        dealDone: 'success',
        areaData: this.areaData,
        newAreaDataF7: this.newAreaDataF7,
        alarmLineData: this.alarmLineData,
        // alarmLineData: {alarmLineData: this.alarmLineData, BDAlarmLineData, PCAlarmLineData},
        alarmLinesList: this.alarmLinesList,
      };
      if (callback && typeof callback === 'function') {
        callback(dealResult);
      }
      return; // 没有地图元素列表，一个列表点位数据也没有，终止往下执行
    }
    // 按通道mapElementId分类接口数据
    dataNew.forEach((item, k) => {
      this.areaData.push({
        mapElementId: item.mapElementId || "",
        BDPoint: (item.extInfo && item.extInfo.fiberSeven && item.extInfo.fiberSeven.pointInfo && item.extInfo.fiberSeven.pointInfo.points) || [],
        PCPoint: (item.extInfo && item.extInfo.fiberSeven && item.extInfo.fiberSeven.pointInfo && item.extInfo.fiberSeven.pointInfo.points) || [],
        BDLine: (item.extInfo && item.extInfo.fiberSeven && item.extInfo.fiberSeven.pointInfo && item.extInfo.fiberSeven.pointInfo.points.map((data) => [data.lng, data.lat]).flat()) || [],
        PCLine: (item.extInfo && item.extInfo.fiberSeven && item.extInfo.fiberSeven.pointInfo && item.extInfo.fiberSeven.pointInfo.points.map((data) => [data.pointX, data.pointY]).flat()) || [],
        BDAlarmLineArray: (item.alarmExtInfo && item.alarmExtInfo) || [],
        PCAlarmLineArray: (item.alarmExtInfo && item.alarmExtInfo) || [],
        BDAlarmPoint: [],
        PCAlarmPoint: [],
        BDAlarmPointLine: [],
        PCAlarmPointLine: [],
      });
      this.newAreaDataF7.push({
        mapElementId: item.mapElementId || "",
        areaArray: [],
      });
      this.alarmLineData.push({
        mapElementId: item.mapElementId || "",
        BDAlarmArray: [],
        PCAlarmArray: [],
      });
    });
    // 当前通道防区，所有报警的起点集合列表，数据构造处理
    this.areaData.length && this.areaData.forEach((item, k) => {
      item.BDPoint.length && item.BDPoint.map((BDItem, BDk) => {
        BDItem.lng = Number(BDItem.lng) || 0;
        BDItem.lat = Number(BDItem.lat) || 0;
        BDItem.pointX = Number(BDItem.pointX) || 0;
        BDItem.pointY = Number(BDItem.pointY) || 0;
        BDItem.mapElementId = item.mapElementId || "";
        BDItem.relativePos = Number(BDItem.actualDistance) || 0;
        return BDItem;
      });
      item.PCPoint.length && item.PCPoint.map((PCItem, BDk) => {
        PCItem.lng = Number(PCItem.lng) || 0;
        PCItem.lat = Number(PCItem.lat) || 0;
        PCItem.pointX = Number(PCItem.pointX) || 0;
        PCItem.pointY = Number(PCItem.pointY) || 0;
        PCItem.mapElementId = item.mapElementId || "";
        PCItem.relativePos = Number(PCItem.actualDistance) || 0;
        return PCItem;
      });
      item.BDAlarmLineArray.length && item.BDAlarmLineArray.map((BDItem, BDk) => {
        BDItem.mapElementId = item.mapElementId || "";
        // BDItem.perimeterStartPos = Number(BDItem.perimeterStartPos) || 0;
        // BDItem.coverage = Number(BDItem.coverage) || 0;
        BDItem.perimeterStartPos = Number(BDItem.begin) || 0;
        BDItem.perimeterEndPos = Number(BDItem.end) || 0;
        BDItem.coverage = Number(Number(BDItem.end) - Number(BDItem.begin)) || 0;
        // BDItem.alarmUuid = `${BDk}alarm${item.mapElementId}${Number(BDItem.perimeterStartPos)}${Number(BDItem.coverage)}`;
        BDItem.alarmUuid = `${BDk}alarm${item.mapElementId}${Number(BDItem.eventRecordId)}`;
        BDItem.eventRecordId = BDItem.eventRecordId || "";
        BDItem.alarmPoitItem = [];
        return BDItem;
      });
      item.PCAlarmLineArray.length && item.PCAlarmLineArray.map((PCItem, PCk) => {
        PCItem.mapElementId = item.mapElementId || "";
        // PCItem.perimeterStartPos = Number(PCItem.perimeterStartPos) || 0;
        // PCItem.coverage = Number(PCItem.coverage) || 0;
        PCItem.perimeterStartPos = Number(PCItem.begin) || 0;
        PCItem.perimeterEndPos = Number(PCItem.end) || 0;
        PCItem.coverage = Number(Number(PCItem.end) - Number(PCItem.begin)) || 0;
        // PCItem.alarmUuid = `${PCk}alarm${item.mapElementId}${Number(PCItem.perimeterStartPos)}${Number(PCItem.coverage)}`;
        PCItem.alarmUuid = `${PCk}alarm${item.mapElementId}${Number(PCItem.eventRecordId)}`;
        PCItem.eventRecordId = PCItem.eventRecordId || "";
        PCItem.alarmPoitItem = [];
        return PCItem;
      });
    });
    // 通道点位数据，例如[{x1, y1}, {x2, y2}, {x3, y3}]
    // 防区线段长度数据，，例如[{x1, y1, lg}, {x2, y2, lg}, {x3, y3, lg}]，lg是长度，
    // x2, y2 - x1, y1两点间长度，y2--actualDistance - y1--actualDistance
    // 区间计算，数学的区间概念，左右闭合开区间，判断报警防区列表，每个报警防区在通道点的包含属于关系，并且切割构造防区的新区间
    let BDAreaData = JSON.parse(JSON.stringify(this.areaData)); // 克隆百度地图原始构造数据
    let PCAreaData = JSON.parse(JSON.stringify(this.areaData)); // 克隆图片地图原始构造数据
    // let BDAlarmLineData = JSON.parse(JSON.stringify(this.alarmLineData)); // 克隆百度地图原始构造数据
    // let PCAlarmLineData = JSON.parse(JSON.stringify(this.alarmLineData)); // 克隆图片地图原始构造数据
    // console.log('BDAlarmLineData111111', BDAreaData, BDAlarmLineData);
    // console.log('PCAlarmLineData111111', PCAreaData, PCAlarmLineData);
    // 计算百度
    for (let i = 0; i < BDAreaData.length; i++) {
      let data = BDAreaData[i];
      for (let k = 0; k < data.BDAlarmLineArray.length; k++) {
        let BDItem = data.BDAlarmLineArray[k]; // 每条报警数据
        if (data.mapElementId === BDItem.mapElementId) {
          // let BDItem = data.BDAlarmLineArray[k]; // 每条报警数据
          let fiberItemCopy1 = JSON.parse(JSON.stringify(fiberItem)); // 克隆光纤点位数据模板格式
          let fiberItemCopy2 = JSON.parse(JSON.stringify(fiberItem)); // 克隆光纤点位数据模板格式
          Object.assign(fiberItemCopy1, BDItem);
          Object.assign(fiberItemCopy2, BDItem);
          let findItem = JSON.parse(JSON.stringify(data.BDPoint)); // 当前防区允许出现的报警点范围
          let normalLineData = JSON.parse(JSON.stringify(data.BDPoint)); // 当前防区允许出现的报警点范围
          let armStartPos = Number(BDItem.perimeterStartPos); // 通知过来的报警起点
          let armEndPos = Number(BDItem.perimeterStartPos) + Number(BDItem.coverage); // 报警起点往后的覆盖范围
          let findStart = normalLineData.filter((v, l) => armStartPos >= Number(v.relativePos)); // 找到当前防区报警起点，在通道匹配，所有符合条件的最后一个
          let findEnd = normalLineData.find((v, l) => armEndPos <= Number(v.relativePos)); // 找到当前防区报警终点，在通道匹配，所有符合条件的第一个
          if (findStart) { // 找到开始
            if (!findEnd) { // 未找到，覆盖范围超过了当前地图部署的，只在地图部署范围内报警显示
              if (armStartPos <= Number(findItem[findItem.length - 1].relativePos)) { // 报警起点已经在地图画线布防范围外，无需变红，不在范围内
                findEnd = findItem[findItem.length - 1];
                armEndPos = Number(findItem[findItem.length - 1].relativePos); // 报警起点往后的覆盖范围，只在地图部署范围内报警显示
              }
            }
            if (findEnd) {
              let scaleK1 = 1;
              let scaleK2 = 1;
              let lengthX1 = 0;
              let lengthY1 = 0;
              let lengthX2 = 0;
              let lengthY2 = 0;
              let findStartIndex = normalLineData.findIndex((v, l) => Number(findStart[findStart.length - 1].relativePos) <= Number(v.relativePos)); // 找到当前防区报警起点，在通道匹配，所有符合条件的最后一个的下标值
              let findEndIndex = normalLineData.findIndex((v, l) => Number(findEnd.relativePos) <= Number(v.relativePos)); // 找到当前防区报警终点，在通道匹配，所有符合条件的第一个的下标值
              if (findStartIndex > -1 && findEndIndex > -1) { // 找到当前防区报警起点，当前防区报警终点，
                if (findStartIndex === (normalLineData.length - 1)) {
                  scaleK1 = (armStartPos - Number(normalLineData[findStartIndex].relativePos)) / (Number(normalLineData[findStartIndex].relativePos) - Number(normalLineData[findStartIndex].relativePos)); // 报警起点换算比例系数1
                  lengthX1 = Number(normalLineData[findStartIndex].lng) - Number(normalLineData[findStartIndex].lng); // 报警起点段，前后原始参考点lng坐标差值
                  lengthY1 = Number(normalLineData[findStartIndex].lat) - Number(normalLineData[findStartIndex].lat); // 报警起点段，前后原始参考点lat坐标差值
                } else {
                  scaleK1 = (armStartPos - Number(normalLineData[findStartIndex].relativePos)) / (Number(normalLineData[findStartIndex + 1].relativePos) - Number(normalLineData[findStartIndex].relativePos)); // 报警起点换算比例系数1
                  lengthX1 = Number(normalLineData[findStartIndex + 1].lng) - Number(normalLineData[findStartIndex].lng); // 报警起点段，前后原始参考点lng坐标差值
                  lengthY1 = Number(normalLineData[findStartIndex + 1].lat) - Number(normalLineData[findStartIndex].lat); // 报警起点段，前后原始参考点lat坐标差值
                }
                if (findEndIndex === 0) {
                  scaleK2 = (armEndPos - Number(normalLineData[findEndIndex].relativePos)) / (Number(normalLineData[findEndIndex].relativePos) - Number(normalLineData[findEndIndex].relativePos)); // 报警终点换算比例系数2
                  lengthX2 = Number(normalLineData[findEndIndex].lng) - Number(normalLineData[findEndIndex].lng); // 报警终点段，前后原始参考点lng坐标差值
                  lengthY2 = Number(normalLineData[findEndIndex].lat) - Number(normalLineData[findEndIndex].lat); // 报警终点段，前后原始参考点lat坐标差值
                } else {
                  scaleK2 = (armEndPos - Number(normalLineData[findEndIndex - 1].relativePos)) / (Number(normalLineData[findEndIndex].relativePos) - Number(normalLineData[findEndIndex - 1].relativePos)); // 报警终点换算比例系数2
                  lengthX2 = Number(normalLineData[findEndIndex].lng) - Number(normalLineData[findEndIndex - 1].lng); // 报警终点段，前后原始参考点lng坐标差值
                  lengthY2 = Number(normalLineData[findEndIndex].lat) - Number(normalLineData[findEndIndex - 1].lat); // 报警终点段，前后原始参考点lat坐标差值
                }
                let newXAlarmStart = Number(normalLineData[findStartIndex].lng) + scaleK1.toFixed(36) * lengthX1.toFixed(36); // 报警起点段，构造点lng坐标
                let newYAlarmStart = Number(normalLineData[findStartIndex].lat) + scaleK1.toFixed(36) * lengthY1.toFixed(36); // 报警起点段，构造点lat坐标
                let newXAlarmEnd = Number(normalLineData[findEndIndex - 1].lng) + scaleK2.toFixed(36) * lengthX2.toFixed(36); // 报警终点段，构造点lng坐标
                let newYAlarmEnd = Number(normalLineData[findEndIndex - 1].lat) + scaleK2.toFixed(36) * lengthY2.toFixed(36); // 报警终点段，构造点lat坐标
                fiberItemCopy1.mapElementId = normalLineData.mapElementId;
                fiberItemCopy1.relativePos = armStartPos;
                fiberItemCopy1.customType = "new";
                fiberItemCopy1.isUse = true;
                fiberItemCopy1.newData = "has";
                fiberItemCopy1.lng = newXAlarmStart;
                fiberItemCopy1.lat = newYAlarmStart;
                fiberItemCopy2.mapElementId = normalLineData.mapElementId;
                fiberItemCopy2.relativePos = armEndPos;
                fiberItemCopy2.customType = "new";
                fiberItemCopy2.isUse = true;
                fiberItemCopy2.newData = "has";
                fiberItemCopy2.lng = newXAlarmEnd;
                fiberItemCopy2.lat = newYAlarmEnd;
                // 报警点
                BDItem.alarmPoitItem = [];
                BDItem.alarmPoitItem = normalLineData.slice(findStartIndex + 1, findEndIndex); // 构造报警范围中间的原始光纤点，不必计算，直接用
                BDItem.alarmPoitItem.unshift(fiberItemCopy1); // 构造报警起点
                BDItem.alarmPoitItem.push(fiberItemCopy2); // 构造报警终点
                // console.log('报警点', newXAlarmStart, newYAlarmStart, newXAlarmEnd, newYAlarmEnd, BDItem.alarmPoitItem);
              }
            }
          }
        }
      }
    }
    // 计算图片
    for (let i = 0; i < PCAreaData.length; i++) {
      let data = PCAreaData[i];
      for (let k = 0; k < data.PCAlarmLineArray.length; k++) {
        let PCItem = data.PCAlarmLineArray[k]; // 每条报警数据
        if (data.mapElementId === PCItem.mapElementId) {
          // let PCItem = data.PCAlarmLineArray[k]; // 每条报警数据
          let fiberItemCopy1 = JSON.parse(JSON.stringify(fiberItem)); // 克隆光纤点位数据模板格式
          let fiberItemCopy2 = JSON.parse(JSON.stringify(fiberItem)); // 克隆光纤点位数据模板格式
          Object.assign(fiberItemCopy1, PCItem);
          Object.assign(fiberItemCopy2, PCItem);
          let findItem = JSON.parse(JSON.stringify(data.PCPoint)); // 当前防区允许出现的报警点范围
          let normalLineData = JSON.parse(JSON.stringify(data.PCPoint)); // 当前防区允许出现的报警点范围
          let armStartPos = Number(PCItem.perimeterStartPos); // 通知过来的报警起点
          let armEndPos = Number(PCItem.perimeterStartPos) + Number(PCItem.coverage); // 报警起点往后的覆盖范围
          let findStart = normalLineData.filter((v, l) => armStartPos >= Number(v.relativePos)); // 找到当前防区报警起点，在通道匹配，所有符合条件的最后一个
          let findEnd = normalLineData.find((v, l) => armEndPos <= Number(v.relativePos)); // 找到当前防区报警终点，在通道匹配，所有符合条件的第一个
          // console.log('报警某个防区，某段长度', armStartPos, armEndPos, findStart, findEnd, data.PCPoint);
          if (findStart) { // 找到开始
            if (!findEnd) { // 未找到，覆盖范围超过了当前地图部署的，只在地图部署范围内报警显示
              if (armStartPos <= Number(findItem[findItem.length - 1].relativePos)) { // 报警起点已经在地图画线布防范围外，无需变红，不在范围内
                findEnd = findItem[findItem.length - 1];
                armEndPos = Number(findItem[findItem.length - 1].relativePos); // 报警起点往后的覆盖范围，只在地图部署范围内报警显示
              }
            }
            if (findEnd) {
              let scaleK1 = 1;
              let scaleK2 = 1;
              let lengthX1 = 0;
              let lengthY1 = 0;
              let lengthX2 = 0;
              let lengthY2 = 0;
              let findStartIndex = normalLineData.findIndex((v, l) => Number(findStart[findStart.length - 1].relativePos) <= Number(v.relativePos)); // 找到当前防区报警起点，在通道匹配，所有符合条件的最后一个的下标值
              let findEndIndex = normalLineData.findIndex((v, l) => Number(findEnd.relativePos) <= Number(v.relativePos)); // 找到当前防区报警终点，在通道匹配，所有符合条件的第一个的下标值
              // console.log('报警某个防区，某段长度11111', findStart, findEnd, findStartIndex, findEndIndex);
              if (findStartIndex > -1 && findEndIndex > -1) { // 找到当前防区报警起点，当前防区报警终点，
                if (findStartIndex === (normalLineData.length - 1)) {
                  scaleK1 = (armStartPos - Number(normalLineData[findStartIndex].relativePos)) / (Number(normalLineData[findStartIndex].relativePos) - Number(normalLineData[findStartIndex].relativePos)); // 报警起点换算比例系数1
                  lengthX1 = Number(normalLineData[findStartIndex].pointX) - Number(normalLineData[findStartIndex].pointX); // 报警起点段，前后原始参考点x坐标差值
                  lengthY1 = Number(normalLineData[findStartIndex].pointY) - Number(normalLineData[findStartIndex].pointY); // 报警起点段，前后原始参考点y坐标差值
                } else {
                  scaleK1 = (armStartPos - Number(normalLineData[findStartIndex].relativePos)) / (Number(normalLineData[findStartIndex + 1].relativePos) - Number(normalLineData[findStartIndex].relativePos)); // 报警起点换算比例系数1
                  lengthX1 = Number(normalLineData[findStartIndex + 1].pointX) - Number(normalLineData[findStartIndex].pointX); // 报警起点段，前后原始参考点x坐标差值
                  lengthY1 = Number(normalLineData[findStartIndex + 1].pointY) - Number(normalLineData[findStartIndex].pointY); // 报警起点段，前后原始参考点y坐标差值
                }
                if (findEndIndex === 0) {
                  scaleK2 = (armEndPos - Number(normalLineData[findEndIndex].relativePos)) / (Number(normalLineData[findEndIndex].relativePos) - Number(normalLineData[findEndIndex].relativePos)); // 报警终点换算比例系数2
                  lengthX2 = Number(normalLineData[findEndIndex].pointX) - Number(normalLineData[findEndIndex].pointX); // 报警终点段，前后原始参考点x坐标差值
                  lengthY2 = Number(normalLineData[findEndIndex].pointY) - Number(normalLineData[findEndIndex].pointY); // 报警终点段，前后原始参考点y坐标差值
                } else {
                  scaleK2 = (armEndPos - Number(normalLineData[findEndIndex - 1].relativePos)) / (Number(normalLineData[findEndIndex].relativePos) - Number(normalLineData[findEndIndex - 1].relativePos)); // 报警终点换算比例系数2
                  lengthX2 = Number(normalLineData[findEndIndex].pointX) - Number(normalLineData[findEndIndex - 1].pointX); // 报警终点段，前后原始参考点x坐标差值
                  lengthY2 = Number(normalLineData[findEndIndex].pointY) - Number(normalLineData[findEndIndex - 1].pointY); // 报警终点段，前后原始参考点y坐标差值
                }
                let newXAlarmStart = Number(normalLineData[findStartIndex].pointX) + scaleK1.toFixed(36) * lengthX1.toFixed(36); // 报警起点段，构造点x坐标
                let newYAlarmStart = Number(normalLineData[findStartIndex].pointY) + scaleK1.toFixed(36) * lengthY1.toFixed(36); // 报警起点段，构造点y坐标
                let newXAlarmEnd = Number(normalLineData[findEndIndex - 1].pointX) + scaleK2.toFixed(36) * lengthX2.toFixed(36); // 报警终点段，构造点x坐标
                let newYAlarmEnd = Number(normalLineData[findEndIndex - 1].pointY) + scaleK2.toFixed(36) * lengthY2.toFixed(36); // 报警终点段，构造点y坐标
                fiberItemCopy1.mapElementId = normalLineData.mapElementId;
                fiberItemCopy1.relativePos = armStartPos;
                fiberItemCopy1.customType = "new";
                fiberItemCopy1.isUse = true;
                fiberItemCopy1.newData = "has";
                fiberItemCopy1.pointX = newXAlarmStart;
                fiberItemCopy1.pointY = newYAlarmStart;
                fiberItemCopy2.mapElementId = normalLineData.mapElementId;
                fiberItemCopy2.relativePos = armEndPos;
                fiberItemCopy2.customType = "new";
                fiberItemCopy2.isUse = true;
                fiberItemCopy2.newData = "has";
                fiberItemCopy2.pointX = newXAlarmEnd;
                fiberItemCopy2.pointY = newYAlarmEnd;
                // 报警点
                PCItem.alarmPoitItem = [];
                PCItem.alarmPoitItem = normalLineData.slice(findStartIndex + 1, findEndIndex); // 构造报警范围中间的原始光纤点，不必计算，直接用
                PCItem.alarmPoitItem.unshift(fiberItemCopy1); // 构造报警起点
                PCItem.alarmPoitItem.push(fiberItemCopy2); // 构造报警终点
                // console.log('报警点', PCItem.alarmPoitItem);
              }
            }
          }
        }
      }
    }
    // 赋值分配报警数据
    // 百度地图，分配赋值报警数据
    BDAreaData.length && BDAreaData.forEach((item, k) => {
      this.alarmLineData.length && this.alarmLineData.forEach((alarArr, q2) => {
        if (item.mapElementId === alarArr.mapElementId) {
          alarArr.BDAlarmArray = [];
          item.BDAlarmLineArray.length && item.BDAlarmLineArray.forEach((data, m) => {
            data.alarmPoitItem.length && data.alarmPoitItem.forEach((alarArr2, k) => {
              let tempItem = data.alarmPoitItem;
              let areaAlarmLineItem = JSON.parse(JSON.stringify(alarmItem)); // 克隆防区报警线段数据模板格式
              let lineStartRelativePos = Number(tempItem[0].relativePos); // 线段起点距离周界长度
              // let lineEndtRelativePos = (tempItem.length - 1) ? Number(tempItem[tempItem.length - 1].relativePos) : Number(tempItem[0].relativePos); // 线段终点距离周界长度
              let lineEndtRelativePos = k === (tempItem.length - 1) ? "" : k < (tempItem.length - 1) ? tempItem[k + 1].relativePos : ""; // 线段终点距离周界长度
              let lineStartX = Number(tempItem[0].lng); // 线段起点坐标lng
              let lineStartY = Number(tempItem[0].lat); // 线段起点坐标lat
              // let lineEndX = (tempItem.length - 1) ? Number(tempItem[tempItem.length - 1].lng) : Number(tempItem[0].lng); // 线段终点坐标lng
              // let lineEndY = (tempItem.length - 1) ? Number(tempItem[tempItem.length - 1].lat) : Number(tempItem[0].lat); // 线段终点坐标lat
              let lineEndX = (tempItem.length === 1) ? "" : k < (tempItem.length - 1) ? tempItem[k + 1].lng : tempItem[k].lng; // 线段终点坐标lng
              let lineEndY = (tempItem.length === 1) ? "" : k < (tempItem.length - 1) ? tempItem[k + 1].lat : tempItem[k].lat; // 线段终点坐标lat
              // console.log('channelUuid111', tempItem, alarArr.mapElementId);
              areaAlarmLineItem.lineDrawConfig.id = `alarm${alarArr.mapElementId}`;
              areaAlarmLineItem.lineDrawConfig.name = `alarmline${alarArr.mapElementId}`;
              areaAlarmLineItem.lineDrawConfig.points = tempItem.map((itemP) => [Number(itemP.lng), Number(itemP.lat)]).flat();
              areaAlarmLineItem.lineDrawConfig.visible = true;
              areaAlarmLineItem.points = tempItem.map((itemP) => [Number(itemP.lng), Number(itemP.lat)]).flat();
              areaAlarmLineItem.detail.lineLength = lineEndtRelativePos - lineStartRelativePos;
              areaAlarmLineItem.detail.midPoint = [(lineEndX - lineStartX) / 2, (lineEndY - lineEndX) / 2];
              areaAlarmLineItem.detail.startPoint = {
                lng: lineStartX,
                lat: lineStartY
              };
              areaAlarmLineItem.detail.endPoint = {
                lng: lineEndX,
                lat: lineEndY
              };
              areaAlarmLineItem.detail.alarmUuid = alarArr2.alarmUuid;
              areaAlarmLineItem.detail.eventRecordId = alarArr2.eventRecordId;
              areaAlarmLineItem.lines = tempItem.map((item) => [{lng: Number(item.lng), lat: Number(item.lat), pointX: Number(item.pointX), pointY: Number(item.pointY)}]).flat();
              // areaAlarmLineItem.lines.push({lng: lineStartX, lat: lineStartY}, {lng: lineEndX, lat: lineEndY});
              areaAlarmLineItem.lineOriginData.startPoint = tempItem[0];
              areaAlarmLineItem.lineOriginData.endPoint = (tempItem.length - 1) ? tempItem[tempItem.length - 1] : tempItem[0];
              (k % 2 === 0) && alarArr.BDAlarmArray.push(areaAlarmLineItem);
              // console.log('百度地图赋值分配报警数据', tempItem, Number(tempItem[0].lng), lineStartY, lineEndX, lineEndY);
            });
          });
        }
      });
    });
    // 图片地图，分配赋值报警数据
    PCAreaData.length && PCAreaData.forEach((item, k) => {
      this.alarmLineData.length && this.alarmLineData.forEach((alarArr, q2) => {
        if (item.mapElementId === alarArr.mapElementId) {
          alarArr.PCAlarmArray = [];
          item.PCAlarmLineArray.length && item.PCAlarmLineArray.forEach((data, m) => {
            data.alarmPoitItem.length && data.alarmPoitItem.forEach((alarArr2, k) => {
              let tempItem = data.alarmPoitItem;
              let areaAlarmLineItem = JSON.parse(JSON.stringify(alarmItem)); // 克隆防区报警线段数据模板格式
              let lineStartRelativePos = Number(tempItem[0].relativePos); // 线段起点距离周界长度
              // let lineEndtRelativePos = (tempItem.length - 1) ? Number(tempItem[tempItem.length - 1].relativePos) : Number(tempItem[0].relativePos); // 线段终点距离周界长度
              let lineEndtRelativePos = k === (tempItem.length - 1) ? "" : k < (tempItem.length - 1) ? tempItem[k + 1].relativePos : ""; // 线段终点距离周界长度
              let lineStartX = Number(tempItem[0].pointX); // 线段起点坐标x
              let lineStartY = Number(tempItem[0].pointY); // 线段起点坐标y
              // let lineEndX = (tempItem.length - 1) ? Number(tempItem[tempItem.length - 1].pointX) : Number(tempItem[0].pointX); // 线段终点坐标x
              // let lineEndY = (tempItem.length - 1) ? Number(tempItem[tempItem.length - 1].pointY) : Number(tempItem[0].pointY); // 线段终点坐标y
              let lineEndX = (tempItem.length === 1) ? "" : k < (tempItem.length - 1) ? tempItem[k + 1].pointX : tempItem[k].pointX; // 线段终点坐标x
              let lineEndY = (tempItem.length === 1) ? "" : k < (tempItem.length - 1) ? tempItem[k + 1].pointY : tempItem[k].pointY; // 线段终点坐标y
              // console.log('channelUuid111', alarArr.mapElementId);
              areaAlarmLineItem.lineDrawConfig.id = `alarm${alarArr.mapElementId}`;
              areaAlarmLineItem.lineDrawConfig.name = `alarmline${alarArr.mapElementId}`;
              areaAlarmLineItem.lineDrawConfig.points = tempItem.map((itemP) => [Number(itemP.pointX), Number(itemP.pointY)]).flat();
              areaAlarmLineItem.lineDrawConfig.visible = true;
              areaAlarmLineItem.points = tempItem.map((itemP) => [Number(itemP.pointX), Number(itemP.pointY)]).flat();
              areaAlarmLineItem.detail.lineLength = lineEndtRelativePos - lineStartRelativePos;
              areaAlarmLineItem.detail.midPoint = [(lineEndX - lineStartX) / 2, (lineEndY - lineEndX) / 2];
              areaAlarmLineItem.detail.startPoint = {
                pointX: lineStartX,
                pointY: lineStartY
              };
              areaAlarmLineItem.detail.endPoint = {
                pointX: lineEndX,
                pointY: lineEndY
              };
              areaAlarmLineItem.detail.alarmUuid = alarArr2.alarmUuid;
              areaAlarmLineItem.detail.eventRecordId = alarArr2.eventRecordId;
              areaAlarmLineItem.lines = tempItem.map((item) => [{lng: Number(item.lng), lat: Number(item.lat), pointX: Number(item.pointX), pointY: Number(item.pointY)}]).flat();
              // areaAlarmLineItem.lines.push({pointX: lineStartX, pointY: lineStartY}, {pointX: lineEndX, pointY: lineEndY});
              areaAlarmLineItem.lineOriginData.startPoint = tempItem[0];
              areaAlarmLineItem.lineOriginData.endPoint = (tempItem.length - 1) ? tempItem[tempItem.length - 1] : tempItem[0];
              (k % 2 === 0) && alarArr.PCAlarmArray.push(areaAlarmLineItem);
              // console.log('图片地图赋值分配报警数据', tempItem, Number(tempItem[0].lng), lineStartY, lineEndX, lineEndY);
            });
          });
        }
      });
    });
    let dealResult = {
      dealDone: 'success',
      areaData: this.areaData,
      newAreaDataF7: this.newAreaDataF7,
      alarmLineData: this.alarmLineData,
      // alarmLineData: {alarmLineData: this.alarmLineData, BDAlarmLineData, PCAlarmLineData},
      alarmLinesList: this.alarmLinesList,
    };
    if (callback && typeof callback === 'function') {
      callback(dealResult);
    }
  }
}
export default new CKPlug();
