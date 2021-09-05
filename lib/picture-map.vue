<template>
  <div class="page_all">
    <!--地图容器--start-->
    <div
      class="map_all"
      id="map_id"
      @dragover="dragover($event)"
      @drop="drop($event)"
    ></div>
    <!--地图容器--end-->
    <!--mark图标删除按钮--start-->
    <div
      class="mark_delete_icon"
      v-show="isShowDelIcon"
      :style="`position: absolute; z-index: 2009; top: ${imgTop}px; left: ${imgLeft}px; cursor: pointer;`"
      @click="delSingleEle"
      @mousemove.stop="delMouse"
      @mouseout.stop="closeDelIcon"
      @mouseover.stop="delMouse"
    >
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAeNJREFUOBF9Uz1LA0EQnT1iUmmsRLQyYBOb/ALFwvyCFDZaJKA2aW1UCCgWtgrioSlCuuQX2EhILyKYRkinYGdiIQmY9b257F0SPxZ2b+fNm7mZ3bdGfhk2n18Qa9fgWhy6X8SYhimXXyfpZhSwpVJc2u0T8bwdJGghqKt+a2fwXQF2JcnkkTk/77m4MIHd25uTz883OB4QWAY5JCnZ8+LAtjBnZWpq1VxfkyuawBaLCel2H2HfY97R8c9Yh29TlpYSplTqe0rsdI7x13fsg+B4PMBHs0QYOQ/aKjaeHhh7Fqkqn8SLi1PJZpfV5sI9MZfE827ww13GxtDTGmYLtKDnfn8g9fqN5HJM6jNe9/W6L/RxDAZ9rE+MjcFYgPFBPBy3t8/Y+xpocEy1mi8BFlKGN7T4s9eIEuysnUTG7Bju/BVVTI+h7JktsGwO185oFdSGMS8xLA3MS9AS6KmnB5XLFTQ4CmA7BWk2D6CVL/AT4KcZG+hge/sMxgZAJhJN4g5MgQnMmAKqbphKZT84g1TqEJQMJkUi4WmrMVyihOuodJaSpkcr4GYo5SYqoaCq2g4dbrBsa/MwM5Dy/JiUHUclTVW6xxRd7zQSp1G2L6iWEnYxYQUO4Dd8zoFGoFfc1B/P+Rvq88d3umDpIQAAAABJRU5ErkJggg=="
      />
    </div>
    <slot></slot>
    <!--mark图标删除按钮--end-->
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { CKMap } from "./utils/CKMap"; // 地图控件，封装绘制API方法js
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    mapInitParams: {
      type: Object,
      default: () => {},
    },
    markersList: {
      type: Array,
      default: () => [],
    },
    defenceLinesList: {
      type: Array,
      default: () => [],
    },
    alarmLinesList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    // 这里存放数据
    return {
      testData: "测试",
      CKMapObject: null,
      fileContainer: {
        // 文件上传用到的字段
        imageFileBlob: null,
        size: "",
        width: "",
        height: "",
        fileBlobBase64: "",
        hash: "",
        worker: null,
      },
      imgTop: 0,
      imgLeft: 0,
      markMouseData: {}, // mark图标元素，鼠标事件的详情信息
      isShowDelIcon: false, // mark图标删除按钮显示
      isDelIconMouse: false, // mark图标是否鼠标进入悬浮
      markersListTemp: [], // 比对图标数据
      markAddArray: {}, // 添加mark图标
      markUpdateArray: {}, // 更新mark图标
      defenceLinesListTemp: [], // 比对线段数据
      lineAddArray: {}, // 添加线段
      lineUpdateArray: {}, // 更新线段
      wedgeListTemp: [], // 比对图标扇形数据
      wedgeAddArray: {}, // 添加扇形
      wedgeUpdateArray: {}, // 更新扇形
      alarmLinesListTemp: [], // 比对报警线段数据
      alarmLineAddArray: {}, // 添加报警线段
      alarmLineUpdateArray: {}, // 更新报警线段
      playAnimationArray: [], // 报警的图标，线段数据集合（包含F5,F7）
      markEvt: {},
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    markersList: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          // this.markersListTemp = val;
          // console.log("监听数据变化", val);
          // this.markersListTemp.length &&
          //   (this.markersListTemp = JSON.parse(JSON.stringify(val)));
          // this.wedgeListTemp.length &&
          //   (this.wedgeListTemp = JSON.parse(JSON.stringify(val)));
        });
      },
    },
    defenceLinesList: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          // this.defenceLinesListTemp = val;
          // this.defenceLinesListTemp.length &&
          //   (this.defenceLinesListTemp = JSON.parse(JSON.stringify(val)));
        });
      },
    },
    alarmLinesList: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          // this.alarmLinesListTemp = val;
          // this.alarmLinesListTemp.length &&
          //   (this.alarmLinesListTemp = JSON.parse(JSON.stringify(val)));
        });
      },
    },
  },
  // 方法集合
  methods: {
    // 拖拽进过，经过对象：dragover事件，拖放过程中鼠标经过的元素，被拖放的元素正在本元素范围内移动(一直)会触发事件
    dragover(event) {
      event.preventDefault();
      this.$emit("dragover", event);
    },
    // 拖拽结束
    drop(event) {
      // event--拖拽事件
      event.preventDefault();
      this.$emit("drop", event);
      // console.log("拖拽结束", event);
    },
    // 上传图片的尺寸，base64编码等处理
    chargeImgSize(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file); // 将文件读取为 DataURL,也就是base64编码
        reader.onload = (e) => {
          // 文件读取成功完成时触发
          let data = e.target.result; // 获得文件读取成功后的DataURL,也就是base64编码
          let image = new Image();
          image.onload = () => {
            let width = image.width;
            let height = image.height;
            if (width >= 1024 && height >= 768) {
              this.fileContainer.width = width;
              this.fileContainer.height = height;
              resolve(data);
            } else {
              this.$message.warning("最小图片分辨率为1024×768像素");
              reject(new Error("最小图片分辨率为1024×768像素"));
            }
          };
          image.src = data;
        };
      });
    },
    // 初始化舞台和地图
    init(mapInitParams, callLoadback) {
      // js-api
      let callLoadBackNew = callLoadback;
      this.CKMapObject = new CKMap();
      // this.$nextTick(() => {
      let image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        this.fileContainer.width = width;
        this.fileContainer.height = height;
        let options = {
          mapStageConfig: {
            id: mapInitParams.id || "mapStage123456", // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
            container: mapInitParams.container || "map_id", // 地图容器挂载<div>的id，若未设置，默认id"map-container"
            width: this.fileContainer.width || "100%", // 舞台宽度，若未设置，默认100%
            height: this.fileContainer.height || "100%", // 舞台高度，若未设置，默认100%
            Kinetic: mapInitParams.Kinetic,
          },
        };
        let options1 = {
          mapImgConfig: {
            id: mapInitParams.id || "mapImg123456", // id是唯一的，不同对象不能使用相同的id，否则get也只能返回其中的一个
            name: mapInitParams.name || "mapImg", // 名称
            width: this.fileContainer.width || "100%", // 舞台宽度，若未设置，默认100%
            height: this.fileContainer.height || "100%", // 舞台高度，若未设置，默认100%
            iconSrc: mapInitParams.picture,
          },
        };
        this.CKMapObject.initMapStage(options, (callback) => {
          this.CKMapObject.initMapPicture(
            options1,
            (finishInfo) => {
              // this.$emit('ready', { CKMap: this });
              callLoadBackNew(finishInfo);
            },
            (configMapImg, evt, dragType) => {
              if (dragType.dragName === 'click') {
                this.mapClick(configMapImg, evt, dragType);
              }
              if (dragType.dragName === 'mousemove') {
                this.mapMousemove(configMapImg, evt, dragType);
              }
              if (dragType.dragName === 'dragstart') {
                this.mapDragstart(configMapImg, evt, dragType);
              }
              if (dragType.dragName === 'dragmove') {
                this.mapDragmove(configMapImg, evt, dragType);
              }
              if (dragType.dragName === 'dragend') {
                this.mapDragend(configMapImg, evt, dragType);
              }
              // this.$emit("mapClick", configMapImg, evt, dragType);
            },
            (wheelZoomFun) => {
              if (this.markEvt.item) {
                if (this.isShowDelIcon) {
                  this.calculationMarkDelIcon(
                    this.markEvt.item,
                    this.markEvt.evt,
                    ""
                  );
                }
                this.calculationMarkInfo(
                  this.markEvt.item,
                  this.markEvt.evt,
                  ""
                );
              }
              this.wheelZoom(wheelZoomFun);
            }
          );
        });
      };
      image.src = mapInitParams.picture;
      // });
      // this.$emit('init');
      // console.log("初始化舞台和地图", this.CKMapObject);
    },
    // 监听鼠标在地图容器的移动
    mapMousemove(configMapImg, evt, dragType) {
      this.$emit('mapMousemove', {configMapImg, evt, dragType});
    },
    // 地图容器鼠标滑动缩放
    wheelZoom(wheelZoomInfo) {
      this.$emit('wheelZoom', {wheelZoomInfo: wheelZoomInfo, CKMap: this.CKMapObject});
      // console.log("地图容器鼠标滑动缩放", wheelZoomInfo);
    },
    // 地图容器点击
    mapClick(configMapImg, evt, dragType) {
      this.$emit("mapClick", configMapImg, evt, dragType);
    },
    // 地图容器拖拽开始
    mapDragstart(configMapImg, evt, dragType) {
      this.$emit("mapDragstart", configMapImg, evt, dragType);
    },
    // 地图容器拖拽移动
    mapDragmove(configMapImg, evt, dragType) {
      this.$emit("mapDragmove", configMapImg, evt, dragType);
    },
    // 地图容器拖拽结束
    mapDragend(configMapImg, evt, dragType) {
      this.$emit("mapDragend", configMapImg, evt, dragType);
    },
    // 添加--更新--删除整个通道下的图标，折线段，线段矩形点，扇形，扇形编辑点
    // types--['point', 'defence', 'wedge', 'alarm']
    // drawMap(callback, mapElementId, types) {
    repaint(callback, mapElementId, types) {
      // js-api
      // 全部添加
      if (!mapElementId) {
        let drawType = {
          type: 'add',
          mapElementId: "",
          itemType: ['point', 'defence', 'wedge', 'alarm'] || types,
          addMarkersListArray: this.markersList,
          addDefenceLinesListArray: this.defenceLinesList,
          addAlarmLinesListArray: this.alarmLinesList,
          updateMarkersListArray: [],
          updateDefenceLinesListArray: [],
          updateAlarmLinesListArray: [],
        };
        this.drawJudge(drawType); // 没有传mapElementId，默认是初始化，覆盖物数组里的数据，全部画
        this.markersListTemp = JSON.parse(JSON.stringify(this.markersList)); // 暂存数据
        this.defenceLinesListTemp = JSON.parse(JSON.stringify(this.defenceLinesList)); // 暂存数据
        this.alarmLinesListTemp = JSON.parse(JSON.stringify(this.alarmLinesList)); // 暂存数据
        return;
      }
      // 批量添加--批量修改
      if (!(this.markersList.filter((item, k) => item.data.mapElementId === mapElementId).length)) { // 传入mapElementId找不到，用户操作错误，无中生有
        return;
      }
      if (this.markersList.filter((item, k) => item.data.mapElementId === mapElementId).length) { // 传入mapElementId，在新数据找到
        // 添加
        if (!(this.markersListTemp.filter((item, k) => item.data.mapElementId === mapElementId).length)) { // 传入mapElementId，在旧数据找不到
          let drawType = {
            type: 'add',
            mapElementId: mapElementId,
            itemType: types,
            addMarkersListArray: this.markersList.filter((item, k) => item.data.mapElementId === mapElementId),
            addDefenceLinesListArray: this.defenceLinesList.filter((item, k) => item.data.mapElementId === mapElementId),
            addAlarmLinesListArray: this.alarmLinesList.filter((item, k) => item.data.mapElementId === mapElementId),
            updateMarkersListArray: [],
            updateDefenceLinesListArray: [],
            updateAlarmLinesListArray: [],
          };
          this.drawJudge(drawType); // 传mapElementId，批量添加
        }
        // 修改
        if (this.markersListTemp.filter((item, k) => item.data.mapElementId === mapElementId).length) { // 传入mapElementId，在旧数据找到
          let drawType = {
            type: 'update',
            mapElementId: mapElementId,
            itemType: types,
            addMarkersListArray: [],
            addDefenceLinesListArray: [],
            addAlarmLinesListArray: [],
            updateMarkersListArray: this.markersList.filter((item, k) => item.data.mapElementId === mapElementId),
            updateDefenceLinesListArray: this.defenceLinesList.filter((item, k) => item.data.mapElementId === mapElementId),
            updateAlarmLinesListArray: this.alarmLinesList.filter((item, k) => item.data.mapElementId === mapElementId),
          };
          this.drawJudge(drawType); // 传mapElementId，批量修改
        }
        this.markersListTemp = JSON.parse(JSON.stringify(this.markersList)); // 暂存数据
        this.defenceLinesListTemp = JSON.parse(JSON.stringify(this.defenceLinesList)); // 暂存数据
        this.alarmLinesListTemp = JSON.parse(JSON.stringify(this.alarmLinesList)); // 暂存数据
      }
      // console.log("更新整个通道下的图标，线段和线段点", mapElementId, this.markersListTemp, this.markersList);
    },
    // 添加，修改，删除，调用方法判断
    drawJudge(drawType) {
      this.markAddArray = {
        markArray: [],
      };
      this.markUpdateArray = {
        updateArray: [],
      };
      this.lineAddArray = {
        lineArray: [],
      };
      this.lineUpdateArray = {
        updateArray: [],
      };
      this.wedgeAddArray = {
        wedgeArray: [],
      };
      this.wedgeUpdateArray = {
        updateArray: [],
      };
      this.alarmLineAddArray = {
        lineArray: [],
      };
      this.alarmLineUpdateArray = {
        updateArray: [],
      };
      this.markAddArray.markArray = this.formDataMark(drawType.addMarkersListArray).markArray; // mak图标点格式化数据
      this.lineAddArray.lineArray = this.formDataLine(drawType.addDefenceLinesListArray).lineArray; // 线段点格式化数据
      this.wedgeAddArray.wedgeArray = this.formDataWedge(drawType.addMarkersListArray).wedgeArray; // 扇形和扇形编辑点格式化数据
      this.alarmLineAddArray.lineArray = this.formDataF7AlarmLine(drawType.addAlarmLinesListArray).lineArray; // F7报警线段格式化数据
      this.markUpdateArray.updateArray = this.formDataMark(drawType.updateMarkersListArray).markArray; // mak图标点格式化数据
      this.lineUpdateArray.updateArray = this.formDataLine(drawType.updateDefenceLinesListArray).lineArray; // 线段点格式化数据
      this.wedgeUpdateArray.updateArray = this.formDataWedge(drawType.updateMarkersListArray).wedgeArray; // 扇形和扇形编辑点格式化数据
      this.alarmLineUpdateArray.updateArray = this.formDataF7AlarmLine(drawType.updateAlarmLinesListArray).lineArray; // F7报警线段格式化数据
      // console.log('drawType', drawType, this.wedgeUpdateArray);
      drawType && drawType.itemType.includes('point') && (drawType.type === 'add') && this.addMark(); // 添加图标点
      drawType && drawType.itemType.includes('defence') && (drawType.type === 'add') && this.addPoint(); // 添加线段矩形点
      drawType && drawType.itemType.includes('defence') && (drawType.type === 'add') && this.addLine(); // 添加折线段
      drawType && drawType.itemType.includes('wedge') && (drawType.type === 'add') && this.addWedge(); // 添加扇形
      drawType && drawType.itemType.includes('wedge') && (drawType.type === 'add') && this.addWedgeEditPoint(); // 添加扇形编辑点
      drawType && drawType.itemType.includes('alarm') && (drawType.type === 'add') && this.addAlarmLine(); // 添加F7报警线段
      drawType && drawType.itemType.includes('point') && (drawType.type === 'update') && this.updateMark(drawType.mapElementId); // 修改更新图标点
      drawType && drawType.itemType.includes('defence') && (drawType.type === 'update') && this.updatePoint(drawType.mapElementId); // 修改更新线段矩形点
      drawType && drawType.itemType.includes('defence') && (drawType.type === 'update') && this.updateLine(drawType.mapElementId); // 修改更新折线段
      drawType && drawType.itemType.includes('wedge') && (drawType.type === 'update') && this.updateWedge(drawType.mapElementId); // 修改扇形
      drawType && drawType.itemType.includes('wedge') && (drawType.type === 'update') && this.updateWedgeEditPoint(); // 修改扇形编辑点
      drawType && drawType.itemType.includes('alarm') && (drawType.type === 'update') && this.updateAlarmLine(drawType.mapElementId); // 修改F7报警线段
      drawType && drawType.itemType.includes('point') && (drawType.type === 'delete') && this.deleteMark(); // 删除图标点
      drawType && drawType.itemType.includes('defence') && (drawType.type === 'delete') && this.deletePoint(); // 删除线段矩形点
      drawType && drawType.itemType.includes('defence') && (drawType.type === 'delete') && this.deleteLine(); // 删除折线段
      drawType && drawType.itemType.includes('wedge') && (drawType.type === 'delete') && this.deleteWedge(); // 删除扇形
      drawType && drawType.itemType.includes('wedge') && (drawType.type === 'delete') && this.deleteWedgeEditPoint(); // 删除扇形编辑点
      drawType && drawType.itemType.includes('alarm') && (drawType.type === 'delete') && this.deleteAlarmLine(); // 删除F7报警线段
      // console.log("更新整个通道下的图标，线段和线段点", drawType, this.markersListTemp, this.markersList);
    },
    // 添加图标点
    addMark() {
      this.CKMapObject && this.CKMapObject.addMark(
        this.markAddArray,
        (item, evt, dragType) => {
          if (dragType.dragName === "click") {
            this.markClick(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "dbclick") {
            this.markDbClick(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "dragmove") {
            this.calculationMarkDelIcon(item, evt, dragType); // 计算mark右上角删除图标的位置
            this.markDragmove(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "dragend") {
            this.markDragend(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "mousemove") {
            this.calculationMarkDelIcon(evt.target.attrs.item, evt, dragType); // 计算mark右上角删除图标的位置
            this.markMousemove(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "mouseout") {
            setTimeout(() => {
              this.markMouseData = evt.target.attrs.item || item.originData;
              this.isShowDelIcon = this.isDelIconMouse;
            }, 100);
          }
        },
        (callback) => {}
      );
    },
    // 更新图标点
    updateMark(mapElementId) {
      // 更新画防区图标
      this.CKMapObject && this.CKMapObject.updateMark(this.markUpdateArray, () => {}); // 更新mark图标点
      // let markAddArrayTemp = {
      //   markArray: [],
      // };
      // markAddArrayTemp.markArray = this.markUpdateArray.updateArray;
      // let deleteArray = {
      //   deleteArray: [
      //     {
      //       id: mapElementId,
      //     },
      //   ],
      // };
      // this.CKMapObject.deleteMark(deleteArray, (resultInfo) => {
      //   this.isDelIconMouse = false;
      //   this.isShowDelIcon = false;
      //   this.CKMapObject.addMark(
      //     markAddArrayTemp,
      //     (item, evt, dragType) => {
      //       if (dragType.dragName === "click") {
      //         this.markClick(evt.target.attrs.item, evt, dragType);
      //       }
      //       if (dragType.dragName === "dbclick") {
      //         this.markDbClick(evt.target.attrs.item, evt, dragType);
      //       }
      //       if (dragType.dragName === "dragmove") {
      //         this.calculationMarkDelIcon(item, evt, dragType); // 计算mark右上角删除图标的位置
      //         this.markDragmove(evt.target.attrs.item, evt, dragType);
      //       }
      //       if (dragType.dragName === "dragend") {
      //         this.markDragend(evt.target.attrs.item, evt, dragType);
      //       }
      //       if (dragType.dragName === "mousemove") {
      //         this.calculationMarkDelIcon(evt.target.attrs.item, evt, dragType); // 计算mark右上角删除图标的位置
      //         this.markMousemove(evt.target.attrs.item, evt, dragType);
      //       }
      //       if (dragType.dragName === "mouseout") {
      //         setTimeout(() => {
      //           this.markMouseData = evt.target.attrs.item || item.originData;
      //           this.isShowDelIcon = this.isDelIconMouse;
      //         }, 100);
      //       }
      //     },
      //     (callback) => {}
      //   );
      //   // console.log("删除地图里的图标元素，及其附属线段", resultInfo);
      // });
      // console.log("更新画防区图标", this.markUpdateArray);
    },
    // 删除图标点
    deleteMark(mapElementId) {
      let deleteArray = {
        deleteArray: [
          {
            id: mapElementId,
          },
        ],
      };
      this.markersListTemp.forEach((item, index) => {
        if (item.data.mapElementId === mapElementId) {
          this.markersListTemp.splice(index, 1);
        }
      });
      this.CKMapObject && this.CKMapObject.deleteMark(deleteArray, (resultInfo) => {
        this.isDelIconMouse = false;
        this.isShowDelIcon = false;
        // this.markersListTemp = JSON.parse(JSON.stringify(this.markersList));
        // console.log("删除地图里的图标元素，及其附属线段", resultInfo);
      });
    },
    // 删除图标点，及其附属线段矩形点，折线段，扇形，扇形编辑点, 报警线段
    deleteMarkAndChildren(mapElementId) {
      this.deletePoint(mapElementId); // 删除线段矩形点
      this.deleteLine(mapElementId); // 删除折线段
      this.deleteMark(mapElementId); // 删除图标点
      this.deleteWedge(mapElementId); // 删除扇形
      this.deleteWedgeEditPoint(mapElementId); // 删除扇形编辑点
      this.deleteAlarmLine(mapElementId); // 删除报警线段
    },
    // 添加线段矩形点
    addPoint() {
      this.CKMapObject && this.CKMapObject.addPoint(
        this.lineAddArray,
        (item, evt, dragType) => {
          if (dragType.dragName === "click") {
            this.rectPointClick(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "dragmove") {
            // this.calculationRectPointDelIcon(item, evt, dragType); // 计算线段点右上角删除图标的位置
            this.rectPointDragmove(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "dragend") {
            // this.$emit('ondragend', {item: item, e: evt});
            this.rectPointDragend(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "mousemove") {
            // this.calculationRectPointDelIcon(evt.target.attrs.item, evt, dragType); // 计算线段点右上角删除图标的位置
          }
          if (dragType.dragName === "mouseout") {
          }
        },
        (callback) => {}
      );
    },
    // 更新线段矩形点
    updatePoint(mapElementId) {
      // this.CKMapObject.updatePoint(this.lineUpdateArray); // 更新线段矩形点
      let lineAddArrayTemp = {
        lineArray: [],
      };
      lineAddArrayTemp.lineArray = this.lineUpdateArray.updateArray;
      let deleteArray = {
        deleteArray: [
          {
            id: `linenormal${mapElementId}`,
            name: `linenormal${mapElementId}`,
            rectPointName: `linerect${mapElementId}`,
            rectTextName: `labellinerect${mapElementId}`,
          },
        ],
      };
      this.CKMapObject && this.CKMapObject.deleteRectTextPoint(deleteArray, (resultInfo) => {});
      this.CKMapObject && this.CKMapObject.deletePoint(deleteArray, (resultInfo) => {});
      this.CKMapObject && this.CKMapObject.addPoint(
        lineAddArrayTemp,
        (item, evt, dragType) => {
          if (dragType.dragName === "click") {
            this.rectPointClick(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "dragmove") {
            // this.calculationRectPointDelIcon(item, evt, dragType); // 计算线段点右上角删除图标的位置
            this.rectPointDragmove(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "dragend") {
            // this.$emit('ondragend', {item: item, e: evt});
            this.rectPointDragend(evt.target.attrs.item, evt, dragType);
          }
          if (dragType.dragName === "mousemove") {
            // this.calculationRectPointDelIcon(evt.target.attrs.item, evt, dragType); // 计算线段点右上角删除图标的位置
          }
          if (dragType.dragName === "mouseout") {
          }
        },
        (callback) => {}
      );
      // console.log("更新线段矩形点", this.lineUpdateArray, this.CKMapObject);
    },
    // 删除线段矩形点
    deletePoint(mapElementId) {
      let deleteArray = {
        deleteArray: [
          {
            id: `linenormal${mapElementId}`,
            name: `linenormal${mapElementId}`,
            rectPointName: `linerect${mapElementId}`,
            rectTextName: `labellinerect${mapElementId}`,
          },
        ],
      };
      this.CKMapObject && this.CKMapObject.deleteRectTextPoint(deleteArray, (resultInfo) => {
        // console.log("删除线段矩形端点，旁边标注", resultInfo);
      });
      this.CKMapObject && this.CKMapObject.deletePoint(deleteArray, (resultInfo) => {
        // console.log("删除线段矩形端点", resultInfo);
      });
    },
    // 添加折线段
    addLine() {
      this.CKMapObject && this.CKMapObject.addLine(this.lineAddArray, (item, evt, dragType) => {}, (callback) => {});
    },
    // 更新折线段
    updateLine(mapElementId) {
      // this.CKMapObject.updateLine(this.lineUpdateArray); // 更新折线段
      let lineAddArrayTemp = {
        lineArray: [],
      };
      lineAddArrayTemp.lineArray = this.lineUpdateArray.updateArray;
      let deleteArray = {
        deleteArray: [
          {
            id: `linenormal${mapElementId}`,
            name: `linenormal${mapElementId}`,
            rectPointName: `linerect${mapElementId}`,
            rectTextName: `labellinerect${mapElementId}`,
          },
        ],
      };
      this.CKMapObject && this.CKMapObject.deleteLine(deleteArray, (item, evt, dragType) => {}, (resultInfo) => {
        this.isDelIconMouse = false;
        this.isShowDelIcon = false;
        this.CKMapObject && this.CKMapObject.addLine(lineAddArrayTemp, (item, evt, dragType) => {}, (callback) => {});
        // this.defenceLinesListTemp = JSON.parse(JSON.stringify(this.defenceLinesList));
        // console.log("删除线段", resultInfo);
      });
      // console.log("更新折线段", this.lineUpdateArray, this.CKMapObject);
    },
    // 删除折线段
    deleteLine(mapElementId) {
      let deleteArray = {
        deleteArray: [
          {
            id: `linenormal${mapElementId}`,
            name: `linenormal${mapElementId}`,
            rectPointName: `linerect${mapElementId}`,
            rectTextName: `labellinerect${mapElementId}`,
          },
        ],
      };
      this.defenceLinesListTemp.forEach((item, index) => {
        if (item.data.mapElementId === mapElementId) {
          this.defenceLinesListTemp.splice(index, 1);
        }
      });
      this.CKMapObject && this.CKMapObject.deleteLine(deleteArray, (resultInfo) => {
        this.isDelIconMouse = false;
        this.isShowDelIcon = false;
        // this.defenceLinesListTemp = JSON.parse(JSON.stringify(this.defenceLinesList));
        // console.log("删除线段", resultInfo);
      });
    },
    // 删除线段及其矩形端点，旁边标注
    deleteLineItem(mapElementId) {
      this.deletePoint(mapElementId);
      this.deleteLine(mapElementId);
    },
    // 添加扇形
    addWedge() {
      this.CKMapObject && this.CKMapObject.addWedge(this.wedgeAddArray, (item, evt, dragType) => {}, (callback) => {});
      // console.log("画mark图标扇形视角", this.markersList, this.CKMapObject, this.wedgeAddArray);
    },
    // 更新扇形
    updateWedge(mapElementId, isCanEdit, finishback) {
      // this.CKMapObject.updateWedge(this.wedgeUpdateArray, (resultInfo) => {
      //   if (finishback && typeof finishback === 'function') {
      //     finishback(resultInfo);
      //   }
      // });
      let wedgeAddArrayTemp = {
        wedgeArray: [],
      };
      wedgeAddArrayTemp.wedgeArray = this.wedgeUpdateArray.updateArray;
      let deleteArray = {
        deleteArray: [
          {
            id: mapElementId,
          },
        ],
      };
      this.CKMapObject && this.CKMapObject.deleteWedge(deleteArray, (resultInfo) => {}); // 删除扇形
      this.CKMapObject && this.CKMapObject.deleteWedgeEditPoint(deleteArray, (resultInfo) => {}); // 删除扇形编辑点
      this.CKMapObject && this.CKMapObject.addWedge(wedgeAddArrayTemp, (item, evt, dragType) => {}, (callback) => {});
      this.CKMapObject && this.CKMapObject.addWedgeEditPoint(
        wedgeAddArrayTemp,
        (item, evt, dragType, wedgeMarkType) => {
          if (dragType.dragName === "dragend") {
            let wedgeEditPointDragendInfo = {
              wedgeConfig: evt.target.attrs.item.wedgeConfig,
              attrs: evt.target.attrs,
              evt: evt,
              dragType: dragType,
              wedgeMarkType: wedgeMarkType,
            };
            this.wedgeEditPointDragend(wedgeEditPointDragendInfo);
            // this.wedgeEditPointDragend(evt.target.attrs, evt, dragType, wedgeMarkType);
          }
        },
        (resultInfo) => {
          if (finishback && typeof finishback === 'function') {
            finishback(resultInfo);
          }
        }
      );
      // console.log("更新扇形", this.markersList, this.CKMapObject, this.wedgeUpdateArray);
    },
    // 删除扇形
    deleteWedge(mapElementId) {
      let deleteArray = {
        deleteArray: [
          {
            id: mapElementId,
          },
        ],
      };
      this.wedgeAddArray.wedgeArray.forEach((item, index) => {
        if (item.wedgeConfig.id === `wedge${mapElementId}`) {
          this.wedgeAddArray.wedgeArray.splice(index, 1);
        }
      });
      this.CKMapObject && this.CKMapObject.deleteWedge(deleteArray, (resultInfo) => {}); // 删除扇形
      this.CKMapObject && this.CKMapObject.deleteWedgeEditPoint(deleteArray, (resultInfo) => {}); // 删除扇形编辑点
    },
    // 添加扇形编辑点
    addWedgeEditPoint(finishback) {
      this.CKMapObject && this.CKMapObject.addWedgeEditPoint(
        this.wedgeAddArray,
        (item, evt, dragType, wedgeMarkType) => {
          if (dragType.dragName === "dragend") {
            let wedgeEditPointDragendInfo = {
              wedgeConfig: evt.target.attrs.item.wedgeConfig,
              attrs: evt.target.attrs,
              evt: evt,
              dragType: dragType,
              wedgeMarkType: wedgeMarkType,
            };
            this.wedgeEditPointDragend(wedgeEditPointDragendInfo);
            // this.wedgeEditPointDragend(evt.target.attrs, evt, dragType, wedgeMarkType);
          }
        },
        (resultInfo) => {
          if (finishback && typeof finishback === 'function') {
            finishback(resultInfo);
          }
        }
      );
    },
    // 更新扇形编辑点
    updateWedgeEditPoint() {
      this.CKMapObject && this.CKMapObject.updateWedgeEditPoint(this.wedgeUpdateArray, () => {}); // 更新扇形编辑点
    },
    // 删除扇形编辑点
    deleteWedgeEditPoint(mapElementId, finishback) {
      let deleteArray = {
        deleteArray: [
          {
            id: mapElementId,
          },
        ],
      };
      this.CKMapObject && this.CKMapObject.deleteWedgeEditPoint(deleteArray, (resultInfo) => {
        if (finishback && typeof finishback === 'function') {
          finishback(resultInfo);
        }
      }); // 删除扇形编辑点
    },
    // 设置显示或者隐藏扇形编辑点
    setWedgeEdit(mapElementId, isCanEdit, callback) {
      let wedgeEditPointSetArray = {
        updateArray: [],
      };
      this.wedgeAddArray.wedgeArray.forEach((item, k) => {
        if (item.wedgeConfig.id === `wedge${mapElementId}`) {
          item.wedgeConfig.wedgeEditPointVisible = isCanEdit;
          wedgeEditPointSetArray.updateArray.push(item);
        }
      });
      isCanEdit && this.deleteWedgeEditPoint(mapElementId);
      isCanEdit && this.addWedgeEditPoint(() => {
        isCanEdit && this.CKMapObject && this.CKMapObject.enableWedgeEditing(
          wedgeEditPointSetArray,
          (finishInfo) => {
            callback && callback(finishInfo);
          }
        );
      });
      !isCanEdit && this.deleteWedgeEditPoint(mapElementId, () => {});
      // !isCanEdit &&
      //   this.CKMapObject.disableWedgeEditing(
      //     wedgeEditPointSetArray,
      //     (finishInfo) => {
      //       callback(finishInfo);
      //     }
      //   );
    },
    // 扇形编辑点的拖拽结束
    // wedgeEditPointDragend(item, evt, dragType, wedgeMarkType) {
    wedgeEditPointDragend(wedgeEditPointDragendInfo) {
      // this.$emit("wedgeEditPointDragend", item, evt, dragType, wedgeMarkType);
      this.$emit("wedgeEditPointDragend", wedgeEditPointDragendInfo);
      // console.log("扇形编辑点的拖拽结束", item, evt, dragType, wedgeMarkType);
    },
    // mark图标点击
    markClick(item, evt, dragType) {
      this.markEvt = {
        item,
        evt,
      };
      let infoTop =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).y -
        40 -
        10 * (this.CKMapObject.scale - 1);
      let infoLeft =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).x +
        30 +
        50 * (this.CKMapObject.scale - 1);
      let offset = {
        x:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.width) ||
          0,
        y:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.height) ||
          0,
      };
      let x = evt.evt.x;
      let y = evt.evt.y;
      let point = {
        x: evt.target.attrs.x,
        y: evt.target.attrs.y,
      };
      let pointPixel = {
        x: 0,
        y: 0,
      };
      pointPixel = this.CKMapObject && this.CKMapObject.pixelToPoint(x, y, offset);
      const otherData = {
        infoTop,
        infoLeft,
        point,
        pointPixel,
        data: {
          channelName: item.data.channelName,
          pointX: pointPixel.x,
          pointY: pointPixel.y,
        },
        evt: evt,
      };
      this.markersListTemp.forEach((item, k) => {
        if (
          evt.target.attrs.item.data.mapElementId === item.data.mapElementId
        ) {
          item.data.pointX = evt.evt.offsetX;
          item.data.pointY = evt.evt.offsetY;
        }
      });
      point.markersList = JSON.parse(JSON.stringify(this.markersListTemp));
      this.$emit("markClick", evt.target.attrs.item, otherData);
    },
    // mark图标双击
    markDbClick(item, evt, dragType) {
      this.markEvt = {
        item,
        evt,
      };
      let infoTop =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).y -
        40 -
        10 * (this.CKMapObject.scale - 1);
      let infoLeft =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).x +
        30 +
        50 * (this.CKMapObject.scale - 1);
      let offset = {
        x:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.width) ||
          0,
        y:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.height) ||
          0,
      };
      let x = evt.evt.x;
      let y = evt.evt.y;
      let point = {
        x: evt.target.attrs.x,
        y: evt.target.attrs.y,
      };
      let pointPixel = {
        x: 0,
        y: 0,
      };
      pointPixel = this.CKMapObject && this.CKMapObject.pixelToPoint(x, y, offset);
      const otherData = {
        infoTop,
        infoLeft,
        point,
        pointPixel,
        data: {
          channelName: item.data.channelName,
          pointX: pointPixel.x,
          pointY: pointPixel.y,
        },
        evt: evt,
      };
      this.markersListTemp.forEach((item, k) => {
        if (
          evt.target.attrs.item.data.mapElementId === item.data.mapElementId
        ) {
          item.data.pointX = evt.evt.offsetX;
          item.data.pointY = evt.evt.offsetY;
        }
      });
      point.markersList = JSON.parse(JSON.stringify(this.markersListTemp));
      this.$emit('markDbClick', evt.target.attrs.item, otherData);
    },
    // mark图标拖拽中
    markDragmove(item, evt, dragType) {
      let attrsX = evt.evt.offsetX;
      let attrsY = evt.evt.offsetY;
      if (attrsX < 21) {
        attrsX = 21;
      }
      if (attrsX > this.CKMapObject.layer.getWidth() - 21) {
        attrsX = this.CKMapObject.layer.getWidth() - 21;
      }
      if (attrsY < 26) {
        attrsY = 26;
      }
      if (attrsY > this.CKMapObject.layer.getHeight() - 26) {
        attrsY = this.CKMapObject.layer.getHeight() - 26;
      }
      this.markEvt = {
        item,
        evt,
      };
      let infoTop =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).y -
        40 -
        10 * (this.CKMapObject.scale - 1);
      let infoLeft =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).x +
        30 +
        50 * (this.CKMapObject.scale - 1);
      let offset = {
        x:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.width) ||
          0,
        y:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.height) ||
          0,
      };
      let x = evt.evt.x;
      let y = evt.evt.y;
      let point = {
        x: attrsX,
        y: attrsY,
      };
      let pointPixel = {
        x: 0,
        y: 0,
      };
      pointPixel = this.CKMapObject && this.CKMapObject.pixelToPoint(x, y, offset);
      const otherData = {
        infoTop,
        infoLeft,
        point,
        pointPixel,
        data: {
          channelName: item.data.channelName,
          pointX: pointPixel.x,
          pointY: pointPixel.y,
        },
        evt: evt,
      };
      this.markersListTemp.forEach((item, k) => {
        if (
          evt.target.attrs.item.data.mapElementId === item.data.mapElementId
        ) {
          item.data.pointX = attrsX;
          item.data.pointY = attrsY;
        }
      });
      point.markersList = JSON.parse(JSON.stringify(this.markersListTemp));
      this.$emit("markDragmove", evt.target.attrs.item, otherData);
    },
    // mark图标拖拽结束
    markDragend(item, evt, dragType) {
      this.markEvt = {
        item,
        evt,
      };
      let infoTop =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).y -
        40 -
        10 * (this.CKMapObject.scale - 1);
      let infoLeft =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).x +
        30 +
        50 * (this.CKMapObject.scale - 1);
      let offset = {
        x:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.width) ||
          0,
        y:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.height) ||
          0,
      };
      let x = evt.evt.layerX;
      let y = evt.evt.layerY;
      let point = {
        x: evt.evt.offsetX,
        y: evt.evt.offsetY,
      };
      let pointPixel = {
        x: 0,
        y: 0,
      };
      pointPixel = this.CKMapObject && this.CKMapObject.pixelToPoint(x, y, offset);
      const otherData = {
        infoTop,
        infoLeft,
        point,
        pointPixel,
        data: {
          channelName: item.data.channelName,
          pointX: pointPixel.x,
          pointY: pointPixel.y,
        },
        evt: evt,
      };
      this.markersListTemp.forEach((item1, k) => {
        if (
          evt.target.attrs.item.data.mapElementId === item1.data.mapElementId
        ) {
          item1.data.pointX = evt.evt.offsetX;
          item1.data.pointY = evt.evt.offsetY;
        }
      });
      this.wedgeAddArray.wedgeArray.forEach((item2, k) => {
        if (
          `wedge${evt.target.attrs.item.data.mapElementId}` ===
          item2.wedgeConfig.id
        ) {
          let center = {
            x: evt.evt.offsetX + 0,
            y: evt.evt.offsetY + 26,
          };
          item2.wedgeConfig.point = center;
          item2.wedgeConfig.center = center;
        }
      });
      point.markersList = JSON.parse(JSON.stringify(this.markersListTemp));
      this.$emit("markDragend", evt.target.attrs.item, otherData);
    },
    // mark图标悬浮事件
    markMousemove(item, evt, dragType) {
      this.isShowDelIcon = evt.target.attrs.isDelete;
      this.$emit("markMousemove", evt.target.attrs.item, {evt: evt}, evt);
    },
    // mark图标删除按钮点击
    delSingleEle(id, idName) {
      // js-api
      this.$emit("delSingleEle", this.markMouseData);
    },
    // 计算mark右上角删除图标的位置
    calculationMarkDelIcon(item, evt, dragType) {
      this.markEvt = {
        item,
        evt,
      };
      // this.isShowDelIcon = true;
      this.isShowDelIcon = evt.target.attrs.isDelete;
      this.imgTop =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).y -
        40 -
        10 * (this.CKMapObject.scale - 1);
      this.imgLeft =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).x +
        10 +
        50 * (this.CKMapObject.scale - 1);
    },
    // 计算mark右上角信息窗体的位置
    calculationMarkInfo(item, evt, dragType) {
      let infoTop =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).y -
        40 -
        10 * (this.CKMapObject.scale - 1);
      let infoLeft =
        this.CKMapObject && this.CKMapObject.pointToPixel(evt.target.attrs).x +
        30 +
        50 * (this.CKMapObject.scale - 1);
      let offset = {
        x:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.width) ||
          0,
        y:
          (evt.target.attrs.item.paint.iconOffsetSize &&
            evt.target.attrs.item.paint.iconOffsetSize.height) ||
          0,
      };
      let x = evt.evt.x;
      let y = evt.evt.y;
      let point = {
        x: evt.target.attrs.x,
        y: evt.target.attrs.y,
      };
      let pointPixel = {
        x: 0,
        y: 0,
      };
      pointPixel = this.CKMapObject && this.CKMapObject.pixelToPoint(x, y, offset);
      const otherData = {
        infoTop,
        infoLeft,
        point,
        pointPixel,
        data: {
          channelName: item.data.channelName,
          pointX: pointPixel.x,
          pointY: pointPixel.y,
        },
      };
      this.$emit("calculationMarkInfo", evt.target.attrs.item, otherData);
    },
    // mark图标的右上角删除按钮出现
    delMouse() {
      // js-api
      // console.log('mark图标的右上角删除按钮出现');
      this.isDelIconMouse = true;
      this.isShowDelIcon = true;
    },
    // mark图标的右上角删除按钮隐藏
    closeDelIcon() {
      this.isDelIconMouse = false;
      this.isShowDelIcon = false;
    },
    // 线段某个矩形框端点的点击
    rectPointClick(item, evt, dragType) {
      let point = {
        x: evt.evt.offsetX,
        y: evt.evt.offsetY,
        index: evt.target.attrs.index,
        defenceLinesList: [],
      };
      this.defenceLinesListTemp.forEach((data, k) => {
        if (item.data.mapElementId === data.data.mapElementId) {
          data.data.lines.forEach((itemL, m) => {
            if (evt.target.attrs.index === m) {
              itemL.pointX = evt.evt.offsetX;
              itemL.pointY = evt.evt.offsetY;
            }
          });
        }
      });
      point.defenceLinesList = JSON.parse(
        JSON.stringify(this.defenceLinesListTemp)
      );
      const otherData = { point };
      this.$emit("rectPointClick", evt.target.attrs.item, otherData);
    },
    // 线段某个矩形框端点的拖动
    rectPointDragmove(item, evt, dragType) {
      let attrsX = evt.evt.offsetX;
      let attrsY = evt.evt.offsetY;
      if (attrsX < 8) {
        attrsX = 8;
      }
      if (attrsX > this.CKMapObject.layer.getWidth() - 12) {
        attrsX = this.CKMapObject.layer.getWidth() - 12;
      }
      if (attrsY < 8) {
        attrsY = 8;
      }
      if (attrsY > this.CKMapObject.layer.getHeight() - 14) {
        attrsY = this.CKMapObject.layer.getHeight() - 14;
      }
      let point = {
        x: attrsX,
        y: attrsY,
        index: evt.target.attrs.index,
        defenceLinesList: [],
      };
      this.defenceLinesListTemp.forEach((data, k) => {
        if (item.data.mapElementId === data.data.mapElementId) {
          data.data.lines.forEach((itemL, m) => {
            if (evt.target.attrs.index === m) {
              itemL.pointX = attrsX;
              itemL.pointY = attrsY;
            }
          });
        }
      });
      point.defenceLinesList = JSON.parse(
        JSON.stringify(this.defenceLinesListTemp)
      );
      const otherData = { point };
      let lineUpdateArrayTemp = {
        updateArray: [],
      };
      item.data.lines.forEach((itemL, m) => {
        if (evt.target.attrs.index === m) {
          itemL.pointX = attrsX;
          itemL.pointY = attrsY;
        }
      });
      lineUpdateArrayTemp.updateArray = this.formDataLine([item]).lineArray; // 线段点格式化数据
      this.CKMapObject && this.CKMapObject.updateLine(lineUpdateArrayTemp); // 更新折线段
      // console.log("线段某个矩形框端点的拖动", this.CKMapObject, item);
      this.$emit("rectPointDragmove", evt.target.attrs.item, otherData);
    },
    // 线段某个矩形框端点的拖动结束
    rectPointDragend(item, evt, dragType) {
      // let offset = {
      //   x: (evt.target.attrs.item.paint.rectOffsetSize && evt.target.attrs.item.paint.rectOffsetSize.width) || 0,
      //   y: (evt.target.attrs.item.paint.rectOffsetSize && evt.target.attrs.item.paint.rectOffsetSize.height) || 0,
      // };
      // let pointPixel = this.CKMapObject.pixelToPoint(evt.evt.offsetX, evt.evt.offsetY, offset);
      let point = {
        x: evt.evt.offsetX,
        y: evt.evt.offsetY,
        // x: pointPixel.x,
        // y: pointPixel.y,
        index: evt.target.attrs.index,
        defenceLinesList: [],
      };
      this.defenceLinesListTemp.forEach((data, k) => {
        // let tempItem = item.data.lines;
        if (item.data.mapElementId === data.data.mapElementId) {
          data.data.lines.forEach((itemL, m) => {
            if (evt.target.attrs.index === m) {
              itemL.pointX = evt.evt.offsetX;
              itemL.pointY = evt.evt.offsetY;
              // itemL.pointX = pointPixel.x;
              // itemL.pointY = pointPixel.y;
            }
          });
        }
      });
      point.defenceLinesList = JSON.parse(
        JSON.stringify(this.defenceLinesListTemp)
      );
      const otherData = { point };
      this.$emit("rectPointDragend", evt.target.attrs.item, otherData);
      // console.log("线段某个矩形框端点的拖动结束", item, this.CKMapObject, otherData);
    },
    // 计算线段点右上角删除图标的位置
    calculationRectPointDelIcon() {},
    // 批量设置地图元素显示，隐藏状态
    setVisible() {
      // js-api
    },
    // 绘制工具方法，添加围栏线，框选，圆选，多边形选，扇形编辑
    // @param {string} type 类型[polyline,rectangle,polygon,circle]
    draw(type, callBack, clickCall, noShowMidPoint) {
      switch (type) {
        case "stop":
          this.CKMapObject && this.CKMapObject.closeDrawManger();
          // this.CKMapObject.openDrawManger && this.CKMapObject.openDrawManger.close();
          break;
        case "polylines":
          // this.CKMapObject.drawingManager.open();
          this.CKMapObject && this.CKMapObject.openDrawManger(
            "polyline",
            (foldLineDrawGroup, e, points, linePoints) => {
              callBack && callBack({foldLineDrawGroup, e, points, linePoints});
            },
            (clickCallPointX, clickCallPointY) => {
              clickCall && clickCall(clickCallPointX, clickCallPointY);
            },
            (noShowMidPoint) => {}
          );
          break;
        case "rect":
          // this.CKMapObject.drawingManager.open();
          this.CKMapObject && this.CKMapObject.openDrawManger(
            "rect",
            (rectDrawGroup, e, option) => {
              this.selectDataReturn("rect");
              callBack && callBack(rectDrawGroup, e, option);
            }
          );
          break;
        case "rectangle":
          // this.CKMapObject.drawingManager.open();
          this.CKMapObject && this.CKMapObject.openDrawManger(
            "rectangle",
            (rectDrawGroup, e, option) => {
              this.selectDataReturn("rectangle");
              callBack && callBack(rectDrawGroup, e, option);
            }
          );
          break;
        case "polygon":
          // this.CKMapObject.openDrawManger();
          this.CKMapObject && this.CKMapObject.openDrawManger(
            "polygon",
            (polygonDrawGroup, e, option) => {
              this.selectDataReturn("polygon");
              callBack && callBack(polygonDrawGroup, e, option);
            }
          );
          break;
        case "circle":
          // this.CKMapObject.openDrawManger();
          this.CKMapObject && this.CKMapObject.openDrawManger(
            "circle",
            (circleDrawGroup, e, option) => {
              this.selectDataReturn("circle");
              callBack && callBack(circleDrawGroup, e, option);
            }
          );
          break;
        default:
          break;
      }
    },
    // 选择工具，框选包含的点返回
    selectDataReturn(type) {
      let selectData = {
        type: "",
        data: [],
      };
      switch (type) {
        case "rect":
          this.CKMapObject && this.CKMapObject.rectangleSelect(
            (rectSelectArr, markGroupData, rectDrawGroupData) => {
              selectData.type = 'rect';
              rectSelectArr.forEach((item, k) => {
                selectData.data.push(item.attrs.item);
              });
              this.$emit("selectDataReturn", selectData);
              // console.log("矩形框选返回", rectSelectArr, markGroupData, rectDrawGroupData);
            }
          );
          break;
        case "rectangle":
          this.CKMapObject && this.CKMapObject.rectangleSelect(
            (rectSelectArr, markGroupData, rectDrawGroupData) => {
              selectData.type = 'rectangle';
              rectSelectArr.forEach((item, k) => {
                selectData.data.push(item.attrs.item);
              });
              this.$emit("selectDataReturn", selectData);
              // console.log("矩形框选返回", rectSelectArr, markGroupData, rectDrawGroupData);
            }
          );
          break;
        case "circle":
          this.CKMapObject && this.CKMapObject.circleSelect(
            (circleSelectArr, markGroupData, rectDrawGroupData) => {
              selectData.type = 'circle';
              circleSelectArr.forEach((item, k) => {
                selectData.data.push(item.attrs.item);
              });
              this.$emit("selectDataReturn", selectData);
              // console.log("圆形框选返回", circleSelectArr, markGroupData,  rectDrawGroupData);
            }
          );
          break;
        case "polygon":
          this.CKMapObject && this.CKMapObject.polygonSelect(
            (polygonSelectArr, markGroupData, rectDrawGroupData) => {
              selectData.type = 'polygon';
              polygonSelectArr.forEach((item, k) => {
                selectData.data.push(item.attrs.item);
              });
              this.$emit("selectDataReturn", selectData);
              // console.log("多边形框选返回", circleSelectArr, markGroupData, rectDrawGroupData);
            }
          );
          break;
        default:
          break;
      }
    },
    // 清除绘制工具，绘制的围栏线，框选，圆选，多边形选，扇形等
    deleteDraWItem() {
      this.CKMapObject && this.CKMapObject.deleteDraWItem();
    },
    // 清除地图的所有元素，包括地图的图片
    clearMapAll(callback) {
      this.CKMapObject && this.CKMapObject.clearMapAll((finishInfo) => { callback && callback(finishInfo); });
    },
    // 清除地图的所有元素，地图的图片不清除
    clearMapItem() {
      this.CKMapObject && this.CKMapObject.clearMapItem();
    },
    // 设置画布在容器里，移动定位到元素的大概位置
    // ItemCenter--{id, x, y...}
    mapCenter(ItemCenter) {
      !ItemCenter && !ItemCenter.id && this.CKMapObject && this.CKMapObject.setCenter();
      ItemCenter && this.CKMapObject && this.CKMapObject.setItemCenter(ItemCenter);
    },
    // 地图居中，回到中心点，或者移动定位到元素的大概位置
    center(ItemCenter) {
      this.CKMapObject && this.CKMapObject.setItemCenter(ItemCenter);
    },
    // 放大一级地图
    enlargeMap(scaleNum) {
      this.CKMapObject && this.CKMapObject.zoomIn(scaleNum);
    },
    // 缩小一级地图
    reduceMap(scaleNum) {
      this.CKMapObject && this.CKMapObject.zoomOut(scaleNum);
    },
    // 报警图标，线段开启动画
    alarmAnimationStart(intervalTime) {
      this.playAnimationArray = {
        playArray: [],
      };
      this.alarmLinesList.forEach((item, k) => {
        if (item.paint.isTwinkle) {
          this.playAnimationArray.playArray.push({
            markConfig: {
              id: item.data.mapElementId,
              isTwinkle: item.paint.isTwinkle,
            },
            alarmLineConfig: {
              id: `lineAlarm${item.data.mapElementId}${k}`,
              name: `lineAlarm${item.data.mapElementId}`,
              isTwinkle: item.paint.isTwinkle,
            },
          });
        }
      });
      this.defenceLinesList.forEach((item, k) => {
        if (item.paint.isTwinkle) {
          this.playAnimationArray.playArray.push({
            markConfig: {
              id: item.data.mapElementId,
              isTwinkle: item.paint.isTwinkle,
            },
            alarmLineConfig: {
              id: `linenormal${item.data.mapElementId}${k}`,
              name: `linenormal${item.data.mapElementId}`,
              isTwinkle: item.paint.isTwinkle,
            },
          });
        }
      });
      this.CKMapObject && this.CKMapObject.alarmAnimationStart(
        this.playAnimationArray,
        intervalTime,
        (callback) => {}
      );
    },
    // 报警图标，线段更新动画
    alarmAnimationUpdate(intervalTime) {
      this.playAnimationArray = {
        playArray: [],
      };
      this.alarmLinesList.forEach((item, k) => {
        if (item.paint.isTwinkle) {
          this.playAnimationArray.playArray.push({
            markConfig: {
              id: item.data.mapElementId,
              isVisible: item.paint.isVisible,
              isTwinkle: item.paint.isTwinkle,
            },
            alarmLineConfig: {
              id: item.data.mapElementId,
              isVisible: item.paint.isVisible,
              isTwinkle: item.paint.isTwinkle,
            },
          });
        }
      });
      this.CKMapObject && this.CKMapObject.alarmAnimationUpdate(
        this.playAnimationArray,
        intervalTime,
        (callback) => {}
      );
    },
    // 报警图标，线段销毁动画
    alarmAnimationStop() {
      this.CKMapObject && this.CKMapObject.alarmAnimationStop();
    },
    // 添加报警线段
    addAlarmLine() {
      // js-api
      this.CKMapObject && this.CKMapObject.addAlarmLine(this.alarmLineAddArray, (item, evt, dragType) => {}, (callback) => {});
      // console.log("添加报警线段", this.alarmLinesList, this.alarmLineAddArray);
    },
    // 更新报警线段
    updateAlarmLine(mapElementId) {
      let alarmLinesListTemp = {
        lineArray: [],
      };
      alarmLinesListTemp.lineArray = this.alarmLineUpdateArray.updateArray;
      let deleteArray = {
        deleteArray: [
          {
            id: `lineAlarm${mapElementId}`,
            name: `lineAlarm${mapElementId}`,
          },
        ],
      };
      this.CKMapObject && this.CKMapObject.deleteAlarmLine(deleteArray, (item, evt, dragType) => {}, (resultInfo) => {
        this.isDelIconMouse = false;
        this.isShowDelIcon = false;
        this.CKMapObject && this.CKMapObject.addAlarmLine(alarmLinesListTemp, (item, evt, dragType) => {}, (callback) => {});
      }); // 删除报警线段
      // console.log("更新报警线段", this.alarmLinesList, this.alarmLineUpdateArray);
    },
    // 删除报警线段
    deleteAlarmLine(mapElementId) {
      let deleteArray = {
        deleteArray: [
          {
            id: `lineAlarm${mapElementId}`,
            name: `lineAlarm${mapElementId}`,
          },
        ],
      };
      this.CKMapObject && this.CKMapObject.deleteAlarmLine(deleteArray, (resultInfo) => {}); // 删除报警线段
    },
    // 格式化图标点数据，转换成canvas画图必须的参数格式
    formDataMark(markData) {
      let markAddArrayTemp = {
        markArray: [],
      };
      markData.length &&
        markData.forEach((item, k) => {
          markAddArrayTemp.markArray.push({
            markConfig: {
              id: item.data.mapElementId,
              width: (Number(item.paint.iconSize) && Number(item.paint.iconSize.width)) || 40,
              height: (Number(item.paint.iconSize) && Number(item.paint.iconSize.height)) || 53,
              iconSrc: item.paint.iconUrl,
              point: {
                x: Number(item.data.pointX),
                y: Number(item.data.pointY),
              },
              offset: {
                x:
                  (Number(item.paint.iconOffsetSize) &&
                    Number(item.paint.iconOffsetSize.width)) ||
                  20,
                y:
                  (Number(item.paint.iconOffsetSize) &&
                    Number(item.paint.iconOffsetSize.height)) ||
                  26,
              },
              draggable: item.paint.isDragging,
              visible: item.paint.isVisible,
              isVisible: item.paint.isVisible,
              isClick: item.paint.isClick,
              isTwinkle: item.paint.isTwinkle,
              isDelete: item.paint.isDelete,
              zIndexWedge: item.paint.zIndexWedge || 16,
              zIndexMark: item.paint.zIndexMark || 30,
              item: item,
            },
            originData: item,
          });
        });
      return markAddArrayTemp;
    },
    // 格式化线段数据，转换成canvas画图必须的参数格式
    formDataLine(lineData) {
      let lineAddArrayTemp = {
        lineArray: [],
      };
      lineData.length &&
        lineData.forEach((item, k) => {
          let tempItem = item.data.lines;
          item.data.lines.forEach((itemL, m) => {
            let lineStartX = Number(itemL.pointX); // 线段起点坐标x
            let lineStartY = Number(itemL.pointY); // 线段起点坐标y
            let lineEndX =
              tempItem.length === 1 ? tempItem[0].pointX : m < tempItem.length - 1 ? tempItem[m + 1].pointX : tempItem[m].pointX; // 线段终点坐标x
            let lineEndY =
              tempItem.length === 1 ? tempItem[0].pointY : m < tempItem.length - 1 ? tempItem[m + 1].pointY : tempItem[m].pointY; // 线段终点坐标y
            lineAddArrayTemp.lineArray.push({
              pointConfig: {
                id: `linerect${item.data.mapElementId}${m}`,
                name: `linerect${item.data.mapElementId}`,
                index: m,
                width: (Number(item.paint.rectSize) && Number(item.paint.rectSize.width)) || 14,
                height:
                  (Number(item.paint.rectSize) && Number(item.paint.rectSize.height)) || 14,
                point: {
                  x: Number(itemL.pointX),
                  y: Number(itemL.pointY),
                },
                offset: {
                  x:
                    (Number(item.paint.rectOffsetSize) &&
                      Number(item.paint.rectOffsetSize.width)) ||
                    8,
                  y:
                    (Number(item.paint.rectOffsetSize) &&
                      Number(item.paint.rectOffsetSize.width)) ||
                    8,
                },
                fill: item.paint.rectFill,
                stroke: item.paint.rectStroke,
                strokeWidth: item.paint.rectStrokeWidth,
                draggable: item.paint.isEditable,
                visible: item.paint.isEditable ? item.paint.isVisible : false,
                isVisible: item.paint.isVisible,
                isClick: item.paint.isClick,
                isEditable: item.paint.isEditable,
                isTwinkle: item.paint.isTwinkle,
                isDelete: item.paint.isDelete,
                zIndexLinePoint: item.paint.zIndexLinePoint,
                item: item,
              },
              lineConfig: {
                id: `linenormal${item.data.mapElementId}${m}`,
                name: `linenormal${item.data.mapElementId}`,
                stroke: item.paint.lineColor,
                strokeWidth: item.paint.lineWidth,
                points: [Number(lineStartX), Number(lineStartY), Number(lineEndX), Number(lineEndY)],
                draggable: item.paint.isDragging,
                visible: item.paint.isVisible,
                isVisible: item.paint.isVisible,
                isClick: item.paint.isClick,
                isEditable: item.paint.isEditable,
                isTwinkle: item.paint.isTwinkle,
                isDelete: item.paint.isDelete,
                zIndexLine: item.paint.zIndexLine,
                item: item,
              },
              originData: item,
            });
          });
        });
      return lineAddArrayTemp;
    },
    // 格式化扇形数据，转换成canvas画图必须的参数格式
    formDataWedge(wedgeData) {
      let wedgeAddArrayTemp = {
        wedgeArray: [],
      };
      wedgeData.length &&
        wedgeData.forEach((item, k) => {
          let center = {
            x: Number(item.data.pointX) + 0,
            y: Number(item.data.pointY) + 26,
          };
          let radius = Number(item.data.extInfo.view.radius) || 60;
          let startAngle = Number(item.data.extInfo.view.startAngle) || 60;
          let endAngle = Number(item.data.extInfo.view.endAngle) || 120;
          let pointStart = this.CKMapObject && this.CKMapObject.getCurvePoint(
            center,
            radius,
            startAngle
          );
          let pointMiddle = this.CKMapObject && this.CKMapObject.getCurvePoint(
            center,
            radius,
            (endAngle - startAngle) / 2 + startAngle
          );
          let pointEnd = this.CKMapObject && this.CKMapObject.getCurvePoint(
            center,
            radius,
            endAngle
          );
          wedgeAddArrayTemp.wedgeArray.push({
            wedgeConfig: {
              id: `wedge${item.data.mapElementId}`,
              name: `wedge${item.data.mapElementId}`,
              point: center,
              center: center,
              x: Number(item.data.pointX) + 10,
              y: Number(item.data.pointY) + 26,
              radius: radius,
              startAngle: startAngle,
              endAngle: endAngle,
              angle: endAngle - startAngle,
              // rotation: -item.data.extInfo.view.endAngle
              rotation: -((startAngle - 0) % 360),
              wedgeVisible: item.paint.isWedgeVisible,
              wedgeEditPointVisible: item.paint.isWedgeEditPointVisible,
              zIndexWedge: item.paint.zIndexWedge || 1,
              pointStart: pointStart,
              pointMiddle: pointMiddle,
              pointEnd: pointEnd,
            },
          });
        });
      return wedgeAddArrayTemp;
    },
    // 格式化F7报警线段数据，转换成canvas画图必须的参数格式
    formDataF7AlarmLine(lineData) {
      let alarmLineAddArrayTemp = {
        lineArray: [],
      };
      lineData.length &&
        lineData.forEach((item, k) => {
          let tempItem = item.data.lines;
          item.data.lines.forEach((itemL, m) => {
            let lineStartX = Number(itemL.pointX); // 线段起点坐标x
            let lineStartY = Number(itemL.pointY); // 线段起点坐标y
            let lineEndX =
              tempItem.length === 1 ? tempItem[0].pointX : m < tempItem.length - 1 ? tempItem[m + 1].pointX : tempItem[m].pointX; // 线段终点坐标x
            let lineEndY =
              tempItem.length === 1 ? tempItem[0].pointY : m < tempItem.length - 1 ? tempItem[m + 1].pointY : tempItem[m].pointY; // 线段终点坐标y
            alarmLineAddArrayTemp.lineArray.push({
              pointConfig: {
                id: `alarmlinerect${item.data.mapElementId}${m}`,
                name: `alarmlinerect${item.data.mapElementId}`,
                index: m,
                width: (Number(item.paint.rectSize) && Number(item.paint.rectSize.width)) || 14,
                height:
                  (Number(item.paint.rectSize) && Number(item.paint.rectSize.height)) || 14,
                point: {
                  x: Number(itemL.pointX),
                  y: Number(itemL.pointY),
                },
                offset: {
                  x:
                    (Number(item.paint.rectOffsetSize) &&
                      Number(item.paint.rectOffsetSize.width)) ||
                    8,
                  y:
                    (Number(item.paint.rectOffsetSize) &&
                      Number(item.paint.rectOffsetSize.width)) ||
                    8,
                },
                fill: item.paint.rectFill,
                stroke: item.paint.rectStroke,
                strokeWidth: Number(item.paint.rectStrokeWidth),
                draggable: item.paint.isEditable,
                visible: item.paint.isVisible,
                isClick: item.paint.isClick,
                isEditable: item.paint.isEditable,
                isTwinkle: item.paint.isTwinkle,
                isDelete: item.paint.isDelete,
                item: item,
              },
              lineConfig: {
                id: `lineAlarm${item.data.mapElementId}${m}`,
                name: `lineAlarm${item.data.mapElementId}`,
                stroke: item.paint.lineColor,
                strokeWidth: Number(item.paint.lineWidth),
                points: [Number(lineStartX), Number(lineStartY), Number(lineEndX), Number(lineEndY)],
                draggable: item.paint.isDragging,
                visible: item.paint.isVisible,
                isVisible: item.paint.isVisible,
                isClick: item.paint.isClick,
                isEditable: item.paint.isEditable,
                isTwinkle: item.paint.isTwinkle,
                isDelete: item.paint.isDelete,
                item: item,
              },
              originData: item,
            });
          });
        });
      return alarmLineAddArrayTemp;
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.$nextTick(() => {
    //   this.$emit("ready", { CKMap: this });
    // });
    // const s = document.createElement('script');
    // s.type = 'text/javascript';
    // s.src = './node_modules/ck-picture-map/lib/utils/kinetic-v5.1.0.js';
    // document.body.appendChild(s);
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$nextTick(() => {
      this.$emit("ready", { CKMap: this });
    });
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {
    this.CKMapObject && this.CKMapObject.alarmAnimationStop();
  }, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
  deactivated() {
    this.CKMapObject && this.CKMapObject.alarmAnimationStop();
  }
};
</script>
<style lang='scss' scoped>
.page_all {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  // 地图容器
  .map_all {
    // position: relative;
    // width: 100%;
    // height: 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    // overflow: hidden;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // width: 100%;
    // height: 100%;
    // // overflow: hidden;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }
  .mark_delete_icon {
    padding: 5px 10px 5px 5px;
    margin: 0px 0px 5px 10px;
  }
}
</style>
