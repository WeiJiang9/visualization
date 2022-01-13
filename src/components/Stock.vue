<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import require from '@/network/require'
import { mapState } from 'vuex'

export default {
  data: () => {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      timerId: null
    }
  },
  created() {
    this.$socket.registerCallBack('stockData', this.getData)
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  mounted() {
    this.initChart()
    // this.getData()
    // 发送数据给服务器
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化echarts实例对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          top: 20,
          left: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', this.startIntervaal)
    },
    // 获取图表数据
    // async getData() {
    //   const { data: ret } = await require({
    //     url: 'stock'
    //   })
    getData(ret) {
      this.allData = ret
      this.updateChart()
      this.startIntervaal()
    },
    // 处理数据并设置给echarts
    updateChart() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            normal: {
              show: false,
              // position: 'inner',
              color: colorArr[index][0]
            }
          },
          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: colorArr[index][0] },
                  { offset: 1, color: colorArr[index][1] }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 启动定时器
    startIntervaal() {
      this.timerId && clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 5000)
    },
    // 监听网页大小的变化
    screenAdapter() {
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6
      const innerRadius = titleFontSize * 3
      const outterRadius = innerRadius * 1.125
      let adaterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }
      this.chartInstance.setOption(adaterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style>
</style>