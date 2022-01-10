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
        name: [],
        value: []
      }
    }
  },
  mounted() {
    this.getData()
    this.initChart()
  },
  methods: {
    // 初始化echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
    },
    async getData() {
      const { data: ret } = await require({
        url: 'api/seller'
      })
      ret.forEach((item) => {
        this.allData.name.push(item.name)
        this.allData.value.push(item.value)
      })
      this.updataChart()
    },
    updataChart() {
      const option = {
        tooltip: {
          
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.allData.name
        },
        series: [
          {
            type: 'bar',
            data: this.allData.value
          }
        ]
      }
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style>
</style>