<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
// import require from '@/network/require'
import { getProvinceMapInfo } from '../utils/map_utils'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {
      chartInstance: null,
      allData: null,
      // 保存省份地图的缓存
      mapData: {}
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  // watch
  watch: {
    theme() {
      // 销毁图表
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  created() {
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    // 发送数据给服务器
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取地图数据
      const ret = await axios({
        url: 'http://localhost:8999/static/map/china.json',
        timeout: 500
      })
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2172BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        // 点击获取到对应的省份
        let provinceInfo = getProvinceMapInfo(arg.name)
        if (provinceInfo.key) {
          if (!this.mapData[provinceInfo.key]) {
            const ret = await axios.get(
              'http://localhost:8999' + provinceInfo.path
            )
            this.mapData[provinceInfo.key] = ret.data
          }
          this.$echarts.registerMap(
            provinceInfo.key,
            this.mapData[provinceInfo.key]
          )
          const changeOption = {
            geo: {
              map: provinceInfo.key
            }
          }
          this.chartInstance.setOption(changeOption)
        } else {
          this.$echarts.registerMap('china', ret.data)
          this.chartInstance.setOption(initOption)
        }
      })
    },
    // 获取散点图数据
    // async getData() {
    //   const { data: ret } = await require({
    //     url: 'map'
    //   })
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      // 处理散点图数据
      const legendArr = this.allData.map((item) => item.name)
      const seriesArr = this.allData.map((item) => {
        return {
          // 设置类型为涟漪散点图
          type: 'effectScatter',
          // 设置散点图的name
          name: item.name,
          // 设置散点图的数据
          data: item.children,
          // 设置与地图关联起来
          coordinateSystem: 'geo',
          // 涟漪动画
          rippleEffect: {
            scale: 5, // 涟漪动画大小
            brushType: 'stroke' // 涟漪动画空心效果
          }
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          tetxStyle: {
            fontSize: titleFontSize / 2
          },
          itemGap: titleFontSize / 2
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style>
</style>