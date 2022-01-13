<template>
  <div class="com-comtainer">
    <div class="title" :class="{ active: theme === 'chalk' }">
      <div @click="isShow = !isShow" :style="comStyle">
        <span class="title-text">▎{{ showTitle }}</span>
        <span class="selece-icon rotate" v-if="isShow">&gt;</span>
        <span class="selece-icon" v-else>&gt;</span>
      </div>
      <div class="select-con" v-show="isShow" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          :style="comStyle"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div ref="trend_ref" class="com-chart"></div>
  </div>
</template>

<script>
// import require from '@/network/require'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      isShow: false,
      shoiceType: 'map',
      titleFontSize: 0
    }
  },
  computed: {
    ...mapState(['theme']),
    selectTypes() {
      if (!this.allData) return []
      return this.allData.type.filter((item) => item.text !== this.showTitle)
    },
    showTitle() {
      if (!this.allData) return ''
      return this.allData[this.shoiceType].title
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  // created
  created() {
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    // 发送数据给服务器
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.registerCallBack('trendData')
  },
  methods: {
    handleSelect(key) {
      this.shoiceType = key
      this.updateChart()
      this.isShow = false
    },
    // 初始化
    initChart() {
      // 初始化echarts实例对象
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      // 设置基本配置对象
      const initOption = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    // async getData() {
    //   const { data: ret } = await require({
    //     url: 'trend'
    //   })
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    // 设置数据配置对象
    updateChart() {
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)'
      ]
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      // 类目轴
      const timeArr = this.allData.common.month
      // Y轴
      const valueArr = this.allData[this.shoiceType].data

      //
      const seriesArr = valueArr.map((item, index) => {
        return {
          type: 'line',
          name: item.name,
          data: item.data,
          stack: this.shoiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorArr1[index] }, // 0%的颜色值
              { offset: 1, color: colorArr2[index] } // 100%
            ])
          }
        }
      })
      // 图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name
      })
      // 设置数据配置项
      const dataOption = {
        // 图例的效果
        legend: {
          data: legendArr
        },
        xAxis: {
          data: timeArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 监听浏览器窗口大小的变化并更新大小
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style>
.title {
  position: absolute;
  left: 30px;
  top: 30px;
  z-index: 5;
}
.active {
  color: white;
}
.selece-icon {
  font-family: '宋体';
  margin-left: 10px;
  font-weight: 700;
  display: inline-block;
  transform: rotate(90deg);
  cursor: pointer;
}
.active .selece-icon {
  background-color: #222733;
}
.rotate {
  transform: rotate(-90deg);
}
</style>