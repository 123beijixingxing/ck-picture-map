/*
 * @Author: 刘城志
 * @Begin: 2021-08-01 09:06:20
 * @Update: 2021-08-13 18:30:50
 * @Update log: 更新日志
 * @npm-jsAPI: yarn add / npm install -- canvas-kinetic
 * @npm-git: https://github.com/123beijixingxing/canvas-kinetic#readme
 * @npm-vueDom: yarn add / npm install -- picture-map-component
 * @vue-git: https://github.com/123beijixingxing/ck-picture-map#readme
*/
# 中转组件，参数属性，方法，事件
# dragover
拖拽经过地图容器，经过对象：dragover事件，拖放过程中鼠标经过的元素，被拖放的元素正在本元素范围内移动(一直)会触发事件
event --返回拖拽事件
# drop
拖拽结束，拖拽对象在地图容器内释放，结束了拖拽
event --返回拖拽事件

# wheelZoom({wheelZoomInfo: wheelZoomInfo, CKMap: this.CKMapObject})
地图容器鼠标滑动缩放

# repaint(callback, mapElementId, types)
添加--更新--删除整个通道下的图标，折线段，线段矩形点，扇形，扇形编辑点
types--['point', 'defence', 'wedge', 'alarm']

# calculationRectPointDelIcon
实时计算线段点右上角删除图标的位置

# draw(type, callBack, clickCall, noShowMidPoint)
绘制工具方法，添加围栏线，框选，圆选，多边形选，扇形编辑
@param {string} type 类型[polyline,rectangle,polygon,circle]

# selectDataReturn({selectData})
选择工具，框选包含的点返回
selectData = {type: "", data: []};

# deleteDraWItem
清除绘制工具，绘制的围栏线，框选，圆选，多边形选，扇形等

# clearMapItem
清除地图的所有元素，地图的图片不清除
function()

# clearMapAll(callback)
清除地图的所有元素，包括地图的图片
function()

# center(ItemCenter)
ItemCenter = {id: mapElementId, x: pointX, y: pointY}
设置画布在容器里，移动定位到元素的大概位置

# enlargeMap(scaleNum)
放大一级地图

# reduceMap(scaleNum)
缩小一级地图

# alarmAnimationStart(intervalTime)
报警图标，线段开启动画

# alarmAnimationStop
报警图标，线段销毁动画

# addAlarmLine
添加报警线段

# updateAlarmLine
更新报警线段

# deleteAlarmLine
删除报警线段

# formDataMark
格式化图标点数据，转换成canvas画图必须的参数格式

# formDataLine
格式化线段数据，转换成canvas画图必须的参数格式

# formDataWedge
格式化扇形数据，转换成canvas画图必须的参数格式

# formDataF7AlarmLine
格式化F7报警线段数据，转换成canvas画图必须的参数格式


# 图片插件库原始方法API
# initMapStage(options, callback)
初始化舞台
mapStageConfig -- {}

# initMapPicture(options, callback, mapDragFun, wheelZoomFun)
初始化地图图片
mapImgConfig -- {}

# clearMapItem
清除地图的所有元素，地图的图片不清除
function()

# clearMapAll(callback)
清除地图的所有元素，包括地图的图片
function()

# getStageInfo()
获取舞台div信息
function()

# pixelToPoint(x, y, offset)
像素转坐标
function(x, y, offset)

# pointToPixel(point)
坐标转像素
function(point)

# enableCanvasDragging(stageData, canMove, callBack)
是否允许画布拖动
function({}, canMove, callBack)

# enableScrollWheelZoom(stageData, canScrollWheelZoom, callBack)
是否允许滚轮缩放
function({}, canScrollWheelZoom, callBack)

# setCenter
设置画布在容器里居中
function()

# setItemCenter(ItemCenter)
设置画布在容器里，某个元素的大概位置居中
function()

# zoomIn(scaleNum)
放大地图
function(scaleNum)

# zoomOut(scaleNum)
缩小地图
function(scaleNum)

# addPoint(options, rectDragFun, callback)
添加独立矩形点，或则线段的矩形点
lineAddArray -- {lineArray: [{pointConfig: {}, lineConfig: {}, originData: {}}]}

# updatePoint(options)
更新矩形点，或则线段的矩形点
lineUpdateArray -- {updateArray: [{pointConfig: {}, lineConfig: {}, originData: {}}]}

# deletePoint(options)
删除矩形点，或则线段的矩形点
lineDeleteArray -- {deleteArray: [{pointConfig: {}, lineConfig: {}, originData: {}}]}

# addLine(options, lineDragFun, callback)
添加线段
lineAddArray -- {lineArray: [{pointConfig: {}, lineConfig: {}, originData: {}}]}

