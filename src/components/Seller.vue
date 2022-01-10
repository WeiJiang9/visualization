<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import require from '@/network/require'
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
  },
  destroyed() {
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
      // 监听图表鼠标移入移出事件
      this.chartInstance.on('mouseover', () => {
        this.timerId && clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.updataChart()
      })
    },
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
    setdataChart() {
      let newNames = this.allData.names.slice(
        (this.currentPage - 1) * 5,
        this.currentPage * 5
      )
      let newValues = this.allData.values.slice(
        (this.currentPage - 1) * 5,
        this.currentPage * 5
      )
      const option = {
        tooltip: {},
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: newNames
        },
        series: [
          {
            type: 'bar',
            data: newValues
          }
        ]
      }
      this.chartInstance.setOption(option)
    },
    updataChart() {
      this.timerId && clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) this.currentPage = 1
        this.setdataChart()
      }, 3000)
    }
  }
}
</script>

<style>
</style>