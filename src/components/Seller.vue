<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="seller_ref"></div>
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
      currentPage: 1,
      totalPage: 0,
      timerId: null
    }
  },
  mounted() {
    this.getData()
    this.initChart()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    window.removeEventListener('resize',this.screenAdapter)
  },
  methods: {
    // 初始化echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      // 对图表进行初始化配置
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        // 边框圆角
        grid: {
          top: '10%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443',
              type: 'solid'
            }
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right'
              // textStyle: {
              // color: 'white'
              // }
            },
            itemStyle: {
              // 渐变色
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#5052EE' },
                { offset: 1, color: '#AB6EE5' }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)

      // 监听图表鼠标移入移出事件
      this.chartInstance.on('mouseover', () => {
        this.timerId && clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.updataChart()
      })
    },
    // 获取图表数据
    async getData() {
      const { data: ret } = await require({
        url: 'api/seller'
      })
      this.totalPage = Math.ceil(ret.length / 5)
      // ret.sort((a, b) => {
      //   return b.value - a.value
      // })
      ret.forEach((item) => {
        this.allData.names.push(item.name)
        this.allData.values.push(item.value)
      })
      this.setdataChart()
      this.updataChart()
    },

    // 设置图表数据
    setdataChart() {
      let newNames = this.allData.names.slice(
        (this.currentPage - 1) * 5,
        this.currentPage * 5
      )
      let newValues = this.allData.values.slice(
        (this.currentPage - 1) * 5,
        this.currentPage * 5
      )
      const dataOption = {
        yAxis: {
          data: newNames
        },
        series: [
          {
            data: newValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },

    // 更新数据
    updataChart() {
      this.timerId && clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) this.currentPage = 1
        this.setdataChart()
      }, 3000)
    },
    // 监听浏览器大小的变化
    // 并改变尺寸
    screenAdapter() {
      let width = this.$refs.seller_ref.offsetWidth
      const titleFontSize = (width / 100) * 3.6
      const adaapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        // 提示框
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              // 柱状图边框圆角
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
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

<style>
</style>