# updateLine(options, lineDragFun, callback)
更新线段
lineUpdateArray -- {updateArray: [{pointConfig: {}, lineConfig: {}, originData: {}}]}

# deleteLine(options, lineDragFun, callback)
删除线段
lineDeleteArray -- {deleteArray: [{pointConfig: {}, lineConfig: {}, originData: {}}]}

# addMark(options, markDragFun, callback)
画mark图标点
markAddArray -- {markArray: [{markConfig: {}, originData: {}}]}

# updateMark(options, callback)
更新图标点
markUpdateArray -- {updateArray: [{markConfig: {}, originData: {}}]}

# deleteMark(options, callback)
删除图标点
markDeleteArray -- {deleteArray: [{markConfig: {}, originData: {}}]}

# addWedge(options = {}, wedgeDragFun, callback)
添加扇形
wedgeAddArray -- {wedgeArray: [{wedgeConfig: {}, originData: {}}]}

# updateWedge(options = {}, callback)
更新扇形
wedgeUpdateArray -- {updateArray: [{wedgeConfig: {}, originData: {}}]}

# deleteWedge(options = {}, callback)
删除扇形
wedgeDeleteArray -- {deleteArray: [{wedgeConfig: {}, originData: {}}]}

# addWedgeEditPoint(options, markDragFun, callback)
添加绘制扇形编辑点
wedgeAddArray -- {wedgeArray: [{wedgeConfig: {}, originData: {}}]}

# updateWedgeEditPoint(options = {}, callback)
更新扇形编辑点
wedgeUpdateArray -- {updateArray: [{wedgeConfig: {}, originData: {}}]}

# deleteWedgeEditPoint(options = {}, callback)
删除扇形编辑点
wedgeDeleteArray -- {deleteArray: [{wedgeConfig: {}, originData: {}}]}

# enableWedgeEditing(options, callback)
允许扇形编辑，即显示编辑操作点
wedgeUpdateArray -- {updateArray: [{wedgeConfig: {}, originData: {}}]}

# disableWedgeEditing(options, callback)
禁止扇形编辑，即隐藏编辑操作点
wedgeUpdateArray -- {updateArray: [{wedgeConfig: {}, originData: {}}]}

# getCurvePoint(center, radius, degree)
计算圆弧上指定点的坐标
function(center, radius, startAngle)

# openDrawManger(drawType, callBack = function () {}, clickCall = function () {}, noShowMidPoint)
打开绘制按钮，手动拖拽鼠标图形绘制模式，框选矩形，框选圆型，围栏折线段，框选多边形
function(drawType, callBack = function () {}, clickCall = function () {}, noShowMidPoint)
- drawRect(pointX, pointY, callBack) -- 绘制矩形
- drawCircle(pointX, pointY, callBack) -- 绘制圆形
- drawPolyLine(pointX, pointY, callBack) -- 绘制折线
- drawPolygon(pointX, pointY, callBack) -- 绘制多边形

# deleteDraWItem()
清除绘制的围栏线，框选，圆选，多边形选扇形等

# mapMousemove
监听鼠标在地图容器的移动
# mapClick
图片地图点击事件
# mapDragstart
图片地图拖拽开始事件
# mapDragstart
图片地图拖拽开始事件
# mapDragmove
图片地图拖拽移动事件
# mapDragend
图片地图拖拽结束事件
# markClick
mark图标点击事件
# markDragmove
mark图标拖拽移动事件
# markDragend
mark图标拖拽结束事件
# rectPointClick
线段矩形点点击事件
# rectPointDragmove
线段矩形点拖拽移动事件
# rectPointDragend
线段矩形点拖拽结束事件
# delSingleEle
mark图标右上角删除按钮，点击事件
# calculationMarkInfo
实时计算地图的缩放，信息窗体位置

# wedgeEditPointDragend
扇形编辑点拖拽结束事件


# ck-picture-map
图片地图，基于canvas画布，绘制一张地图图片，可以在图片上，绘制点元素，线段元素，图标logo元素，其他几何图形等，区别于百度，腾讯，高德等开源地图，图片地图模式，是当前的图片，在图片范围内，自定义绘制数据视图，常用于小区，小镇，某范围内，用于电子围栏，防控红外线，通讯光缆，水电管道等布控线的状态检测
@ck/picture-map-component

# 使用方法

安装

```sh
// yarn
yarn add picture-map-component --registry="git+https://github.com/" --dev
// npm
npm install picture-map-component --registry="git+https://github.com/" --save-dev
```


使用

```js
import mapComponent from 'picture-map-component';
```