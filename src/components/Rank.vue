<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>
<script>
import require from '@/network/require'
import chalk from '@/../public/static/theme/chalk'

export default {
  data() {
    return {
      chartInstance: null,
      allData: {
        names: [],
        values: []
      },
      startValue: 0,
      endValue: 9
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', this.updataChart)
    },
    async getData() {
      const { data: ret } = await require({
        url: 'rank'
      })
      // 对组数进行排序
      ret.sort((a, b) => b.value - a.value)
      // 处理数据对保存在allData中
      ret.map((item) => {
        this.allData.names.push(item.name)
        this.allData.values.push(item.value)
      })
      // 设置数据给echarts
      this.setdateChart()
      // 设置区域缩放
      this.setZoomOption()
      // 开启定时器循环展示数据
      this.updataChart()
    },
    // 定义设置数据的方法
    setdateChart() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const dataOption = {
        xAxis: {
          data: this.allData.names
        },
        series: [
          {
            data: this.allData.values,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: targetColorArr[0] },
                  { offset: 1, color: targetColorArr[1] }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 设置区域缩放的配置
    setZoomOption() {
      let zoomOption = {
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        }
      }
      this.chartInstance.setOption(zoomOption)
    },
    // 开启定时器刷新数据
    updataChart() {
      const lenth = this.allData.values.length
      this.timerId && clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue >= lenth) {
          this.startValue = 0
          this.endValue = 9
        }
        this.setZoomOption()
      }, 2000)
    },
    // 监听网页大小的变化
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6
      const adaapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adaapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>