// import Kinetic from 'kinetic'; // 引入cavans画图kinetic插件库对象
import Kinetic from 'canvas-kinetic'; // 引入cavans画图canvas-kinetic插件库对象--在kinetic原作者JavaScript基础上，二次修改，增加一些api封装成npm包形式--开源作者--lcz
// let Kinetic = null;

let rectDraw = null; // 创建Kinetic用户组，框选的矩形元素对象
let rectDrawGroup = null; // 创建Kinetic用户组，框选的矩形元素对象组（Group）
let circleDraw = null; // 创建Kinetic用户组，框选的圆形元素对象
let circleDrawGroup = null; // 创建Kinetic用户组，框选的圆形元素对象组（Group）
let polygonDraw = null; // 创建Kinetic用户组，框选的多边形元素对象
let polygonDrawGroup = null; // 创建Kinetic用户组，框选的多边形元素对象组（Group）
let foldLineDraw = null; // 创建Kinetic用户组，添加画的折线元素对象
let foldLineDrawGroup = null; // 创建Kinetic用户组，添加画的折线元素对象组（Group）
// 通用绘制参数，地图舞台数据模板处理函数
const commonMapStageData = (options) => {
  let configMapStage = {
    id: options.id || "mapStage123456", // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    container: options.container || "map-container", // 地图容器挂载<div>的id，若未设置，默认id"map-container"
    width: options.width || '100%', // 舞台宽度，若未设置，默认100%
    height: options.height || '100%', // 舞台高度，若未设置，默认100%
    Kinetic: options.Kinetic || Kinetic, // kinetic插件库对象
  }; // 地图舞台，绘制参数模板
  return configMapStage;
};
// 通用绘制参数，地图图片数据模板处理函数
const commonMapImgData = (options) => {
  let configMapImg = {
    id: options.id || 'mapImg123456', // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    name: options.name || "mapImg", // 名称
    x: (options.point && options.point.x) || 0, // 地图图片元素左上角x坐标，若未设置，默认0
    y: (options.point && options.point.y) || 0, // 地图图片左上角y坐标，若未设置，默认0
    image: options.imageObj || "", // 地图图片的文件对象格式，若未设置，默认空
    width: options.width || '100%', // 地图图片宽度，若未设置，默认100%
    height: options.height || '100%', // 地图图片高度，若未设置，默认100%
    offset: {
      x: (options.offset && options.offset.x) || 0, // 若未设置，默认0
      y: (options.offset && options.offset.y) || 0, // 若未设置，默认0
    }, // 矩形点的中心位置偏移量
    alpha: options.alpha || 0, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
    opacity: (options.opacity || options.opacity === 0) ? options.opacity : 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
    // zIndex: options.zIndex || 0, // 设定层图像的ZIndex值
    draggable: options.draggable === true, // 地图图片元素能否拖动，若未设置，默认true
    visible: options.visible !== false, // 地图图片元素的显示隐藏，若未设置，默认显示
    detectionType: "pixel", // 为了使用像素检测，就需要为图形图像对象的检测类型detectionType设置为像素检测pixel。这个值默认是路径检测path。
  }; // 地图图片基本，绘制参数模板
  return configMapImg;
};
// 通用绘制参数，mark图标数据模板处理函数
const commonMarkImgData = (options) => {
  let configMarkImg = {
    id: options.id || 'mark_id', // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    name: options.name || "markImg", // 名称
    x: options.point.x || 0, // mark图标元素左上角x坐标，若未设置，默认0
    y: options.point.y || 0, // mark图标左上角y坐标，若未设置，默认0
    image: options.image || "", // mark图标的文件对象格式，若未设置，默认空
    width: options.width || '100%', // mark图标宽度，若未设置，默认100%
    height: options.height || '100%', // mark图标高度，若未设置，默认100%
    offset: {
      x: (options.offset && options.offset.x) || 0, // 若未设置，默认0
      y: (options.offset && options.offset.y) || 0, // 若未设置，默认0
    }, // 矩形点的中心位置偏移量
    alpha: options.alpha || 0, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
    opacity: (options.opacity || options.opacity === 0) ? options.opacity : 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
    // zIndex: options.zIndex || 3, // 设定层图像的ZIndex值
    draggable: options.draggable === true, // mark图标元素能否拖动，若未设置，默认true
    visible: options.visible !== false, // mark图标元素的显示隐藏，若未设置，默认显示
    detectionType: "pixel", // 为了使用像素检测，就需要为图形图像对象的检测类型detectionType设置为像素检测pixel。这个值默认是路径检测path。
  }; // mark图标，绘制参数模板
  return configMarkImg;
};
// 通用绘制参数，点元素数据模板处理函数
const commonPointData = (options) => {
  let configPoint = {
    id: options.id || 'point_id', // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    name: options.name || "pointRect", // 名称
    x: options.point.x || 0, // 矩形点左上角x坐标，若未设置，默认0
    y: options.point.y || 0, // 矩形点左上角y坐标，若未设置，默认0
    width: options.width || 16, // 矩形点宽度，若未设置，默认14
    height: options.height || 16, // 矩形点高度，若未设置，默认14
    offset: {
      x: (options.offset && options.offset.x) || 8, // 若未设置，默认6
      y: (options.offset && options.offset.y) || 8, // 若未设置，默认6
    }, // 矩形点的中心位置偏移量
    fill: options.fill || "white", // 矩形点的填充色，若未设置，默认white
    stroke: options.black || "black", // 矩形点的边缘线颜色，若未设置，默认black
    strokeWidth: options.strokeWidth || 1, // 矩形点的边缘线宽度，若未设置，默认1
    alpha: options.alpha || 0, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
    opacity: (options.opacity || options.opacity === 0) ? options.opacity : 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
    // zIndex: options.zIndex || 1, // 设定层图像的ZIndex值
    draggable: options.draggable === true, // 矩形点能否拖动，若未设置，默认true
    visible: options.visible !== false, // 矩形点的显示隐藏，若未设置，默认显示
    detectionType: "pixel", // 为了使用像素检测，就需要为图形图像对象的检测类型detectionType设置为像素检测pixel。这个值默认是路径检测path。
  }; // 点元素基本，绘制参数模板
  return configPoint;
};
// 通用绘制参数，线段元素数据模板处理函数
const commonLineData = (options) => {
  let configLine = {
    id: options.id || 'line_id', // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    name: options.name || "pointLine", // 名称
    points: options.points || [0, 0, 0, 0], // 线段起始--结束，两个坐标点
    stroke: options.stroke || '#BBBBBB', // 线段颜色，若未设置，默认灰色
    strokeWidth: options.strokeWidth || 3, // 线段宽度粗细，若未设置，默认3
    lineCap: options.lineCap || 'round', // 线段连接点的样式式，可以是 miter ， bevel 或 round，若未设置，默认round，若未设置，默认灰色
    lineJoin: options.lineJoin || 'round',
    alpha: options.alpha || 0, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
    opacity: (options.opacity || options.opacity === 0) ? options.opacity : 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
    // zIndex: options.zIndex || 2, // 设定层图像的ZIndex值
    draggable: options.draggable === true, // 线段能否拖动，若未设置，默认false
    visible: options.visible !== false, // 线段的显示隐藏，若未设置，默认显示
    detectionType: "pixel", // 为了使用像素检测，就需要为图形图像对象的检测类型detectionType设置为像素检测pixel。这个值默认是路径检测path。
  }; // 线段元素基本，绘制参数模板
  return configLine;
};
// 通用绘制参数，报警线段元素数据模板处理函数
const commonAlarmLineData = (options) => {
  let configLine = {
    id: options.id || 'alarmline_id', // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    name: options.name || "pointAlarmLine", // 名称
    points: options.points || [0, 0, 0, 0], // 线段起始--结束，两个坐标点
    stroke: options.stroke || '#FF4444', // 线段颜色，若未设置，默认灰色
    strokeWidth: options.strokeWidth || 5, // 线段宽度粗细，若未设置，默认3
    lineCap: options.lineCap || 'round', // 线段连接点的样式式，可以是 miter ， bevel 或 round，若未设置，默认round，若未设置，默认灰色
    lineJoin: options.lineJoin || 'round',
    alpha: options.alpha || 0, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
    opacity: (options.opacity || options.opacity === 0) ? options.opacity : 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
    // zIndex: options.zIndex || 2, // 设定层图像的ZIndex值
    draggable: options.draggable === true, // 线段能否拖动，若未设置，默认false
    visible: options.visible !== false, // 线段的显示隐藏，若未设置，默认显示
    detectionType: "pixel", // 为了使用像素检测，就需要为图形图像对象的检测类型detectionType设置为像素检测pixel。这个值默认是路径检测path。
  }; // 线段元素基本，绘制参数模板
  return configLine;
};
// 通用绘制参数，多边形元素数据模板处理函数
const commonPolygonLineData = (options) => {
  let configLine = {
    id: options.id || 'polygonLine_id', // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    name: options.name || "polygonLine", // 名称
    points: options.points || [0, 0, 0, 0], // 线段起始--结束，两个坐标点
    stroke: options.stroke || '#43FBEF', // 线段颜色，若未设置，默认浅天空蓝
    fill: 'rgba(37,210,152,0.4)', // 矩形点的填充色，若未设置，默认深蓝绿
    strokeWidth: options.strokeWidth || 3, // 线段宽度粗细，若未设置，默认3
    lineCap: options.lineCap || 'round', // 线段连接点的样式式，可以是 miter ， bevel 或 round，若未设置，默认round，若未设置，默认灰色
    lineJoin: options.lineJoin || 'round',
    alpha: options.alpha || 0, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
    opacity: (options.opacity || options.opacity === 0) ? options.opacity : 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
    // zIndex: options.zIndex || 6, // 设定层图像的ZIndex值
    draggable: options.draggable === true, // 线段能否拖动，若未设置，默认false
    visible: options.visible !== false, // 线段的显示隐藏，若未设置，默认显示
    detectionType: "pixel", // 为了使用像素检测，就需要为图形图像对象的检测类型detectionType设置为像素检测pixel。这个值默认是路径检测path。
  }; // 多边形元素基本，绘制参数模板
  return configLine;
};
// 通用绘制参数，扇形元素数据模板处理函数
const commonWedgeData = (options) => {
  let configWedge = {
    id: options.id || 'wedge_id', // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
    name: options.name || "wedge", // 名称
    x: options.point.x || 0, // 扇形中心点左上角x坐标，若未设置，默认0
    y: options.point.y || 0, // 扇形中心点左上角y坐标，若未设置，默认0
    radius: options.radius || 50, // 扇形半径，若未设置，默认50
    fill: 'rgba(37,210,152,0.4)', // 扇形的填充色，若未设置，默认深蓝绿
    stroke: options.stroke || '#43FBEF', // 扇形线段颜色，若未设置，默认浅天空蓝
    strokeWidth: options.strokeWidth || 3, // 扇形线段宽度粗细，若未设置，默认3
    startAngle: options.startAngle || 0, // 扇形起始角度，若未设置，默认0
    endAngle: options.endAngle || 0, // 扇形结束角度，若未设置，默认30
    angle: options.angle || 0, // 扇形开口角度，若未设置，默认30度
    rotation: -options.rotation || 0, // 扇形旋转角度，若未设置，默认0度，第一象限x正轴，逆时针
    alpha: options.alpha || 0, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
    opacity: (options.opacity || options.opacity === 0) ? options.opacity : 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
    // zIndex: options.zIndex || 16, // 设定层图像的ZIndex值
    draggable: options.draggable === true, // 线段能否拖动，若未设置，默认false
    visible: options.wedgeVisible !== false, // 线段的显示隐藏，若未设置，默认显示
    detectionType: "pixel", // 为了使用像素检测，就需要为图形图像对象的检测类型detectionType设置为像素检测pixel。这个值默认是路径检测path。
  }; // 扇形元素基本，绘制参数模板
  return configWedge;
};
// 声明定义封装CKMap类，继承抛出方法
class CKMap {
  constructor(options = {}) { // 构造函数，一个类必须有constructor方法，如果没有显式定义，一个默认的constructor方法会被默认添加
    this.configMapStage = {}; // 地图舞台数据模板，通用绘制参数
    this.body = null; // 当前页面，body标签元素对象
    this.containerDiv = null; // 当前页面，地图容器挂载<div>标签元素对象
    this.canvas = null; // 当前页面，地图容器挂载<div>标签元素里的canvas标签元素对象
    this.stage = null; // 创建kinetic舞台，绑定我们添加的<div>舞台容器，舞台对象
    this.layer = null; // 创建Kinetic用户层，舞台用户层对象
    this.scale = 1; // 当前页面，地图容器挂载<div>标签，比例尺寸
    this.stageImg = ""; // 舞台图片，地图图片对象
    this.mousedownX = 0; // 鼠标按下x坐标
    this.mousedownY = 0; // 鼠标按下y坐标
    this.mouseupX = 0; // 鼠标弹起x坐标
    this.mouseupY = 0; // 鼠标弹起y坐标
    this.mapDragend = false; // 地图图片拖拽是否结束
    this.rectPointDragend = false; // 矩形点拖拽是否结束
    this.markDragend = false; // mark图标点拖拽是否结束
    this.markClickEnd = false; // mark图标单击事件结束
    this.markClickCount = 0; // mark图标单击事件结束
    this.markClickEndInterval = null; // mark图标单击事件间隔时间
    this.wedgePointDragend = false; // 扇形编辑点拖拽是否结束
    this.configMapImg = {}; // 通用绘制参数，地图图片数据模板
    this.mapImg = null; // 创建的Kinetic地图图片绘制对象
    this.mapImgGroup = null; // 创建Kinetic用户组，地图图片绘制对象组（Group）
    this.configMarkImg = {}; // 通用绘制参数，mark图标图片数据模板
    this.rectMarkImg = null; // 创建Kinetic用户组，mark图标图片对象
    this.markGroup = null; // 创建Kinetic用户组，mark图 标元素对象组（Group）
    this.configPoint = {}; // 通用绘制参数，点元素数据模板
    this.rectPoint = null; // 创建Kinetic用户组，点元素对象
    this.rectPointGroup = null; // 创建Kinetic用户组，点元素对象组（Group）
    this.pointTextGroup = null; // 创建Kinetic用户组，点元素文字标注对象组（Group）
    this.configLine = {}; // 通用绘制参数，线段元素数据模板
    this.lineAreaPoint = null; // 创建Kinetic用户组，防区线段元素对象
    this.lineAreaGroup = null; // 创建Kinetic用户组，防区线段元素对象组（Group）
    this.wedgePoint = null; // 创建Kinetic用户组，扇形元素对象
    this.wedgePointGroup = null; // 创建Kinetic用户组，扇形元素对象组（Group）
    this.startWedgeMark = null; // 创建Kinetic用户组，扇形起点编辑小圆标元素对象
    this.startWedgeMarkGroup = null; // 创建Kinetic用户组，扇形起点编辑小圆标元素对象组（Group）
    this.middleWedgeMark = null; // 创建Kinetic用户组，扇形中间点编辑小圆标元素对象
    this.middleWedgeMarkGroup = null; // 创建Kinetic用户组，扇形中间点编辑小圆标元素对象组（Group）
    this.endWedgeMark = null; // 创建Kinetic用户组，扇形终点编辑小圆标元素对象
    this.endWedgeMarkGroup = null; // 创建Kinetic用户组，扇形终点编辑小圆标元素对象对象组（Group）
    this.configStartWedgeMark = {}; // 通用绘制参数，扇形起点编辑小圆标元素数据模板
    this.configMiddleWedgeMark = {}; // 通用绘制参数，扇形中间点编辑小圆标元素数据模板
    this.configEndWedgeMark = {}; // 通用绘制参数，扇形终点编辑小圆标元素数据模板
    this.configAlarmLine = {}; // 通用绘制参数，报警线段元素数据模板
    this.alarmLineAreaPoint = null; // 创建Kinetic用户组，防区报警线段元素对象
    this.alarmLineAreaGroup = null; // 创建Kinetic用户组，防区报警线段元素对象组（Group）
    this.isAlarmAnimation = false; // 是否报警动画
    this.normalAnimationInterval = null; // 基础图标，线段的动画定时器
    this.alarmAnimationInterval = null; // 报警图标，线段的动画定时器
  }
  // 初始化舞台，及参数属性
  initMapStage(options, callback) {
    // console.log('初始化舞台，及参数属性', Kinetic);
    this.configMapStage = commonMapStageData(options.mapStageConfig); // 通用绘制参数，地图舞台数据模板处理函数
    // Kinetic = options.mapStageConfig.Kinetic;
    this.body = document.getElementsByTagName('body')[0]; // 当前页面，body标签元素对象
    this.containerDiv = document.getElementById(this.configMapStage.container); // 当前页面，地图容器挂载<div>标签元素对象
    if (!this.containerDiv) return;
    this.containerDiv && (this.containerDiv.style = "");
    this.containerDiv && (this.containerDiv.style.transform = "scale(1)");
    this.containerDiv && (this.containerDiv.style.width = this.configMapStage.width + 'px');
    this.containerDiv && (this.containerDiv.style.height = this.configMapStage.height + 'px');
    this.containerDiv && (this.canvas = document.getElementById(this.configMapStage.container).getElementsByTagName('canvas')[0]); // 当前页面，地图容器挂载<div>标签元素里的canvas标签元素对象
    this.stage = new Kinetic.Stage(this.configMapStage); // 创建kinetic舞台，绑定我们添加的<div>舞台容器，舞台对象
    this.layer = new Kinetic.Layer({
      id: "canvasLayer"
    }); // 创建Kinetic用户层，舞台用户层对象
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      configMapStage: this.configMapStage,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
  }
  // 初始化舞台，地图图片
  initMapPicture(options, callback, mapDragFun, wheelZoomFun) {
    // const T = this;
    this.configMapImg = commonMapImgData(options.mapImgConfig); // 通用绘制参数，地图舞台数据模板处理函数
    let imageObj = new Image();
    this.configMapImg.image = imageObj;
    !this.mapImgGroup && (this.mapImgGroup = new Kinetic.Group()); // 创建地图图片绘制对象组（Group）
    imageObj.onload = () => {
      this.mapImg = new Kinetic.Image(this.configMapImg);
      this.mapImgGroup.add(this.mapImg); // 把多个图标点对象添加到group里
      this.layer.add(this.mapImgGroup); // 把group对象添加到层里
      this.stage.add(this.layer);
      this.mapImg.setZIndex(this.configMapImg.zIndex || 0);
      const finishInfo = {
        complete: true,
        loadMap: 'success',
        stage: this.stage,
        layer: this.layer,
        configMapImg: this.configMapImg,
      };
      if (callback && typeof callback === 'function') {
        callback(finishInfo);
      }
      this.mapImg.on("click", (evt) => { // 点击开始
        let dragType = {
          dragName: 'click', // 点击事件名称
          dragIcon: 'map', // 点击元素类型
        };
        evt.cancelBubble = true;
        if (mapDragFun && typeof mapDragFun === 'function') {
          mapDragFun(this.configMapImg, evt, dragType);
          // console.log('地图图片容器的点击事件', item, evt, dragType);
        }
      });
      this.mapImg.on("mousemove", (evt) => { // 鼠标移动进入地图图片范围
        const dragType = {
          dragName: 'mousemove', // 鼠标移动事件名称
          dragIcon: 'map', // 点击元素类型
        };
        evt.cancelBubble = true;
        if (mapDragFun && typeof mapDragFun === 'function') {
          mapDragFun(this.configMapImg, evt, dragType);
          // console.log('鼠标移动进入进入地图图片范围事件', this.configMapImg, evt, dragType);
        }
        // console.log('鼠标移动进入进入地图图片范围', this.configMapImg, evt, dragType);
      });
      this.mapImg.on("dragstart", (evt) => { // 点击开始
        this.mapDragend = false;
        let dragType = {
          dragName: 'dragstart', // 拖拽开始事件名称
          dragIcon: 'map', // 拖拽开始元素类型
        };
        evt.cancelBubble = true;
        if (mapDragFun && typeof mapDragFun === 'function') {
          mapDragFun(this.configMapImg, evt, dragType);
          // console.log('地图图片容器的点击事件', item, evt, dragType);
        }
      });
      this.mapImg.on("dragmove", (evt) => { // 点击开始
        let dragType = {
          dragName: 'dragmove', // 拖拽移动名称
          dragIcon: 'map', // 拖拽移动元素类型
        };
        evt.cancelBubble = true;
        if (mapDragFun && typeof mapDragFun === 'function') {
          mapDragFun(this.configMapImg, evt, dragType);
          // console.log('地图图片容器的点击事件', item, evt, dragType);
        }
      });
      this.mapImg.on("dragend", (evt) => { // 点击开始
        if (this.mapDragend) return;
        this.mapDragend = true;
        let dragType = {
          dragName: 'dragend', // 拖拽结束事件名称
          dragIcon: 'map', // 拖拽结束元素类型
        };
        evt.cancelBubble = true;
        if (mapDragFun && typeof mapDragFun === 'function') {
          mapDragFun(this.configMapImg, evt, dragType);
          // console.log('地图图片容器的点击事件', item, evt, dragType);
        }
      });
      this.stage.draw();
      let canMove = true; // 允许画布拖动
      let canScrollWheelZoom = true;
      this.enableCanvasDragging({}, canMove, mapDragFun); // 允许画布拖动
      this.enableScrollWheelZoom({}, canScrollWheelZoom, (finishInfo) => {
        if (wheelZoomFun && typeof wheelZoomFun === 'function') {
          wheelZoomFun(finishInfo);
          // console.log('地图图片容器缩放', finishInfo);
          // console.log('地图图片容器的点击事件', item, evt, dragType);
        }
      }); // 允许滚轮缩放
    };
    imageObj.src = options.mapImgConfig.iconSrc;
    this.stage.draw();
    // console.log('初始化舞台，参数属性, 地图图片1111', Kinetic, T, this.configMapImg);
  }
  // 添加矩形点
  addPoint(options, rectDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      rectPointGroup: this.rectPointGroup,
    };
    let canMove = false; // 是否能拖动画布
    let pointArray = options.lineArray || [];
    !this.rectPointGroup && (this.rectPointGroup = new Kinetic.Group()); // 创建group对象
    // !this.pointTextGroup && (this.pointTextGroup = new Kinetic.Group()); // 创建group对象
    pointArray.length && pointArray.forEach((item, k) => {
      this.configPoint = commonPointData(item.pointConfig);
      this.configPoint.item = item.pointConfig.item;
      this.configPoint.isVisible = (item.pointConfig.isVisible !== false);
      this.configPoint.isTwinkle = item.pointConfig.isTwinkle;
      this.configPoint.isDelete = item.pointConfig.isDelete;
      this.configPoint.index = item.pointConfig.index;
      this.configPoint.zIndex = item.pointConfig.zIndexLinePoint || 1;
      // let rectangleItem = new Kinetic.Label({
      //   id: 'label' + item.pointConfig.id || 'poit_id',
      //   name: 'label' + item.pointConfig.name || "pointLabel",
      //   x: item.pointConfig.point.x - 30 || 0,
      //   y: item.pointConfig.point.y + 16 || 0,
      //   // visible: item.pointConfig.visible !== false, // 图标元素的提示信息显示隐藏，若未设置，默认显示
      //   opacity: 0.75,
      //   visible: item.pointConfig.visible === true,
      // });
      // rectangleItem.add(new Kinetic.Tag({
      //   name: 'tag' + item.pointConfig.name || "pointLabelTag",
      //   fill: 'black',
      //   // pointerDirection: pDirect || 'down',
      //   pointerWidth: 10,
      //   pointerHeight: 10,
      //   lineJoin: 'round',
      //   shadowColor: 'black',
      //   shadowBlur: 10,
      //   shadowOffset: {
      //     x: 0,
      //     y: 0
      //   },
      //   visible: item.pointConfig.tooltipVisible !== false, // 图标元素的提示信息显示隐藏，若未设置，默认显示
      //   shadowOpacity: 0.5,
      // }));
      // rectangleItem.add(new Kinetic.Text({
      //   name: 'text' + item.pointConfig.name || "pointLabelText",
      //   x: item.pointConfig.point.x - 28 || 0,
      //   y: item.pointConfig.point.y + 24 || 0,
      //   opacity: (item.pointConfig.text && item.pointConfig.text.opacity) || 1,
      //   text: (item.pointConfig.relativePos || 0) + 'm',
      //   fontFamily: (item.pointConfig.text && item.pointConfig.text.fontFamily) || '"Myriad Set Pro","Helvetica Neue","Helvetica,verdana, geneva, arial, helvetica, sans-serif',
      //   fontSize: (item.pointConfig.text && item.pointConfig.text.fontSize) || 14,
      //   padding: (item.pointConfig.text && item.pointConfig.text.padding) || 8,
      //   fontWeight: (item.pointConfig.text && item.pointConfig.text.fontWeight) || 'bold',
      //   fill: (item.pointConfig.text && item.pointConfig.text.fill) || '#DDDDDD',
      //   align: 'center'
      //   // stroke: "rgba(0,0,0)",
      // }));
      this.rectPoint = new Kinetic.Rect(this.configPoint);
      this.rectPointGroup.add(this.rectPoint); // 把多个点对象添加到group里
      // this.pointTextGroup.add(rectangleItem); // 把多个图形对象添加到group里
      this.layer.add(this.rectPointGroup); // 把group对象添加到层里
      // this.layer.add(this.pointTextGroup); // 把group对象添加到层里
      this.rectPointGroup.setZIndex(item.pointConfig.zIndexLinePoint || 1); // 设定点对象的ZIndex值
      // this.pointTextGroup.setZIndex((item.pointTextConfig && item.pointTextConfig.zIndex) || 2); // 设定层的ZIndex值
      this.rectPoint.on("click", (evt) => { // 拖拽开始
        const dragType = {
          dragName: 'click', // 点击事件名称
          dragIcon: 'point', // 点击元素类型
        };
        evt.cancelBubble = true;
        this.enableCanvasDragging({}, canMove);
        // this.pointDragDealFun(Kinetic, item, evt, dragType, stageData);
        if (rectDragFun && typeof rectDragFun === 'function') {
          rectDragFun(item, evt, dragType);
          // console.log('点位元素的点击事件', item, evt, dragType);
        }
        // console.log('点位元素，点击开始', evt);
      });
      this.rectPoint.on("dragstart", (evt) => { // 拖拽开始
        this.rectPointDragend = false;
        const dragType = {
          dragName: 'dragstart', // 拖动事件名称
          dragIcon: 'point', // 拖动元素类型
        };
        evt.cancelBubble = true;
        this.enableCanvasDragging({}, canMove);
        // this.pointDragDealFun(Kinetic, item, evt, dragType, stageData);
        if (rectDragFun && typeof rectDragFun === 'function') {
          rectDragFun(item, evt, dragType);
          // console.log('点位元素的拖动事件', item, evt, dragType);
        }
        // console.log('点位元素，拖拽开始');
      });
      this.rectPoint.on("dragmove", (evt) => { // 拖拽中
        const dragType = {
          dragName: 'dragmove', // 拖动事件名称
          dragIcon: 'point', // 拖动元素类型
        };
        evt.cancelBubble = true;
        // window.event.cancelBubble = true;
        this.enableCanvasDragging({}, canMove);
        // this.pointDragDealFun(Kinetic, item, evt, dragType, stageData);
        if (evt.target.attrs.x < 8) {
          evt.target.attrs.x = 8;
        }
        if (evt.target.attrs.x > (this.layer.getWidth() - 12)) {
          evt.target.attrs.x = this.layer.getWidth() - 12;
        }
        if (evt.target.attrs.y < 8) {
          evt.target.attrs.y = 8;
        }
        if (evt.target.attrs.y > (this.layer.getHeight() - 14)) {
          evt.target.attrs.y = this.layer.getHeight() - 14;
        }
        if (rectDragFun && typeof rectDragFun === 'function') {
          rectDragFun(item, evt, dragType);
          // console.log('点位元素的拖动事件', item, evt, dragType);
        }
        // console.log('点位元素，拖拽中', this.layer.getWidth(), this.layer.getX(), this.layer.getY());
      });
      this.rectPoint.on("dragend", (evt) => { // 拖拽结束
        // evt.target.attrs.listening = false;
        if (this.rectPointDragend) return;
        this.rectPointDragend = true;
        const dragType = {
          dragName: 'dragend', // 拖动事件名称
          dragIcon: 'point', // 拖动元素类型
        };
        evt.cancelBubble = true;
        this.enableCanvasDragging({}, canMove);
        if (rectDragFun && typeof rectDragFun === 'function') {
          rectDragFun(item, evt, dragType);
          // console.log('点位元素的拖动事件', item, evt, dragType);
        }
        // console.log('点位元素，拖拽结束');
      });
      this.rectPoint.on("mousedown", (evt) => { // 鼠标按下矩形点范围
        this.mousedownX = evt.evt.offsetX;
        this.mousedownY = evt.evt.offsetY;
        const dragType = {
          dragName: 'mousedown', // 鼠标按下事件名称
          dragIcon: 'point', // 点击元素类型
        };
        evt.cancelBubble = true;
        if (rectDragFun && typeof rectDragFun === 'function') {
          rectDragFun(item, evt, dragType);
          // console.log('鼠标按下矩形点范围事件', item, evt, dragType);
        }
        // console.log('鼠标按下矩形点范围', item, evt, dragType);
      });
      this.rectPoint.on("mouseup", (evt) => { // 鼠标弹起矩形点范围
        this.mouseupX = evt.evt.offsetX;
        this.mouseupY = evt.evt.offsetY;
        let dragType = {
          dragName: 'mouseup', // 鼠标弹起事件名称
          dragIcon: 'point', // 点击元素类型
        };
        evt.cancelBubble = true;
        if (this.mouseupX !== this.mousedownX || this.mouseupY !== this.mousedownY) {
          dragType = {
            dragName: 'dragend', // 鼠标拖拽结束事件名称
            dragIcon: 'point', // 点击元素类型
          };
          // console.log('鼠标拖拽结束矩形点范围', item, evt, dragType);
        } else {
          dragType = {
            dragName: 'click', // 点击事件名称
            dragIcon: 'point', // 点击元素类型
          };
          // console.log('鼠标弹起矩形点范围', item, evt, dragType);
        }
        if (rectDragFun && typeof rectDragFun === 'function') {
          rectDragFun(item, evt, dragType);
          // console.log('鼠标弹起矩形点范围事件', item, evt, dragType);
        }
      });
      this.stage.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  };
  // 更新矩形点
  updatePoint(options = {}) {
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findPointId = item.pointConfig.id;
      let findPointObj = this.rectPointGroup.get('#' + findPointId)[0];
      if (findPointObj) {
        // console.log('更新点', updateArray, findPointId, findPointObj);
        item.pointConfig.point.x && (findPointObj.attrs.x = item.pointConfig.point.x);
        item.pointConfig.point.y && (findPointObj.attrs.y = item.pointConfig.point.y);
        // findPointObj.attrs.visible = (item.pointConfig.visible !== false);
        item.pointConfig.point && findPointObj.setPosition({
          x: item.pointConfig.point.x,
          y: item.pointConfig.point.y,
        });
        item.pointConfig.offset && findPointObj.setOffset({
          x: (item.pointConfig.offset && item.pointConfig.offset.x) || 8,
          y: (item.pointConfig.offset && item.pointConfig.offset.y) || 8,
        });
        if (item.pointConfig.visible === false || item.pointConfig.visible === true) {
          findPointObj.attrs.visible = (item.pointConfig.visible !== false);
          findPointObj.setVisible(item.pointConfig.visible !== false);
        }
        // findPointObj.setVisible(item.pointConfig.visible !== false);
        item.pointConfig.zIndexLinePoint && this.rectPointGroup.setZIndex(item.pointConfig.zIndexLinePoint || 1); // 设定点对象的ZIndex值
        findPointObj.attrs.item = item.pointConfig.item;
        // this.stage.draw();
      }
      this.layer.draw();
    });
    this.stage.draw();
  };
  // 删除矩形点
  deletePoint(options = {}) {
    let deleteArray = options.deleteArray || [];
    (deleteArray.length !== 0) && deleteArray.forEach((item, k) => {
      // let findPointId = item.id;
      // let findRectPointObj = this.rectPointGroup.get('#' + findPointId)[0];
      let findRectPointName = item.rectPointName;
      let findRectPointObj = this.rectPointGroup && this.rectPointGroup.get('.' + findRectPointName);
      // console.log('删除点', this.rectPointGroup, deleteArray, findRectPointName, findRectPointObj);
      findRectPointObj && findRectPointObj.remove();
      this.stage.draw();
    });
    this.stage.draw();
  };
  // 添加点的旁边标注小框
  addRectTextPoint(options, rectDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      rectPointGroup: this.rectPointGroup,
    };
    // let canMove = false; // 是否能拖动画布
    let pointArray = options.lineArray || [];
    !this.pointTextGroup && (this.pointTextGroup = new Kinetic.Group()); // 创建group对象
    pointArray.length && pointArray.forEach((item, k) => {
      let rectangleItem = new Kinetic.Label({
        id: 'label' + item.pointConfig.id || 'poit_id',
        name: 'label' + item.pointConfig.name || "pointLabel",
        x: item.pointConfig.point.x - 30 || 0,
        y: item.pointConfig.point.y + 16 || 0,
        // visible: item.pointConfig.visible !== false, // 图标元素的提示信息显示隐藏，若未设置，默认显示
        opacity: 0.75,
        visible: item.pointConfig.visible !== false,
      });
      rectangleItem.add(new Kinetic.Tag({
        name: 'tag' + item.pointConfig.name || "pointLabelTag",
        fill: 'black',
        // pointerDirection: pDirect || 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {
          x: 0,
          y: 0
        },
        visible: item.pointConfig.tooltipVisible !== false, // 图标元素的提示信息显示隐藏，若未设置，默认显示
        shadowOpacity: 0.5,
      }));
      rectangleItem.add(new Kinetic.Text({
        name: 'text' + item.pointConfig.name || "pointLabelText",
        x: item.pointConfig.point.x - 28 || 0,
        y: item.pointConfig.point.y + 24 || 0,
        opacity: (item.pointConfig.text && item.pointConfig.text.opacity) || 1,
        text: (item.pointConfig.relativePos || 0) + 'm',
        fontFamily: (item.pointConfig.text && item.pointConfig.text.fontFamily) || '"Myriad Set Pro","Helvetica Neue","Helvetica,verdana, geneva, arial, helvetica, sans-serif',
        fontSize: (item.pointConfig.text && item.pointConfig.text.fontSize) || 14,
        padding: (item.pointConfig.text && item.pointConfig.text.padding) || 8,
        fontWeight: (item.pointConfig.text && item.pointConfig.text.fontWeight) || 'bold',
        fill: (item.pointConfig.text && item.pointConfig.text.fill) || '#DDDDDD',
        align: 'center'
        // stroke: "rgba(0,0,0)",
      }));
      this.pointTextGroup.add(rectangleItem); // 把多个图形对象添加到group里
      this.layer.add(this.pointTextGroup); // 把group对象添加到层里
      this.pointTextGroup.setZIndex((item.pointTextConfig && item.pointTextConfig.zIndex) || 2); // 设定层的ZIndex值
      this.stage.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  };
  // 更新点的旁边标注小框
  updateRectTextPoint(options = {}) {
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findRectTextPointId = item.pointConfig.id;
      let findRectTextPointObj = this.pointTextGroup && this.pointTextGroup.get('#label' + findRectTextPointId)[0];
      // console.log('更新点旁边标注小框', updateArray, findRectTextPointId, findRectTextPointObj);
      if (findRectTextPointObj) {
        item.pointConfig.point.x && (findRectTextPointObj.attrs.x = (item.pointConfig.point.x - 30));
        item.pointConfig.point.y && (findRectTextPointObj.attrs.y = (item.pointConfig.point.y + 16));
        if (item.pointConfig.visible === false || item.pointConfig.visible === true) {
          findRectTextPointObj.attrs.visible = item.pointConfig.visible;
          findRectTextPointObj.setVisible(item.pointConfig.visible);
        }
        item.pointConfig.point && findRectTextPointObj.setPosition({
          x: (item.pointConfig.point.x - 30),
          y: (item.pointConfig.point.y + 16),
        });
        // item.pointConfig.offset && findRectTextPointObj.setOffset({
        //     x: (item.pointConfig.offset && item.pointConfig.offset.x) || 8,
        //     y: (item.pointConfig.offset && item.pointConfig.offset.y) || 8,
        // });
        // findRectTextPointObj.setVisible(item.pointConfig.visible !== false);
        this.stage.draw();
      }
    });
    this.stage.draw();
  }
  // 删除矩形点旁边的小标注
  deleteRectTextPoint(options = {}) {
    let deleteArray = options.deleteArray || [];
    deleteArray.length && deleteArray.forEach((item, k) => {
      // let findLineId = item.id;
      // let findLineObj = this.pointTextGroup.get('#' + findLineId);
      let findRectTextName = item.rectTextName;
      let findLineObj = this.pointTextGroup && this.pointTextGroup.get('.' + findRectTextName);
      // console.log('删除矩形点旁边的小标注', this.pointTextGroup, deleteArray, findRectTextName, findLineObj);
      findLineObj && findLineObj.remove();
      findLineObj && findLineObj.removeChildren();
      this.stage.draw();
    });
    this.stage.draw();
  }
  // 添加折线段
  addLine(options, lineDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      lineAreaGroup: this.lineAreaGroup,
    };
    let lineArray = options.lineArray || [];
    !this.lineAreaGroup && (this.lineAreaGroup = new Kinetic.Group()); // 创建group对象
    (lineArray.length !== 0) && lineArray.forEach((item, k) => {
      this.configLine = commonLineData(item.lineConfig);
      this.configLine.isVisible = (item.lineConfig.isVisible !== false);
      if (item.lineConfig.isTwinkle) {
        let configLineTemp = commonAlarmLineData(item.lineConfig);
        item.lineConfig.visible = (item.lineConfig.visible !== false);
        this.configLine.visible = (item.lineConfig.visible !== this.isAlarmAnimation);
        this.configLine.strokeWidth = configLineTemp.strokeWidth;
      }
      this.configLine.isTwinkle = item.lineConfig.isTwinkle;
      this.configLine.isDelete = item.lineConfig.isDelete;
      this.configLine.zIndex = item.lineConfig.zIndexLine;
      this.configLine.item = item.lineConfig.item;
      this.lineAreaPoint = new Kinetic.Line(this.configLine);
      this.lineAreaGroup.add(this.lineAreaPoint); // 把多个线段对象添加到group里
      this.layer.add(this.lineAreaGroup); // 把group对象添加到层里
      this.lineAreaGroup.setZIndex(item.lineConfig.zIndexLine || 2); // 设定线段对象的ZIndex值
      // this.stage.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 更新折线段
  updateLine(options, lineDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      lineAreaGroup: this.lineAreaGroup,
    };
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findLineId = item.lineConfig.id;
      let findLineObj = this.lineAreaGroup.get('#' + findLineId)[0];
      // let findLineObj = this.lineAreaGroup.get('.linenormal' + findLineId);
      // console.log('更新线段', updateArray, findLineId, findLineObj);
      if (findLineObj) {
        item.lineConfig.stroke && (findLineObj.attrs.stroke = item.lineConfig.stroke);
        (item.lineConfig.points && item.lineConfig.points.length === 4) && (findLineObj.attrs.points = item.lineConfig.points);
        // findLineObj.attrs.visible = (item.lineConfig.visible !== false);
        item.lineConfig.stroke && (findLineObj.setStroke(item.lineConfig.stroke));
        (item.lineConfig.points && item.lineConfig.points.length === 4) && (findLineObj.setPoints(item.lineConfig.points));
        if (item.lineConfig.visible === false || item.lineConfig.visible === true) {
          findLineObj.attrs.visible = (item.lineConfig.visible !== false);
          findLineObj.setVisible(item.lineConfig.visible !== false);
          if (item.lineConfig.isTwinkle) {
            let configLineTemp = commonAlarmLineData(item.lineConfig);
            findLineObj.attrs.strokeWidth = configLineTemp.strokeWidth;
            findLineObj.setStrokeWidth(configLineTemp.strokeWidth);
            findLineObj.attrs.visible = (item.lineConfig.visible !== this.isAlarmAnimation);
            findLineObj.setVisible(item.lineConfig.visible !== this.isAlarmAnimation);
          }
        }
        if (item.lineConfig.isVisible === false || item.lineConfig.isVisible === true) {
          findLineObj.attrs.isTwinkle = item.lineConfig.isTwinkle;
        }
        if (item.lineConfig.isTwinkle === false || item.lineConfig.isTwinkle === true) {
          findLineObj.attrs.isTwinkle = item.lineConfig.isTwinkle;
        }
        if (item.lineConfig.isDelete === false || item.lineConfig.isDelete === true) {
          findLineObj.attrs.isDelete = item.lineConfig.isDelete;
        }
        // findLineObj.setVisible(item.lineConfig.visible !== false);
        item.lineConfig.zIndexLine && this.lineAreaGroup.setZIndex(item.lineConfig.zIndexLine || 2); // 设定线段对象的ZIndex值
        findLineObj.attrs.item = item.lineConfig.item;
        // this.stage.draw();
        // this.layer.draw();
      }
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 删除折线段
  deleteLine(options, lineDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      lineAreaGroup: this.lineAreaGroup,
    };
    let deleteArray = options.deleteArray || [];
    deleteArray.length && deleteArray.forEach((item, k) => {
      // let findLineId = item.id;
      // let findLineObj = this.lineAreaGroup.get('#' + findLineId);
      let findLineName = item.name;
      let findLineObj = this.lineAreaGroup && this.lineAreaGroup.get('.' + findLineName);
      findLineObj && findLineObj.remove();
      // this.stage.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 添加图标点
  addMark(options, markDragFun, callback) {
    // const T = this;
    const finishInfo = {
      complete: true,
      loadMap: 'success',
    };
    let canMove = false; // 是否能拖动画布
    let markTwinkle = false;
    let markArray = options.markArray || [];
    !this.markGroup && (this.markGroup = new Kinetic.Group()); // 创建group对象
    // console.log('9999999', this, T);
    markArray.length && markArray.forEach((item, k) => {
      this.configMarkImg = commonMarkImgData(item.markConfig);
      // this.configMarkImg.image = imageObj;
      // this.configMarkImg.item = item.markConfig.item;
      let configMarkImg = commonMarkImgData(item.markConfig);
      let imageObj = new Image();
      configMarkImg.image = imageObj;
      configMarkImg.isVisible = (item.markConfig.isVisible !== false);
      if (item.markConfig.isTwinkle) {
        item.markConfig.visible = (item.markConfig.visible !== false);
        configMarkImg.visible = (item.markConfig.visible !== this.isAlarmAnimation);
      }
      markTwinkle = item.markConfig.isTwinkle;
      configMarkImg.isTwinkle = item.markConfig.isTwinkle;
      configMarkImg.isDelete = item.markConfig.isDelete;
      configMarkImg.zIndex = item.markConfig.zIndexMark;
      configMarkImg.item = item.markConfig.item;
      imageObj.onload = () => {
        this.rectMarkImg = new Kinetic.Image(configMarkImg);
        this.markGroup.add(this.rectMarkImg); // 把多个图标点对象添加到group里
        this.layer.add(this.markGroup); // 把group对象添加到层里
        this.stage.add(this.layer);
        this.markGroup.setZIndex(configMarkImg.zIndex || 30); // 设定图标点对象的ZIndex值
        this.rectMarkImg.on("click", (evt) => { // 拖拽开始
          const dragType = {
            dragName: 'click_origin', // 点击事件名称
            dragIcon: 'mark', // 点击元素类型
          };
          evt.cancelBubble = true;
          this.enableCanvasDragging({}, canMove);
          // this.markDragDealFun(Kinetic, item, evt, dragType);
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('mark图标元素的点击事件', item, evt, dragType);
          }
          // console.log('mark图标元素，点击开始', evt);
        });
        this.rectMarkImg.on("dblclick", (evt) => { // 拖拽开始
          this.markClickEnd = true;
          const dragType = {
            dragName: 'dblclick_origin', // 双击事件名称
            dragIcon: 'mark', // 双击元素类型
          };
          evt.cancelBubble = true;
          this.enableCanvasDragging({}, canMove);
          // this.markDragDealFun(Kinetic, item, evt, dragType);
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('mark图标元素的双击事件', item, evt, dragType);
          }
          // console.log('mark图标元素，点击开始', evt);
        });
        this.rectMarkImg.on("dragstart", (evt) => { // 拖拽开始
          this.markDragend = false;
          const dragType = {
            dragName: 'dragstart', // 拖动事件名称
            dragIcon: 'mark', // 拖动元素类型
          };
          evt.cancelBubble = true;
          this.enableCanvasDragging({}, canMove);
          // this.markDragDealFun(Kinetic, item, evt, dragType, temStageInfo);
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('mark图标元素的拖动事件', item, evt, dragType);
          }
          // console.log('mark图标元素，拖拽开始', evt);
        });
        this.rectMarkImg.on("dragmove", (evt) => { // 拖拽中
          const dragType = {
            dragName: 'dragmove', // 拖动事件名称
            dragIcon: 'mark', // 拖动元素类型
          };
          evt.cancelBubble = true;
          // window.event.cancelBubble = true;
          this.enableCanvasDragging({}, canMove);
          // this.markDragDealFun(Kinetic, item, evt, dragType, temStageInfo);
          if (evt.target.attrs.x < 20) {
            evt.target.attrs.x = 21;
          }
          if (evt.target.attrs.x > (this.layer.getWidth() - 21)) {
            evt.target.attrs.x = this.layer.getWidth() - 21;
          }
          if (evt.target.attrs.y < 26) {
            evt.target.attrs.y = 26;
          }
          if (evt.target.attrs.y > (this.layer.getHeight() - 26)) {
            evt.target.attrs.y = this.layer.getHeight() - 26;
          }
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('mark图标元素的拖动事件', item, evt, dragType);
          }
          // console.log('mark图标元素，拖拽中', evt);
        });
        this.rectMarkImg.on("dragend_origin", (evt) => { // 拖拽结束
          if (this.markDragend) return;
          this.markDragend = true;
          const dragType = {
            dragName: 'dragend', // 拖动事件名称
            dragIcon: 'mark', // 拖动元素类型
          };
          evt.cancelBubble = true;
          this.enableCanvasDragging({}, canMove);
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('mark图标元素的拖拽结束事件', item, evt, dragType);
          }
          // console.log('mark图标元素，拖拽结束', evt);
        });
        this.rectMarkImg.on("mousedown", (evt) => { // 鼠标按下mark图标范围
          // this.markClickEnd = false;
          if (this.markClickCount === 0) {
            // this.markClickEndInterval = setTimeout(() => this.countMark(), 300);
          }
          markTwinkle = evt.target.attrs.isTwinkle;
          if (markTwinkle) {
            evt.target.attrs.isTwinkle = false;
          }
          this.markClickCount++;
          this.mousedownX = evt.evt.offsetX;
          this.mousedownY = evt.evt.offsetY;
          const dragType = {
            dragName: 'mousedown', // 鼠标按下事件名称
            dragIcon: 'mark', // 点击元素类型
          };
          evt.cancelBubble = true;
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('鼠标按下mark图标范围事件', item, evt, dragType);
          }
          // console.log('鼠标按下mark图标范围', item, evt, dragType);
        });
        this.rectMarkImg.on("mousemove", (evt) => { // 鼠标移动进入mark图标范围
          const dragType = {
            dragName: 'mousemove', // 鼠标移动事件名称
            dragIcon: 'mark', // 点击元素类型
          };
          evt.cancelBubble = true;
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('鼠标移动进入mark图标范围事件', item, evt, dragType);
          }
          // console.log('鼠标移动进入mark图标范围', item, evt, dragType);
        });
        this.rectMarkImg.on("mouseout", (evt) => { // 鼠标离开mark图标范围
          const dragType = {
            dragName: 'mouseout', // 鼠标移动事件名称
            dragIcon: 'mark', // 点击元素类型
          };
          evt.cancelBubble = true;
          if (markDragFun && typeof markDragFun === 'function') {
            markDragFun(item, evt, dragType);
            // console.log('鼠标移动进入mark图标范围事件', item, evt, dragType);
          }
          // console.log('鼠标离开mark图标范围', item, evt, dragType);
        });
        this.rectMarkImg.on("mouseup", (evt) => { // 鼠标弹起mark图标范围
          if (markTwinkle) {
            evt.target.attrs.isTwinkle = true;
            markTwinkle = false;
          }
          this.mouseupX = evt.evt.offsetX;
          this.mouseupY = evt.evt.offsetY;
          let dragType = {
            dragName: 'mouseup', // 鼠标弹起事件名称
            dragIcon: 'mark', // 点击元素类型
          };
          evt.cancelBubble = true;
          if (this.mouseupX !== this.mousedownX || this.mouseupY !== this.mousedownY) {
            dragType = {
              dragName: 'dragend', // 鼠标拖拽结束事件名称
              dragIcon: 'mark', // 点击元素类型
            };
            if (markDragFun && typeof markDragFun === 'function') {
              // if (this.markDragend) return;
              markDragFun(item, evt, dragType);
              this.mousedownX = 0;
              this.mousedownY = 0;
              this.mouseupX = 0;
              this.mouseupY = 0;
              // console.log('鼠标弹起mark图标范围事件', item, evt, dragType);
            }
            // console.log('鼠标拖拽结束mark图标范围', item, evt, dragType);
          } else {
            dragType = {
              dragName: 'dbclick', // 点击事件名称
              dragIcon: 'mark', // 点击元素类型
            };
            if (this.markClickCount !== 2) {
              this.markClickEndInterval = setTimeout(() => {
                dragType = {
                  dragName: 'click', // 点击事件名称
                  dragIcon: 'mark', // 点击元素类型
                };
                if (markDragFun && typeof markDragFun === 'function') {
                  // if (this.markDragend) return;
                  markDragFun(item, evt, dragType);
                  this.markClickCount = 0;
                  this.markClickEndInterval && window.clearTimeout(this.markClickEndInterval);
                  // console.log('鼠标弹起mark图标范围事件', item, evt, dragType);
                }
              }, 200);
              // this.markClickEnd = true;
              // window.clearTimeout(this.markClickEndInterval);
              // console.log('鼠标单击点击弹起mark图标范围', this.markClickCount, item, evt, dragType);
            }
            if (this.markClickCount === 2) {
              dragType = {
                dragName: 'dbclick', // 双击事件名称
                dragIcon: 'mark', // 点击元素类型
              };
              // this.markClickEnd = true;
              this.markClickCount = 0;
              if (markDragFun && typeof markDragFun === 'function') {
                // if (this.markDragend) return;
                markDragFun(item, evt, dragType);
                // console.log('鼠标弹起mark图标范围事件', item, evt, dragType);
              }
              this.markClickEndInterval && window.clearTimeout(this.markClickEndInterval);
              // console.log('鼠标双击弹起mark图标范围', item, evt, dragType);
            }
            // console.log('鼠标点击弹起mark图标范围', item, evt, dragType);
          }
          // if (markDragFun && typeof markDragFun === 'function') {
          //   // if (this.markDragend) return;
          //   markDragFun(item, evt, dragType);
          //   // console.log('鼠标弹起mark图标范围事件', item, evt, dragType);
          // }
        });
      };
      imageObj.src = item.markConfig.iconSrc;
      this.stage.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
    // console.log('添加图标点', this);
  }
  countMark() {
    this.markClickCount = 0;
    // this.markClickEnd = true;
  }
  // 更新图标点
  updateMark(options = {}, callback) {
    let updateArray = options.updateArray || [];
    (updateArray.length !== 0) && updateArray.forEach((item, k) => {
      let findMarkId = item.markConfig.id;
      let findMarkObj = this.markGroup.get('#' + findMarkId)[0];
      // console.log('更新图标点', findMarkId, findMarkObj);
      if (findMarkObj) {
        let imageObj = new Image();
        findMarkObj && (findMarkObj.setImage(imageObj));
        imageObj.onload = () => {
          this.markGroup.setZIndex(item.markConfig.zIndexMark || 30); // 设定图标点对象的ZIndex值
          // findMarkObj && (findMarkObj.attrs.image = imageObj);
          // this.stage.draw();
        };
        imageObj.src = item.markConfig.iconSrc;
        findMarkObj.attrs.isDelete = item.markConfig.isDelete;
        item.markConfig.width && (findMarkObj.attrs.width = item.markConfig.width);
        item.markConfig.height && (findMarkObj.attrs.height = item.markConfig.height);
        item.markConfig.point && (findMarkObj.attrs.x = item.markConfig.point.x);
        item.markConfig.point && (findMarkObj.attrs.y = item.markConfig.point.y);
        item.markConfig.point && findMarkObj.setPosition({
          x: item.markConfig.point.x,
          y: item.markConfig.point.y,
        });
        item.markConfig.offset && findMarkObj.setOffset({
          x: (item.markConfig.offset && item.markConfig.offset.x) || 20,
          y: (item.markConfig.offset && item.markConfig.offset.y) || 26,
        });
        if (item.markConfig.visible === false || item.markConfig.visible === true) {
          findMarkObj.attrs.visible = item.markConfig.visible;
          findMarkObj.setVisible(item.markConfig.visible);
          if (item.markConfig.isTwinkle) {
            findMarkObj.attrs.visible = (item.markConfig.visible !== this.isAlarmAnimation);
            findMarkObj.setVisible(item.markConfig.visible !== this.isAlarmAnimation);
          }
        }
        if (item.markConfig.isVisible === false || item.markConfig.isVisible === true) {
          findMarkObj.attrs.isVisible = item.markConfig.isVisible;
        }
        if (item.markConfig.isTwinkle === false || item.markConfig.isTwinkle === true) {
          findMarkObj.attrs.isTwinkle = item.markConfig.isTwinkle;
        }
        if (item.markConfig.isDelete === false || item.markConfig.isDelete === true) {
          findMarkObj.attrs.isDelete = item.markConfig.isDelete;
        }
        // findMarkObj.attrs.visible = (item.markConfig.visible !== false);
        // findMarkObj.setVisible(item.markConfig.visible !== false);
        // findMarkObj.setZIndex(item.markConfig.zIndexMark || 30); // 设定图标点对象的ZIndex值
        this.markGroup.setZIndex(item.markConfig.zIndexMark || 30); // 设定图标点对象的ZIndex值
        findMarkObj.attrs.item = item.markConfig.item;
        // this.stage.draw();
        this.layer.draw();
      }
    });
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      updateArray: options.updateArray,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 删除图标点
  deleteMark(options = {}, callback) {
    let deleteArray = options.deleteArray || [];
    (deleteArray.length !== 0) && deleteArray.forEach((item, k) => {
      let findMarkId = item.id;
      let findMarkObj = this.markGroup && this.markGroup.get('#' + findMarkId)[0];
      findMarkObj && findMarkObj.remove();
      this.stage.draw();
    });
    const finishInfo = {
      complete: true,
      deleteMark: 'success',
      stage: this.stage,
      layer: this.layer,
      markGroup: this.markGroup,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 添加扇形
  addWedge(options = {}, markDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
    };
    // let canMove = false; // 是否能拖动画布
    let wedgeArray = options.wedgeArray || [];
    !this.wedgePointGroup && (this.wedgePointGroup = new Kinetic.Group()); // 创建group对象
    wedgeArray.length && wedgeArray.forEach((item, k) => {
      this.configWedge = commonWedgeData(item.wedgeConfig);
      this.configWedge.zIndex = item.wedgeConfig.zIndexWedge || 16;
      this.wedgePoint = new Kinetic.Wedge(this.configWedge);
      this.wedgePointGroup.add(this.wedgePoint); // 把多个扇形对象添加到group里
      this.layer.add(this.wedgePointGroup); // 把group对象添加到层里
      this.wedgePointGroup.setZIndex(this.configWedge.zIndex || 16);
      this.layer.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 更新扇形
  updateWedge(options = {}, callback) {
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findWedgeId = item.wedgeConfig.id;
      let findWedgeObj = this.wedgePointGroup.get('#' + findWedgeId)[0];
      // console.log('更新扇形', findWedgeId, findWedgeObj);
      if (findWedgeObj) {
        item.wedgeConfig.point.x && (findWedgeObj.attrs.x = item.wedgeConfig.point.x);
        item.wedgeConfig.point.y && (findWedgeObj.attrs.y = item.wedgeConfig.point.y);
        findWedgeObj.attrs.visible = (item.wedgeConfig.visible !== false);
        item.wedgeConfig.point && findWedgeObj.setPosition({
          x: item.wedgeConfig.point.x,
          y: item.wedgeConfig.point.y,
        });
        // item.wedgeConfig.offset && findWedgeObj.setOffset({
        //     x: (item.wedgeConfig.offset && item.wedgeConfig.offset.x) || 8,
        //     y: (item.wedgeConfig.offset && item.wedgeConfig.offset.y) || 8,
        // });
        findWedgeObj.setVisible(item.wedgeConfig.wedgeVisible !== false);
        findWedgeObj.setZIndex(item.wedgeConfig.zIndexWedge || 16); // 设定点对象的ZIndex值
        // item.wedgeConfig.zIndexWedge && this.wedgePointGroup.setZIndex(item.wedgeConfig.zIndexWedge || 16); // 设定点对象的ZIndex值
        this.wedgePointGroup.setZIndex(item.wedgeConfig.zIndexWedge || 16); // 设定点对象的ZIndex值
        findWedgeObj.attrs.item = item.wedgeConfig.item;
        this.stage.draw();
      }
    });
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      updateArray: options.updateArray,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
  }
  // 删除扇形
  deleteWedge(options = {}, callback) {
    let deleteArray = options.deleteArray || [];
    (deleteArray.length !== 0) && deleteArray.forEach((item, k) => {
      let findWedgeId = item.id;
      let findWedgeObj = this.wedgePointGroup.get('#wedge' + findWedgeId)[0];
      findWedgeObj && findWedgeObj.remove();
      this.stage.draw();
    });
    const finishInfo = {
      complete: true,
      deleteMark: 'success',
      stage: this.stage,
      layer: this.layer,
      wedgePointGroup: this.wedgePointGroup,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 清除地图的所有元素，包括地图的图片
  clearMapAll(callback) {
    this.mapImgGroup && this.mapImgGroup.removeChildren();
    this.mapImgGroup && this.mapImgGroup.remove();
    this.rectPointGroup && this.rectPointGroup.removeChildren();
    this.rectPointGroup && this.rectPointGroup.remove();
    this.pointTextGroup && this.pointTextGroup.removeChildren();
    this.pointTextGroup && this.pointTextGroup.remove();
    this.lineAreaGroup && this.lineAreaGroup.removeChildren();
    this.lineAreaGroup && this.lineAreaGroup.remove();
    this.markGroup && this.markGroup.removeChildren();
    this.markGroup && this.markGroup.remove();
    this.wedgePointGroup && this.wedgePointGroup.removeChildren();
    this.wedgePointGroup && this.wedgePointGroup.remove();
    this.startWedgeMarkGroup && this.startWedgeMarkGroup.removeChildren();
    this.startWedgeMarkGroup && this.startWedgeMarkGroup.remove();
    this.middleWedgeMarkGroup && this.middleWedgeMarkGroup.removeChildren();
    this.middleWedgeMarkGroup && this.middleWedgeMarkGroup.remove();
    this.endWedgeMarkGroup && this.endWedgeMarkGroup.removeChildren();
    this.endWedgeMarkGroup && this.endWedgeMarkGroup.remove();
    this.alarmLineAreaGroup && this.alarmLineAreaGroup.removeChildren();
    this.alarmLineAreaGroup && this.alarmLineAreaGroup.remove();
    rectDrawGroup && rectDrawGroup.removeChildren();
    rectDrawGroup && rectDrawGroup.remove();
    circleDrawGroup && circleDrawGroup.removeChildren();
    circleDrawGroup && circleDrawGroup.remove();
    polygonDrawGroup && polygonDrawGroup.removeChildren();
    polygonDrawGroup && polygonDrawGroup.remove();
    foldLineDrawGroup && foldLineDrawGroup.removeChildren();
    foldLineDrawGroup && foldLineDrawGroup.remove();
    this.stage.off("contentMousedown");
    this.stage.off("contentMousemove");
    this.stage.off("contentMouseup");
    const finishInfo = {
      complete: true,
      deleteMark: 'success',
      stage: this.stage,
      layer: this.layer,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
    // console.log('清除地图的所有元素，包括地图的图片', this);
  }
  // 清除地图的所有元素，地图的图片不清除
  clearMapItem() {
    this.rectPointGroup && this.rectPointGroup.removeChildren();
    this.rectPointGroup && this.rectPointGroup.remove();
    this.pointTextGroup && this.pointTextGroup.removeChildren();
    this.pointTextGroup && this.pointTextGroup.remove();
    this.lineAreaGroup && this.lineAreaGroup.removeChildren();
    this.lineAreaGroup && this.lineAreaGroup.remove();
    this.markGroup && this.markGroup.removeChildren();
    this.markGroup && this.markGroup.remove();
    this.wedgePointGroup && this.wedgePointGroup.removeChildren();
    this.wedgePointGroup && this.wedgePointGroup.remove();
    this.startWedgeMarkGroup && this.startWedgeMarkGroup.removeChildren();
    this.startWedgeMarkGroup && this.startWedgeMarkGroup.remove();
    this.middleWedgeMarkGroup && this.middleWedgeMarkGroup.removeChildren();
    this.middleWedgeMarkGroup && this.middleWedgeMarkGroup.remove();
    this.endWedgeMarkGroup && this.endWedgeMarkGroup.removeChildren();
    this.endWedgeMarkGroup && this.endWedgeMarkGroup.remove();
    this.alarmLineAreaGroup && this.alarmLineAreaGroup.removeChildren();
    this.alarmLineAreaGroup && this.alarmLineAreaGroup.remove();
    rectDrawGroup && rectDrawGroup.removeChildren();
    rectDrawGroup && rectDrawGroup.remove();
    circleDrawGroup && circleDrawGroup.removeChildren();
    circleDrawGroup && circleDrawGroup.remove();
    polygonDrawGroup && polygonDrawGroup.removeChildren();
    polygonDrawGroup && polygonDrawGroup.remove();
    foldLineDrawGroup && foldLineDrawGroup.removeChildren();
    foldLineDrawGroup && foldLineDrawGroup.remove();
    this.stage.off("contentMousedown");
    this.stage.off("contentMousemove");
    this.stage.off("contentMouseup");
    this.stage.draw();
  }
  // 获取舞台div信息
  getStageInfo() {
    let x = this.containerDiv.offsetLeft;
    let y = this.containerDiv.offsetTop;
    let width = this.containerDiv.offsetWidth;
    let height = this.containerDiv.offsetHeight;
    let transform = this.containerDiv.style.transform;
    let scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
    return {
      x,
      y,
      width,
      height,
      scale
    };
  };
  // 像素转坐标
  pixelToPoint(x, y, offset) {
    let point = {
      x: 0,
      y: 0
    };
    let stageInfo = this.getStageInfo();
    let pointX = (x - (stageInfo.x - (stageInfo.width * stageInfo.scale - stageInfo.width) / 2)) / stageInfo.scale;
    let pointY = (y - (stageInfo.y - (stageInfo.height * stageInfo.scale - stageInfo.height) / 2)) / stageInfo.scale;
    point = {
      x: pointX,
      y: pointY
    };
    if (offset) {
      point.x = point.x + offset.x;
      point.y = point.y + offset.y;
    }
    return point;
  };
  // 坐标转像素
  pointToPixel(point) {
    let stageInfo = this.getStageInfo();
    let pixel = {
      x: 0,
      y: 0
    };
    pixel.x = point.x * stageInfo.scale + (stageInfo.x - (stageInfo.width * stageInfo.scale - stageInfo.width) / 2);
    pixel.y = point.y * stageInfo.scale + (stageInfo.y - (stageInfo.height * stageInfo.scale - stageInfo.height) / 2);
    return pixel;
  }
  // 是否允许画布拖动
  enableCanvasDragging(stageData, canMove, callBack) {
    this.body = document.getElementsByTagName('body')[0];
    let callBackNew = callBack;
    // this.containerDiv && (this.canvas = document.getElementById(this.configMapStage.container).getElementsByTagName('canvas')[0]); // 当前页面，地图容器挂载<div>标签元素里的canvas标签元素对象
    // this.containerDiv = document.getElementById(stageData.container);
    if (canMove) {
      // console.log('允许画布拖动');
      this.containerDiv.addEventListener("mousedown", (e) => {
        let disX = e.clientX - this.containerDiv.offsetLeft;
        let disY = e.clientY - this.containerDiv.offsetTop;
        e.preventDefault();
        this.body.onmousemove = (ev) => {
          ev.preventDefault();
          let x = ev.clientX - disX;
          let y = ev.clientY - disY;
          this.containerDiv.style.left = x + 'px';
          this.containerDiv.style.top = y + 'px';
          // this.canvas.style.left = x + 'px';
          // this.canvas.style.top = y + 'px';
          this.temStageStyle = {
            x: x,
            y: y,
          };
          let dragType = {
            dragName: 'dragmove', // 拖拽结束事件名称
            dragIcon: 'map', // 拖拽结束元素类型
          };
          const finishInfo = {
            complete: true,
            loadMap: 'success',
            stage: this.stage,
            layer: this.layer,
            stageInfo: this.getStageInfo(),
            configMapImg: this.configMapImg,
          };
          callBackNew(finishInfo, ev, dragType);
        };
        // 鼠标弹起后停止移动
        this.body.onmouseup = (ev) => {
          this.body.onmousemove = null;
          this.body.onmouseup = null;
          let dragType = {
            dragName: 'dragend', // 拖拽结束事件名称
            dragIcon: 'map', // 拖拽结束元素类型
          };
          const finishInfo = {
            complete: true,
            loadMap: 'success',
            stage: this.stage,
            layer: this.layer,
            stageInfo: this.getStageInfo(),
            configMapImg: this.configMapImg,
          };
          callBackNew(finishInfo, ev, dragType);
        };
      }, false);
    }
    if (!canMove) {
      this.body.onmousemove = null;
      this.body.onmouseup = null;
      // console.log('不允许画布拖动');
      // this.containerDiv.removeEventListener("click, mousedown, mouseenter, mousemove", (e) => {}, false);
      // this.body.removeEventListener("mousemove, mouseup", (e) => {}, false);
    }
  }
  // 是否允许滚轮缩放
  enableScrollWheelZoom(stageData, canScrollWheelZoom, callBack) {
    // this.containerDiv = document.getElementById(stageData.container);
    let callBackNew = callBack;
    this.containerDiv.onmousewheel = (e) => {
      let transform = this.containerDiv.style.transform;
      this.scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
      this.scale += e.wheelDelta / 1200;
      if (this.scale > 0 && this.scale < 50) {
        this.containerDiv.style.transform = "scale(" + this.scale + ")";
        // 横纵方向等比例缩放
        this.stage.setScale(this.scale);
        this.stage.draw();
        // 分别制定横纵方向上的缩放比例
        // stage.setScale(scaleX, scaleY);
      }
      const finishInfo = {
        complete: true,
        loadMap: 'success',
        scale: this.scale,
      };
      if (callBackNew && typeof callBackNew === 'function') {
        callBackNew(finishInfo);
      }
    };
  }
  // 设置画布在容器里居中
  setCenter() {
    // this.body = document.getElementsByTagName('body')[0];
    // this.containerDiv = document.getElementById(temStageInfo.id || 'map-container');
    this.containerDiv.style.top = "";
    this.containerDiv.style.left = "";
    this.body.onmousemove = null;
    this.body.onmouseup = null;
  }
  // 设置画布在容器里，某个元素的大概位置居中
  setItemCenter(ItemCenter) {
    // this.body = document.getElementsByTagName('body')[0];
    // this.containerDiv = document.getElementById(temStageInfo.id || 'map-container');
    let transform = this.containerDiv.style.transform;
    if (ItemCenter && ItemCenter.id) {
      this.scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
      let findObj = ItemCenter.id ? this.layer.get('#' + ItemCenter.id)[0] : null;
      let stageOffsetWidth = ItemCenter.offsetWidth ? (Number(ItemCenter.offsetWidth) / 2) : (Number(this.containerDiv.offsetWidth) / 2);
      let stageOffsetHeight = ItemCenter.offsetHeight ? (Number(ItemCenter.offsetHeight) / 2) : (Number(this.containerDiv.offsetHeight) / 2);
      // let leftPx = ((Number(ItemCenter.x) - (findObj ? Number(findObj.attrs.x) : 0)) * this.scale);
      // let topPx = ((Number(ItemCenter.y) - (findObj ? Number(findObj.attrs.y) : 0)) * this.scale);
      let leftPx = ((Number(stageOffsetWidth) - (findObj ? Number(findObj.attrs.x) : 0)) * this.scale);
      let topPx = ((Number(stageOffsetHeight) - (findObj ? Number(findObj.attrs.y) : 0)) * this.scale);
      this.containerDiv.style.left = leftPx ? leftPx + 'px' : "";
      this.containerDiv.style.top = topPx ? topPx + 'px' : "";
      this.body.onmousemove = null;
      this.body.onmouseup = null;
      // console.log('定位1111', this.stage, this.layer, this.scale, this.containerDiv, findObj, ItemCenter, leftPx, topPx);
    } else {
      this.containerDiv.style.left = '';
      this.containerDiv.style.top = '';
    }
    // console.log('定位1111', this.stage, this.layer, this.scale, this.containerDiv, findObj, ItemCenter, leftPx, topPx);
  }
  // 放大地图
  zoomIn(scaleNum) {
    // this.containerDiv = document.getElementById(temStageInfo.id || 'map-container');
    // console.log('放大地图', temStageInfo.id, this.containerDiv);
    let transform = this.containerDiv.style.transform;
    this.scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
    this.scale = scaleNum ? this.scale + scaleNum : this.scale + 0.1;
    this.containerDiv.style.transform = "scale(" + this.scale + ")";
  };
  // 缩小地图
  zoomOut(scaleNum) {
    // this.containerDiv = document.getElementById(temStageInfo.id || 'map-container');
    let transform = this.containerDiv.style.transform;
    this.scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
    if (this.scale > 0.1) {
      this.scale = scaleNum ? this.scale - scaleNum : this.scale - 0.1;
    }
    this.containerDiv.style.transform = "scale(" + this.scale + ")";
  };
  // 打开绘制按钮，图形绘制模式，矩形，圆，线段，多边形
  openDrawManger(drawType, callBack = function () {}, clickCall = function () {}, noShowMidPoint) {
    if (rectDrawGroup) {
      rectDrawGroup.remove();
      rectDrawGroup.removeChildren();
    }
    if (circleDrawGroup) {
      circleDrawGroup.remove();
      circleDrawGroup.removeChildren();
    }
    if (polygonDrawGroup) {
      polygonDrawGroup.remove();
      polygonDrawGroup.removeChildren();
    }
    if (foldLineDrawGroup) {
      foldLineDrawGroup.remove();
      foldLineDrawGroup.removeChildren();
    }
    // containerDiv = document.getElementById(temStageInfo.container || 'map-container');
    this.containerDiv.style.cursor = 'crosshair';
    if (drawType === "rect" || drawType === "rectangle" || drawType === "circle") { // 画矩形，画圆
      this.stage.on("contentMousedown", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        let pointX = this.stage.getPointerPosition().x;
        let pointY = this.stage.getPointerPosition().y;
        if (drawType === "rect" || drawType === "rectangle") { // 画矩形
          this.drawRect(pointX, pointY, callBack);
        } else if (drawType === "circle") { // 画圆
          this.drawCircle(pointX, pointY, callBack);
        }
      });
    } else if (drawType === "polyline") { // 画线段
      this.drawPolyLine(callBack, clickCall, noShowMidPoint);
    } else if (drawType === "polygon") {
      this.drawPolygon(callBack); // 绘制多边形
    }
  };
  // 绘制矩形
  drawRect(pointX, pointY, callBack) {
    let option = {
      id: 'tem_drawRect123',
      x: pointX,
      y: pointY,
      width: 0,
      height: 0,
      point: {
        x: pointX,
        y: pointY,
      },
      fill: 'rgba(37,210,152,0.4)', // 矩形点的填充色，若未设置，默认white
      stroke: '#43FBEF', // 矩形点的边缘线颜色，若未设置，默认black
      strokeWidth: 1, // 矩形点的边缘线宽度，若未设置，默认1
      alpha: 1, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
      opacity: 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
      zIndex: 12, // 设定层图像的ZIndex值
      draggable: false, // 矩形点能否拖动，若未设置，默认true
      visible: true, // 矩形点的显示隐藏，若未设置，默认显示
    };
    // let rect = new PRectangle(option);
    // this.addOverlay(rect);
    let pointConfig = commonPointData(option);
    !rectDrawGroup && (rectDrawGroup = new Kinetic.Group()); // 创建group对象
    rectDraw = new Kinetic.Rect(pointConfig);
    rectDrawGroup.add(rectDraw);
    this.layer.add(rectDrawGroup);
    this.stage.on("contentMousemove", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let x = this.stage.getPointerPosition().x;
      let y = this.stage.getPointerPosition().y;
      if (x - pointX > 0 && y - pointY > 0) {
        option.x = pointX;
        option.y = pointY;
      } else if (x - pointX > 0 && y - pointY < 0) {
        option.x = pointX;
        option.y = y;
      } else if (x - pointX < 0 && y - pointY < 0) {
        option.x = x;
        option.y = y;
      } else if (x - pointX < 0 && y - pointY > 0) {
        option.x = x;
        option.y = pointY;
      }
      option.width = Math.abs(x - pointX);
      option.height = Math.abs(y - pointY);
      rectDrawGroup.children.setX(option.x);
      rectDrawGroup.children.setY(option.y);
      rectDrawGroup.children.setWidth(option.width);
      rectDrawGroup.children.setHeight(option.height);
      // console.log('绘制矩形', option);
      this.stage.draw();
    });
    this.stage.on("contentMouseup", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      this.containerDiv.style.cursor = 'default';
      this.stage.off("contentMousedown");
      this.stage.off("contentMousemove");
      this.stage.off("contentMouseup");
      callBack(rectDrawGroup, e, option);
    });
  };
  // 绘制圆形
  drawCircle(pointX, pointY, callBack) {
    let option = {
      x: pointX,
      y: pointY,
      radius: 0,
      dash: [4, 4],
      width: 0,
      height: 0,
      point: {
        x: pointX,
        y: pointY,
      },
      fill: 'rgba(37,210,152,0.4)', // 矩形点的填充色，若未设置，默认white
      stroke: '#43FBEF', // 矩形点的边缘线颜色，若未设置，默认black
      strokeWidth: 1, // 矩形点的边缘线宽度，若未设置，默认1
      alpha: 1, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
      opacity: 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
      zIndex: 12, // 设定层图像的ZIndex值
      draggable: false, // 矩形点能否拖动，若未设置，默认true
      visible: true, // 矩形点的显示隐藏，若未设置，默认显示
    };
    // let circle = new PCircle(option);
    // this.addOverlay(circle);
    let pointConfig = commonPointData(option);
    !circleDrawGroup && (circleDrawGroup = new Kinetic.Group()); // 创建group对象
    circleDraw = new Kinetic.Circle(pointConfig);
    circleDrawGroup.add(circleDraw);
    this.layer.add(circleDrawGroup);
    this.stage.on("contentMousemove", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let x = this.stage.getPointerPosition().x;
      let y = this.stage.getPointerPosition().y;
      option.radius = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
      circleDrawGroup.children.setRadius(option.radius);
      this.stage.draw();
    });
    this.stage.on("contentMouseup", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      this.containerDiv.style.cursor = 'default';
      this.stage.off("contentMousedown");
      this.stage.off("contentMousemove");
      this.stage.off("contentMouseup");
      callBack(circleDrawGroup, e);
    });
  };
  // 绘制多边形
  drawPolygon(callBack) {
    let option = {
      x: 0,
      y: 0,
      radius: 0,
      dash: [4, 4],
      width: 0,
      height: 0,
      points: [0, 0],
      point: {
        x: 0,
        y: 0,
      },
      fill: 'rgba(37,210,152,0.4)', // 矩形点的填充色，若未设置，默认white
      stroke: '#43FBEF', // 矩形点的边缘线颜色，若未设置，默认black
      strokeWidth: 3, // 矩形点的边缘线宽度，若未设置，默认1
      alpha: 1, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
      opacity: 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
      zIndex: 12, // 设定层图像的ZIndex值
      draggable: false, // 矩形点能否拖动，若未设置，默认true
      visible: true, // 矩形点的显示隐藏，若未设置，默认显示
    };
    let points = [];
    option.points.forEach((v) => {
      points.push(v.x);
      points.push(v.y);
    });
    // let polygon = new PPolygon(option);
    // this.addOverlay(polygon);
    let pointConfig = commonPolygonLineData(option);
    polygonDrawGroup = new Kinetic.Group(); // 创建group对象
    polygonDraw = new Kinetic.Polygon(pointConfig);
    polygonDrawGroup.add(polygonDraw);
    this.layer.add(polygonDrawGroup);
    this.stage.on("contentMousedown", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let pointX = this.stage.getPointerPosition().x;
      let pointY = this.stage.getPointerPosition().y;
      points.forEach((v, i) => {
        if (i === (points.length - 2)) {
          points[i] = pointX;
        } else if (i === (points.length - 1)) {
          points[i] = pointY;
        }
      });
      points.push(pointX);
      points.push(pointY);
      this.stage.on("contentMousemove", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        let x = this.stage.getPointerPosition().x;
        let y = this.stage.getPointerPosition().y;
        points.forEach((v, i) => {
          if (i === (points.length - 2)) {
            points[i] = x;
          } else if (i === (points.length - 1)) {
            points[i] = y;
          }
        });
        polygonDrawGroup.children.setPoints(points);
        this.stage.draw();
      });
      this.stage.on("contentDblclick", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        this.containerDiv.style.cursor = 'default';
        this.stage.off("contentMousedown");
        this.stage.off("contentMousemove");
        this.stage.off("contentDblclick");
        let timer = setTimeout(() => {
          points.pop();
          points.pop();
          points.pop();
          points.pop();
          polygonDrawGroup.children.setPoints(points);
          this.stage.draw();
          callBack(polygonDrawGroup, e);
          clearTimeout(timer);
          timer = null;
        }, 10);
      });
    });
  };
  // 绘制折线
  drawPolyLine(callBack, clickCall, noShowMidPoint) {
    let option = {
      x: 0,
      y: 0,
      radius: 0,
      dash: [4, 4],
      width: 0,
      height: 0,
      points: [{
        x: 0,
        y: 0
      }],
      noShowMidPoint,
      point: {
        x: 0,
        y: 0,
      },
      fill: 'rgba(37,210,152,0.4)', // 矩形点的填充色，若未设置，默认white
      stroke: '#43FBEF', // 矩形点的边缘线颜色，若未设置，默认black
      strokeWidth: 3, // 矩形点的边缘线宽度，若未设置，默认1
      alpha: 1, // 透明度是一个0到1之间的浮点值，0表示完全透明，1则是完全不透明
      opacity: 1, // 图形可见度是一个0到1之间的浮点值，0表示完全不可见，1则是完全可见
      zIndex: 12, // 设定层图像的ZIndex值
      draggable: false, // 矩形点能否拖动，若未设置，默认true
      visible: true, // 矩形点的显示隐藏，若未设置，默认显示
    };
    let points = [];
    let linePoints = [];
    option.points.forEach((v) => {
      points.push(v.x);
      points.push(v.y);
    });
    // let polyline = new PPolyline(option);
    // this.addOverlay(polyline);
    let pointConfig = commonLineData(option);
    !foldLineDrawGroup && (foldLineDrawGroup = new Kinetic.Group()); // 创建group对象
    foldLineDraw = new Kinetic.Line(pointConfig);
    foldLineDrawGroup.add(foldLineDraw);
    this.layer.add(foldLineDrawGroup);
    this.stage.on("contentMousedown", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let pointX = this.stage.getPointerPosition().x;
      let pointY = this.stage.getPointerPosition().y;
      points.forEach((v, i) => {
        if (i === (points.length - 2)) {
          points[i] = pointX;
        } else if (i === (points.length - 1)) {
          points[i] = pointY;
        }
      });
      points.push(pointX);
      points.push(pointY);
      clickCall(pointX, pointY); // 回调鼠标按下点击的位置坐标像素点
      this.stage.on("contentMousemove", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        let x = this.stage.getPointerPosition().x;
        let y = this.stage.getPointerPosition().y;
        points.forEach((v, i) => {
          if (i === (points.length - 2)) {
            points[i] = x;
          } else if (i === (points.length - 1)) {
            points[i] = y;
          }
        });
        foldLineDrawGroup.children.setPoints(points);
        this.stage.draw();
      });
      this.stage.on("contentDblclick", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        this.containerDiv.style.cursor = 'default';
        this.stage.off("contentMousedown");
        this.stage.off("contentMousemove");
        this.stage.off("contentDblclick");
        points.pop();
        points.pop();
        points.pop();
        points.pop();
        foldLineDrawGroup.children.setPoints(points);
        points.forEach((item, k) => {
          if ((k % 2) === 0) {
            linePoints.push({
              x: points[k],
              y: points[k + 1],
            });
          }
        });
        callBack(foldLineDrawGroup, e, points, linePoints);
        this.stage.draw();
        points = [];
        // let timer = setTimeout(() => {
        //   points.pop();
        //   points.pop();
        //   points.pop();
        //   points.pop();
        //   foldLineDrawGroup.children.setPoints(points);
        //   stage.draw();
        //   // polyline.updateEditMarker();
        //   callBack(foldLineDrawGroup, e);
        //   clearTimeout(timer);
        //   timer = null;
        // }, 100);
      });
    });
  };
  // 框选矩形，返回矩形中的框选的点
  rectangleSelect(callBack) {
    let rectSelectArr = []; // 筛选返回结果
    let markGroupData = []; // 需要筛选的图标点
    let rectDrawGroupData = {}; // 当前矩形筛选框的基础数据
    markGroupData = (this.markGroup && this.markGroup.children) || [];
    rectDrawGroupData = (rectDrawGroup && rectDrawGroup.children && rectDrawGroup.children.length && rectDrawGroup.children[0]) || {};
    if (!markGroupData.length) {
      rectSelectArr = [];
    } else {
      markGroupData.forEach((item, k) => {
        if (
          item.attrs.x >= rectDrawGroupData.attrs.x &&
          item.attrs.x <= rectDrawGroupData.attrs.x + rectDrawGroupData.attrs.width &&
          item.attrs.y >= rectDrawGroupData.attrs.y &&
          item.attrs.y <= rectDrawGroupData.attrs.y + rectDrawGroupData.attrs.height
        ) {
          rectSelectArr.push(item);
        }
      });
    }
    // console.log('框选矩形，返回矩形中的框选的点', this.markGroup, rectSelectArr, rectDrawGroup);
    callBack(rectSelectArr, markGroupData, rectDrawGroupData);
  }
  // 圆选圆形，返回圆形中的框选的点
  circleSelect(callBack) {
    let circleSelectArr = []; // 筛选返回结果
    let markGroupData = []; // 需要筛选的图标点
    let rectDrawGroupData = {}; // 当前矩形筛选框的基础数据
    markGroupData = (this.markGroup && this.markGroup.children) || [];
    rectDrawGroupData = (circleDrawGroup && circleDrawGroup.children && circleDrawGroup.children.length && circleDrawGroup.children[0]) || {};
    if (!markGroupData.length) {
      circleSelectArr = [];
    } else {
      markGroupData.forEach((item, k) => {
        if (
          Math.sqrt(
            Math.pow(Math.abs(item.attrs.x - rectDrawGroupData.attrs.x), 2) +
            Math.pow(Math.abs(item.attrs.y - rectDrawGroupData.attrs.y), 2)
          ) <= rectDrawGroupData.attrs.radius
        ) {
          circleSelectArr.push(item);
        }
      });
    }
    // console.log('圆选圆形，返回圆形中的框选的点', this.markGroup, circleSelectArr, circleDrawGroup);
    callBack(circleSelectArr, markGroupData, rectDrawGroupData);
  }
  // 多边形选多边形，返回多边形中的框选的点
  polygonSelect(callBack) {
    let polygonSelectArr = []; // 筛选返回结果
    let markGroupData = []; // 需要筛选的图标点
    let polygonDrawGroupData = {}; // 当前矩形筛选框的基础数据
    markGroupData = (this.markGroup && this.markGroup.children) || [];
    polygonDrawGroupData = (polygonDrawGroup && polygonDrawGroup.children && polygonDrawGroup.children.length && polygonDrawGroup.children[0]) || {};
    if (!markGroupData.length) {
      polygonSelectArr = [];
    } else {
      markGroupData.forEach((item, k) => {
        let poly = [];
        for (let i = 2; i < polygonDrawGroupData.attrs.points.length; i = i + 2) {
          poly.push({
            x: polygonDrawGroupData.attrs.points[i],
            y: polygonDrawGroupData.attrs.points[i + 1]
          });
        }
        if (this.pointInPoly({ x: item.attrs.x, y: item.attrs.y }, poly)) {
          polygonSelectArr.push(item);
        }
      });
    }
    // console.log('多边形选多边形，返回多边形中的框选的点', this.markGroup, polygonSelectArr, polygonDrawGroup);
    callBack(polygonSelectArr, markGroupData, polygonDrawGroupData);
  }
  // 判断一个点是否在一个多边形内
  pointInPoly(pt, poly) {
    let c = false;
    for (let i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) &&
        pt.x < ((poly[j].x - poly[i].x) * (pt.y - poly[i].y)) / (poly[j].y - poly[i].y) + poly[i].x &&
        (c = !c);
    }
    return c;
  }
  // 关闭绘制模式
  closeDrawManger() {
    this.containerDiv.style.cursor = 'default';
    this.stage.off("contentMousedown");
    this.stage.off("contentMousemove");
    this.stage.off("contentDblclick");
  }
  // 清除绘制的围栏线，框选，圆选，多边形选扇形等
  deleteDraWItem() {
    if (rectDrawGroup) {
      rectDrawGroup.remove();
      rectDrawGroup.removeChildren();
    }
    if (circleDrawGroup) {
      circleDrawGroup.remove();
      circleDrawGroup.removeChildren();
    }
    if (polygonDrawGroup) {
      polygonDrawGroup.remove();
      polygonDrawGroup.removeChildren();
    }
    if (foldLineDrawGroup) {
      foldLineDrawGroup.remove();
      foldLineDrawGroup.removeChildren();
    }
    this.stage.off("contentMousedown");
    this.stage.off("contentMousemove");
    this.stage.off("contentMouseup");
    this.stage.draw();
  }
  // 允许扇形编辑，即显示编辑操作点
  enableWedgeEditing(options, callback) {
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findStartWedgeMarkId = `start${item.wedgeConfig.id}`;
      let findStartWedgeMarkObj = this.startWedgeMarkGroup.get('#' + findStartWedgeMarkId)[0];
      let findMiddleWedgeMarkId = `middle${item.wedgeConfig.id}`;
      let findMiddleWedgeMarkObj = this.middleWedgeMarkGroup.get('#' + findMiddleWedgeMarkId)[0];
      let findEndWedgeMarkId = `end${item.wedgeConfig.id}`;
      let findEndWedgeMarkObj = this.endWedgeMarkGroup.get('#' + findEndWedgeMarkId)[0];
      findStartWedgeMarkObj && findStartWedgeMarkObj.show();
      findMiddleWedgeMarkObj && findMiddleWedgeMarkObj.show();
      findEndWedgeMarkObj && findEndWedgeMarkObj.show();
    });
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      updateArray: options.updateArray,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 禁止扇形编辑，即隐藏编辑操作点
  disableWedgeEditing(options, callback) {
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findStartWedgeMarkId = `start${item.wedgeConfig.id}`;
      let findStartWedgeMarkObj = this.startWedgeMarkGroup.get('#' + findStartWedgeMarkId)[0];
      let findMiddleWedgeMarkId = `middle${item.wedgeConfig.id}`;
      let findMiddleWedgeMarkObj = this.middleWedgeMarkGroup.get('#' + findMiddleWedgeMarkId)[0];
      let findEndWedgeMarkId = `end${item.wedgeConfig.id}`;
      let findEndWedgeMarkObj = this.endWedgeMarkGroup.get('#' + findEndWedgeMarkId)[0];
      findStartWedgeMarkObj && findStartWedgeMarkObj.hide();
      findMiddleWedgeMarkObj && findMiddleWedgeMarkObj.hide();
      findEndWedgeMarkObj && findEndWedgeMarkObj.hide();
    });
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      updateArray: options.updateArray,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 添加绘制扇形编辑点
  addWedgeEditPoint(options, markDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
    };
    let wedgeArray = options.wedgeArray || [];
    !this.startWedgeMarkGroup && (this.startWedgeMarkGroup = new Kinetic.Group()); // 创建group对象
    !this.middleWedgeMarkGroup && (this.middleWedgeMarkGroup = new Kinetic.Group()); // 创建group对象
    !this.endWedgeMarkGroup && (this.endWedgeMarkGroup = new Kinetic.Group()); // 创建group对象
    wedgeArray.length && wedgeArray.forEach((item, k) => {
      // let pointStart = this.getCurvePoint(item.wedgeConfig.center, item.wedgeConfig.radius, item.wedgeConfig.startAngle);
      // let pointMiddle = this.getCurvePoint(item.wedgeConfig.center, item.wedgeConfig.radius, (item.wedgeConfig.endAngle - item.wedgeConfig.startAngle) / 2 + item.wedgeConfig.startAngle);
      // let pointEnd = this.getCurvePoint(item.wedgeConfig.center, item.wedgeConfig.radius, item.wedgeConfig.endAngle);
      let pointStart = item.wedgeConfig.pointStart;
      let pointMiddle = item.wedgeConfig.pointMiddle;
      let pointEnd = item.wedgeConfig.pointEnd;
      // console.log('编辑起点', pointStart);
      // console.log('编辑中点', pointMiddle);
      // console.log('编辑终点点', pointEnd);
      this.configStartWedgeMark = {
        id: `start${item.wedgeConfig.id}`,
        name: `start${item.wedgeConfig.id}`,
        x: pointStart.x,
        y: pointStart.y,
        fill: '#0091FF',
        radius: 8,
        draggable: true,
        visible: item.wedgeConfig.wedgeEditPointVisible === true,
        item: item,
        zIndex: item.wedgeConfig.zIndexStartWedgeMark,
      };
      this.configMiddleWedgeMark = {
        id: `middle${item.wedgeConfig.id}`,
        name: `middle${item.wedgeConfig.id}`,
        x: pointMiddle.x,
        y: pointMiddle.y,
        fill: '#0091FF',
        radius: 8,
        draggable: true,
        visible: item.wedgeConfig.wedgeEditPointVisible === true,
        item: item,
        zIndex: item.wedgeConfig.zIndexMiddleWedgeMark,
      };
      this.configEndWedgeMark = {
        id: `end${item.wedgeConfig.id}`,
        name: `end${item.wedgeConfig.id}`,
        x: pointEnd.x,
        y: pointEnd.y,
        fill: '#0091FF',
        radius: 8,
        draggable: true,
        visible: item.wedgeConfig.wedgeEditPointVisible === true,
        item: item,
        zIndex: item.wedgeConfig.zIndexEndWedgeMark,
      };
      this.startWedgeMark = new Kinetic.Circle(this.configStartWedgeMark);
      this.middleWedgeMark = new Kinetic.Circle(this.configMiddleWedgeMark);
      this.endWedgeMark = new Kinetic.Circle(this.configEndWedgeMark);
      this.startWedgeMarkGroup.add(this.startWedgeMark); // 把多个扇形编辑起点对象添加到group里
      this.middleWedgeMarkGroup.add(this.middleWedgeMark); // 把多个扇形编辑中点对象添加到group里
      this.endWedgeMarkGroup.add(this.endWedgeMark); // 把多个扇形编辑终点对象添加到group里
      this.layer.add(this.startWedgeMarkGroup); // 把group对象添加到层里
      this.layer.add(this.middleWedgeMarkGroup); // 把group对象添加到层里
      this.layer.add(this.endWedgeMarkGroup); // 把group对象添加到层里
      this.startWedgeMarkGroup.setZIndex(this.configStartWedgeMark.zIndex || 20);
      this.middleWedgeMarkGroup.setZIndex(this.configMiddleWedgeMark.zIndex || 20);
      this.endWedgeMarkGroup.setZIndex(this.configEndWedgeMark.zIndex || 20);
      let eventArray = ['click', 'rightclick', 'dblclick', 'mousedown', 'mouseup', 'dragstart', 'dragmove', 'dragend'];
      eventArray.forEach(eventType => {
        this.startWedgeMark.on(eventType, e => {
          e.cancelBubble = true;
          if (window.event.stopPropagation) {
            window.event.stopPropagation();
          } else {
            window.event.cancelBubble = true;
          }
          this.startWedgeMarkerEdit(e, 'start', item);
          if (eventType === 'dragstart') {
            this.wedgePointDragend = false;
          }
          let dragType = {
            dragName: '', // 拖动事件名称
            dragIcon: '', // 拖动元素类型
          };
          if (eventType === 'dragend') {
            if (this.wedgePointDragend) return;
            this.wedgePointDragend = true;
            dragType = {
              dragName: 'dragend', // 拖动事件名称
              dragIcon: 'wedgeMark', // 拖动元素类型
            };
          }
          if (eventType === 'mousedown') {
            this.mousedownX = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
            this.mousedownY = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
            dragType = {
              dragName: 'mousedown', // 鼠标按下事件名称
              dragIcon: 'wedgeMark', // 点击元素类型
            };
          }
          if (eventType === 'mouseup') {
            this.mouseupX = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
            this.mouseupY = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
            dragType = {
              dragName: 'mouseup', // 鼠标弹起事件名称
              dragIcon: 'wedgeMark', // 点击元素类型
            };
            if (this.mouseupX !== this.mousedownX || this.mouseupY !== this.mousedownY) {
              dragType = {
                dragName: 'dragend', // 鼠标拖拽结束事件名称
                dragIcon: 'wedgeMark', // 点击元素类型
              };
            }
          }
          markDragFun(item, e, dragType, 'start');
        });
        this.middleWedgeMark.on(eventType, e => {
          e.cancelBubble = true;
          if (window.event.stopPropagation) {
            window.event.stopPropagation();
          } else {
            window.event.cancelBubble = true;
          }
          this.middleWedgeMarkerEdit(e, 'middle', item);
          if (eventType === 'dragstart') {
            this.wedgePointDragend = false;
          }
          let dragType = {
            dragName: '', // 拖动事件名称
            dragIcon: '', // 拖动元素类型
          };
          if (eventType === 'dragend') {
            if (this.wedgePointDragend) return;
            this.wedgePointDragend = true;
            dragType = {
              dragName: 'dragend', // 拖动事件名称
              dragIcon: 'wedgeMark', // 拖动元素类型
            };
          }
          if (eventType === 'mousedown') {
            this.mousedownX = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
            this.mousedownY = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
            dragType = {
              dragName: 'mousedown', // 鼠标按下事件名称
              dragIcon: 'wedgeMark', // 点击元素类型
            };
          }
          if (eventType === 'mouseup') {
            this.mouseupX = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
            this.mouseupY = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
            dragType = {
              dragName: 'mouseup', // 鼠标弹起事件名称
              dragIcon: 'wedgeMark', // 点击元素类型
            };
            if (this.mouseupX !== this.mousedownX || this.mouseupY !== this.mousedownY) {
              dragType = {
                dragName: 'dragend', // 鼠标拖拽结束事件名称
                dragIcon: 'wedgeMark', // 点击元素类型
              };
            }
          }
          markDragFun(item, e, dragType, 'middle');
        });
        this.endWedgeMark.on(eventType, e => {
          e.cancelBubble = true;
          if (window.event.stopPropagation) {
            window.event.stopPropagation();
          } else {
            window.event.cancelBubble = true;
          }
          this.endWedgeMarkerEdit(e, 'end', item);
          if (eventType === 'dragstart') {
            this.wedgePointDragend = false;
          }
          let dragType = {
            dragName: '', // 拖动事件名称
            dragIcon: '', // 拖动元素类型
          };
          if (eventType === 'dragend') {
            if (this.wedgePointDragend) return;
            this.wedgePointDragend = true;
            dragType = {
              dragName: 'dragend', // 拖动事件名称
              dragIcon: 'wedgeMark', // 拖动元素类型
            };
          }
          if (eventType === 'mousedown') {
            this.mousedownX = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
            this.mousedownY = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
            dragType = {
              dragName: 'mousedown', // 鼠标按下事件名称
              dragIcon: 'wedgeMark', // 点击元素类型
            };
          }
          if (eventType === 'mouseup') {
            this.mouseupX = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
            this.mouseupY = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
            dragType = {
              dragName: 'mouseup', // 鼠标弹起事件名称
              dragIcon: 'wedgeMark', // 点击元素类型
            };
            if (this.mouseupX !== this.mousedownX || this.mouseupY !== this.mousedownY) {
              dragType = {
                dragName: 'dragend', // 鼠标拖拽结束事件名称
                dragIcon: 'wedgeMark', // 点击元素类型
              };
            }
          }
          markDragFun(item, e, dragType, 'middle');
        });
      });
      // this.layer.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 更新扇形编辑点
  updateWedgeEditPoint(options = {}, callback) {
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findStartWedgeMarkId = `start${item.wedgeConfig.id}`;
      let findStartWedgeMarkObj = this.startWedgeMarkGroup.get('#' + findStartWedgeMarkId)[0];
      let findMiddleWedgeMarkId = `middle${item.wedgeConfig.id}`;
      let findMiddleWedgeMarkObj = this.middleWedgeMarkGroup.get('#' + findMiddleWedgeMarkId)[0];
      let findEndWedgeMarkId = `end${item.wedgeConfig.id}`;
      let findEndWedgeMarkObj = this.endWedgeMarkGroup.get('#' + findEndWedgeMarkId)[0];
      let pointStart = this.getCurvePoint(item.wedgeConfig.center, item.wedgeConfig.radius, item.wedgeConfig.startAngle);
      let pointMiddle = this.getCurvePoint(item.wedgeConfig.center, item.wedgeConfig.radius, (item.wedgeConfig.endAngle - item.wedgeConfig.startAngle) / 2 + item.wedgeConfig.startAngle);
      let pointEnd = this.getCurvePoint(item.wedgeConfig.center, item.wedgeConfig.radius, item.wedgeConfig.endAngle);
      findStartWedgeMarkObj && findStartWedgeMarkObj.setPosition({
        x: pointStart.x,
        y: pointStart.y,
      });
      findMiddleWedgeMarkObj && findMiddleWedgeMarkObj.setPosition({
        x: pointMiddle.x,
        y: pointMiddle.y,
      });
      findEndWedgeMarkObj && findEndWedgeMarkObj.setPosition({
        x: pointEnd.x,
        y: pointEnd.y,
      });
    });
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      updateArray: options.updateArray,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 删除扇形编辑点
  deleteWedgeEditPoint(options = {}, callback) {
    let deleteArray = options.deleteArray || [];
    (deleteArray.length !== 0) && deleteArray.forEach((item, k) => {
      let findWedgeId = item.id;
      let findStartWedgeMarkObj = this.startWedgeMarkGroup.get('#startwedge' + findWedgeId)[0];
      let findMiddleWedgeMarkObj = this.middleWedgeMarkGroup.get('#middlewedge' + findWedgeId)[0];
      let findEndWedgeMarkObj = this.endWedgeMarkGroup.get('#endwedge' + findWedgeId)[0];
      findStartWedgeMarkObj && findStartWedgeMarkObj.remove();
      findMiddleWedgeMarkObj && findMiddleWedgeMarkObj.remove();
      findEndWedgeMarkObj && findEndWedgeMarkObj.remove();
      this.stage.draw();
    });
    const finishInfo = {
      complete: true,
      deleteMark: 'success',
      stage: this.stage,
      layer: this.layer,
      wedgePointGroup: this.wedgePointGroup,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 计算圆弧上指定点的坐标
  getCurvePoint(center, radius, degree) {
    // let y = radius * Math.sin((degree * Math.PI) / 180);
    // let x = radius * Math.cos((degree * Math.PI) / 180);
    let y = radius * Math.sin((degree * Math.PI) / 180);
    let x = radius * Math.cos((degree * Math.PI) / 180);
    return {
      x: center.x + x,
      // y: center.y - y
      y: center.y + y
    };
  }
  // 重新绘制扇形和其编辑操作点
  resetSectorPath(radius, sDegree, eDegree, item) {
    // this.shape.setAngle(eDegree - sDegree);
    // this.shape.setRadius(radius);
    // this.shape.setRotation(-eDegree);
    // this.sMarker.setX(this.getCurvePoint(this.option.center, radius, sDegree).x);
    // this.sMarker.setY(this.getCurvePoint(this.option.center, radius, sDegree).y);
    // this.mMarker.setX(this.getCurvePoint(this.option.center, radius, (eDegree - sDegree) / 2 + sDegree).x);
    // this.mMarker.setY(this.getCurvePoint(this.option.center, radius, (eDegree - sDegree) / 2 + sDegree).y);
    // this.eMarker.setX(this.getCurvePoint(this.option.center, radius, eDegree).x);
    // this.eMarker.setY(this.getCurvePoint(this.option.center, radius, eDegree).y);
    let findWedgeId = item.wedgeConfig.id;
    let findWedgeObj = this.wedgePointGroup.get('#' + findWedgeId)[0];
    let findStartWedgeMarkId = `start${item.wedgeConfig.id}`;
    let findStartWedgeMarkObj = this.startWedgeMarkGroup.get('#' + findStartWedgeMarkId)[0];
    let findMiddleWedgeMarkId = `middle${item.wedgeConfig.id}`;
    let findMiddleWedgeMarkObj = this.middleWedgeMarkGroup.get('#' + findMiddleWedgeMarkId)[0];
    let findEndWedgeMarkId = `end${item.wedgeConfig.id}`;
    let findEndWedgeMarkObj = this.endWedgeMarkGroup.get('#' + findEndWedgeMarkId)[0];
    // console.log('重新绘制扇形和其编辑操作点', findWedgeId, findWedgeObj);
    findWedgeObj.setAngle(eDegree - sDegree);
    findWedgeObj.setRadius(radius);
    // findWedgeObj.setRotation(-eDegree);
    findWedgeObj.setRotation(((sDegree - 0) % 360));
    findWedgeObj.attrs.radius = radius;
    findWedgeObj.attrs.startAngle = sDegree;
    findWedgeObj.attrs.endAngle = eDegree;
    findWedgeObj.attrs.angle = eDegree - sDegree;
    findWedgeObj.attrs.rotation = ((sDegree - 0) % 360);
    findStartWedgeMarkObj.setX(this.getCurvePoint(item.wedgeConfig.center, radius, sDegree).x);
    findStartWedgeMarkObj.setY(this.getCurvePoint(item.wedgeConfig.center, radius, sDegree).y);
    findMiddleWedgeMarkObj.setX(this.getCurvePoint(item.wedgeConfig.center, radius, (eDegree - sDegree) / 2 + sDegree).x);
    findMiddleWedgeMarkObj.setY(this.getCurvePoint(item.wedgeConfig.center, radius, (eDegree - sDegree) / 2 + sDegree).y);
    findEndWedgeMarkObj.setX(this.getCurvePoint(item.wedgeConfig.center, radius, eDegree).x);
    findEndWedgeMarkObj.setY(this.getCurvePoint(item.wedgeConfig.center, radius, eDegree).y);
    this.layer.draw();
  }
  // 扇形开始编辑点的编辑事件
  startWedgeMarkerEdit(e, type, item) {
    if (e.type === 'dragmove') {
      // let y = this.stage.getPointerPosition().y - this.option.center.y;
      // let x = this.stage.getPointerPosition().x - this.option.center.x;
      let y = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
      let x = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
      if (y > 0 && x > 0) {
        // this.sDegree = 360 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.startAngle = (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第四象限', item.wedgeConfig.startAngle, item.wedgeConfig.endAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      } else if (y > 0 && x < 0) {
        // this.sDegree = 180 + (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.startAngle = 180 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第三象限', item.wedgeConfig.startAngle, item.wedgeConfig.endAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      } else if (y < 0 && x < 0) {
        // this.sDegree = 180 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.startAngle = 180 + (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第二象限', item.wedgeConfig.startAngle, item.wedgeConfig.endAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      } else if (y < 0 && x > 0) {
        // this.sDegree = (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.startAngle = 360 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第一象限', item.wedgeConfig.startAngle, item.wedgeConfig.endAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      }
      // if (this.sDegree > this.eDegree) {
      //     this.sDegree = -(360 - this.sDegree);
      // }
      if (item.wedgeConfig.startAngle > item.wedgeConfig.endAngle) {
        item.wedgeConfig.startAngle = -(360 - item.wedgeConfig.startAngle);
      }
      // this.resetSectorPath(this.radius, this.sDegree, this.eDegree);
      this.resetSectorPath(item.wedgeConfig.radius, item.wedgeConfig.startAngle, item.wedgeConfig.endAngle, item);
    }
  }
  // 扇形结束编辑点的编辑事件
  endWedgeMarkerEdit(e, type, item) {
    if (e.type === 'dragmove') {
      // let y = this.stage.getPointerPosition().y - this.option.center.y;
      // let x = this.stage.getPointerPosition().x - this.option.center.x;
      let y = this.stage.getPointerPosition().y - item.wedgeConfig.center.y;
      let x = this.stage.getPointerPosition().x - item.wedgeConfig.center.x;
      if (y > 0 && x > 0) {
        // this.eDegree = (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.endAngle = (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第四象限', item.wedgeConfig.endAngle, item.wedgeConfig.startAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      } else if (y > 0 && x < 0) {
        // this.eDegree = 180 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.endAngle = 180 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第三象限', item.wedgeConfig.endAngle, item.wedgeConfig.startAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      } else if (y < 0 && x < 0) {
        // this.eDegree = 180 + (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.endAngle = 180 + (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第二象限', item.wedgeConfig.endAngle, item.wedgeConfig.startAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      } else if (y < 0 && x > 0) {
        // this.eDegree = 360 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        item.wedgeConfig.endAngle = 360 - (Math.atan(Math.abs(y) / Math.abs(x)) * 180) / Math.PI;
        // console.log('第一象限', item.wedgeConfig.endAngle, item.wedgeConfig.startAngle, this.stage.getPointerPosition().y, this.stage.getPointerPosition().x, y, x);
      }
      // if (this.sDegree > this.eDegree) {
      //     this.eDegree = 360 + this.eDegree;
      // }
      if (item.wedgeConfig.startAngle > item.wedgeConfig.endAngle) {
        item.wedgeConfig.endAngle = 360 + item.wedgeConfig.endAngle;
      }
      // item.wedgeConfig.endAngle = 360 - item.wedgeConfig.endAngle;
      this.resetSectorPath(item.wedgeConfig.radius, item.wedgeConfig.startAngle, item.wedgeConfig.endAngle, item);
    }
  }
  // 扇形中间编辑点的编辑事件
  middleWedgeMarkerEdit(e, type, item) {
    if (e.type === 'dragmove') {
      // this.radius = Math.sqrt(
      //     Math.pow(this.stage.getPointerPosition().x - this.option.center.x, 2) +
      //     Math.pow(this.stage.getPointerPosition().y - this.option.center.y, 2)
      // );
      item.wedgeConfig.radius = Math.sqrt(
        Math.pow(this.stage.getPointerPosition().x - item.wedgeConfig.center.x, 2) +
        Math.pow(this.stage.getPointerPosition().y - item.wedgeConfig.center.y, 2)
      );
      this.resetSectorPath(item.wedgeConfig.radius, item.wedgeConfig.startAngle, item.wedgeConfig.endAngle, item);
    }
  }
  // 基础图标，线段动画
  normalAnimation(options = {}, callback) {
    // this.normalAnimationInterval = setInterval(() => this.playdown(), 1000); // 开启定时器更新防区线段，图标等状态
  }
  // 基础图标动画
  normalMarkAnimation(options = {}, callback) {}
  // 基础线段动画
  normalLineAnimation(options = {}, callback) {}
  // 报警图标，线段开启动画
  alarmAnimationStart(options = {}, intervalTime, callback) {
    !this.alarmAnimationInterval && (this.alarmAnimationInterval = setInterval(() => this.alarmAnimation(options), intervalTime || 1000)); // 开启定时器更新防区报警线段，图标等动画显隐状态
  }
  // 报警图标，线段更新动画
  alarmAnimationUpdate(options = {}, intervalTime, callback) {
    !this.alarmAnimationInterval && (this.alarmAnimationInterval = setInterval(() => this.alarmAnimation(options), intervalTime || 1000)); // 开启定时器更新防区报警线段，图标等动画显隐状态
  }
  // 报警图标，线段销毁动画
  alarmAnimationStop() {
    this.isAlarmAnimation = false;
    window.clearInterval(this.alarmAnimationInterval);
    this.alarmAnimationInterval = null;
  }
  // 报警图标，线段动画
  alarmAnimation(options = {}, callback) {
    this.isAlarmAnimation = !this.isAlarmAnimation;
    if (!this.isAlarmAnimation) {
      this.alarmMarkAnimation(options, true);
      this.alarmLineAnimation(options, true);
    } else {
      this.alarmMarkAnimation(options, false);
      this.alarmLineAnimation(options, false);
    }
  }
  // 报警图标动画
  alarmMarkAnimation(options = {}, isShow, callback) {
    let playArray = options.playArray || [];
    let markGroupData = (this.markGroup && this.markGroup.children) || []; // 控件的mark图标对象组，取数据
    markGroupData.length && markGroupData.forEach((item, k) => {
      item.attrs.isTwinkle && (item.attrs.visible = isShow);
      item.attrs.isTwinkle && item.setVisible(isShow);
      !item.attrs.isTwinkle && (item.attrs.visible = item.attrs.isVisible);
      !item.attrs.isTwinkle && item.setVisible(item.attrs.isVisible);
      // this.layer.draw();
      // console.log('报警图标动画', item);
    });
    // playArray.length && playArray.forEach((item, k) => {
    //   let findMarkId = item.markConfig.id;
    //   let findMarkObj = this.markGroup.get('#' + findMarkId)[0];
    //   // console.log('报警图标动画', findMarkObj);
    //   if (findMarkObj) {
    //     item.markConfig.isTwinkle && (findMarkObj.attrs.visible = (isShow));
    //     item.markConfig.isTwinkle && findMarkObj.setVisible(isShow);
    //   }
    // });
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      playArray: playArray,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.layer.draw();
    this.stage.draw();
  }
  // 报警线段动画
  alarmLineAnimation(options = {}, isShow, callback) {
    let playArray = options.playArray || [];
    let lineAreaGroupData = (this.lineAreaGroup && this.lineAreaGroup.children) || []; // 控件的普通线段对象组，取数据
    let alarmLineAreaGroupData = (this.alarmLineAreaGroup && this.alarmLineAreaGroup.children) || []; // 控件的报警线段对象组，取数据
    lineAreaGroupData.length && lineAreaGroupData.forEach((item, k) => {
      item.attrs.isTwinkle && (item.attrs.visible = isShow);
      item.attrs.isTwinkle && item.setVisible(isShow);
      !item.attrs.isTwinkle && (item.attrs.visible = item.attrs.isVisible);
      !item.attrs.isTwinkle && item.setVisible(item.attrs.isVisible);
      // this.layer.draw();
    });
    alarmLineAreaGroupData.length && alarmLineAreaGroupData.forEach((item, k) => {
      item.attrs.isTwinkle && (item.attrs.visible = isShow);
      item.attrs.isTwinkle && item.setVisible(isShow);
      !item.attrs.isTwinkle && (item.attrs.visible = item.attrs.isVisible);
      !item.attrs.isTwinkle && item.setVisible(item.attrs.isVisible);
      // this.layer.draw();
    });
    // playArray.length && playArray.forEach((item, k) => {
    //   // let findAlarmLineId = item.alarmLineConfig.id;
    //   // let findAlarmLineObj = this.alarmLineAreaGroup.get('#' + findAlarmLineId)[0];
    //   let findAlarmLineId = item.alarmLineConfig.name;
    //   let findAlarmLineObj = this.alarmLineAreaGroup.get('.' + findAlarmLineId);
    //   // item.alarmLineConfig.isTwinkle && (findAlarmLineObj.attrs.visible = (isShow));
    //   item.alarmLineConfig.isTwinkle && findAlarmLineObj.setVisible(isShow);
    // });
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      playArray: playArray,
    };
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.layer.draw();
    this.stage.draw();
  }
  // 添加报警线段
  addAlarmLine(options, lineDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      alarmLineAreaGroup: this.alarmLineAreaGroup,
    };
    let lineArray = options.lineArray || [];
    !this.alarmLineAreaGroup && (this.alarmLineAreaGroup = new Kinetic.Group()); // 创建group对象
    (lineArray.length !== 0) && lineArray.forEach((item, k) => {
      this.configAlarmLine = commonAlarmLineData(item.lineConfig);
      this.configAlarmLine.isVisible = (item.lineConfig.isVisible !== false);
      if (item.lineConfig.isTwinkle) {
        this.configAlarmLine.visible = (item.lineConfig.visible !== this.isAlarmAnimation);
      }
      this.configAlarmLine.isTwinkle = item.lineConfig.isTwinkle;
      this.configAlarmLine.isDelete = item.lineConfig.isDelete;
      this.configAlarmLine.zIndex = item.lineConfig.zIndex;
      this.configAlarmLine.item = item.lineConfig.item;
      this.alarmLineAreaPoint = new Kinetic.Line(this.configAlarmLine);
      this.alarmLineAreaGroup.add(this.alarmLineAreaPoint); // 把多个线段对象添加到group里
      this.layer.add(this.alarmLineAreaGroup); // 把group对象添加到层里
      this.alarmLineAreaGroup.setZIndex(item.lineConfig.zIndex || 18); // 设定线段对象的ZIndex值
      // this.layer.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 更新报警线段
  updateAlarmLine(options, lineDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      alarmLineAreaGroup: this.alarmLineAreaGroup,
    };
    let updateArray = options.updateArray || [];
    updateArray.length && updateArray.forEach((item, k) => {
      let findAlarmLineId = item.lineConfig.id;
      let findAlarmLineObj = this.alarmLineAreaGroup.get('#' + findAlarmLineId)[0];
      // let findAlarmLineObj = this.alarmLineAreaGroup.get('.linenormal' + findAlarmLineId);
      // console.log('更新线段', updateArray, findAlarmLineId, findAlarmLineObj);
      if (findAlarmLineObj) {
        item.lineConfig.stroke && (findAlarmLineObj.attrs.stroke = item.lineConfig.stroke);
        (item.lineConfig.points && item.lineConfig.points.length === 4) && (findAlarmLineObj.attrs.points = item.lineConfig.points);
        findAlarmLineObj.attrs.visible = (item.lineConfig.visible !== false);
        item.lineConfig.stroke && (findAlarmLineObj.setStroke(item.lineConfig.stroke));
        (item.lineConfig.points && item.lineConfig.points.length === 4) && (findAlarmLineObj.setPoints(item.lineConfig.points));
        findAlarmLineObj.setVisible(item.lineConfig.visible !== false);
        item.lineConfig.zIndex && this.alarmLineAreaGroup.setZIndex(item.lineConfig.zIndex || 2); // 设定线段对象的ZIndex值
        findAlarmLineObj.attrs.item = item.lineConfig.item;
        this.stage.draw();
      }
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
  // 删除报警线段
  deleteAlarmLine(options, lineDragFun, callback) {
    const finishInfo = {
      complete: true,
      loadMap: 'success',
      stage: this.stage,
      layer: this.layer,
      alarmLineAreaGroup: this.alarmLineAreaGroup,
    };
    let deleteArray = options.deleteArray || [];
    deleteArray.length && deleteArray.forEach((item, k) => {
      // let findAlarmLineId = item.id;
      // let findAlarmLineObj = this.alarmLineAreaGroup.get('#' + findAlarmLineId);
      let findAlarmLineName = item.name;
      let findAlarmLineObj = this.alarmLineAreaGroup && this.alarmLineAreaGroup.get('.' + findAlarmLineName);
      findAlarmLineObj && findAlarmLineObj.remove();
      // this.layer.draw();
    });
    if (callback && typeof callback === 'function') {
      callback(finishInfo);
    }
    this.stage.draw();
  }
}
export {
  CKMap
};
