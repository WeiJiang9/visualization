<template>
  <div class="com-comtainer">
    <div class="com-chart" ref="hot_ref"></div>
    <p class="leftBtn" @click="leftClick">&lt;</p>
    <p class="rightBtn" @click="rightClick">&gt;</p>
    <div class="cat-name" :class="{ active: theme === 'chalk' }">
      {{ catName }}
    </div>
  </div>
</template>

<script>
// import require from '@/network/require'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 20
    }
  },
  computed: {
    ...mapState(['theme']),
    // 获取图表标题
    catName() {
      if (!this.allData) return ''
      return this.allData[this.currentIndex].name
    }
  },
  created() {
    this.$socket.registerCallBack('hotData', this.getData)
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
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },

  methods: {
    // 听见向左按钮的点击
    leftClick() {
      let length = this.allData.length
      this.currentIndex--
      if (this.currentIndex < 0) this.currentIndex = length - 1
      this.updateChart()
    },
    // 听见向右按钮的点击
    rightClick() {
      let length = this.allData.length
      this.currentIndex++
      if (this.currentIndex >= length) this.currentIndex = 0
      this.updateChart()
    },
    // 初始化echarts实例对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          left: 20,
          top: 20
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            }
          }
        ],
        // 图表图例的配置
        legend: {
          top: '10%',
          icon: 'circle'
        },
        // 提示框
        tooltip: {
          show: true,
          formatter: (arg) => {
            let newStr = arg.data.resStr.join('<br>')
            return newStr
          }
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取图表数据
    // async getData() {
    //   const { data: ret } = await require({
    //     url: 'hotproduct'
    //   })
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    // 处理数据并设置给echarts
    updateChart() {
      const thirdCategory = this.allData[this.currentIndex].children
      thirdCategory.forEach((item) => {
        let children = item.children
        let totalValues = 0
        children.forEach((cld1) => {
          totalValues += cld1.value
        })
        let resStr = children.map((cld2) => {
          return (
            cld2.name +
            ':' +
            ((cld2.value / totalValues) * 100).toFixed(2) +
            '%'
          )
        })
        item.resStr = resStr
      })
      const dataOption = {
        title: {
          text: `▎${this.allData[this.currentIndex].name}销售统计`
        },
        legend: {
          data: thirdCategory
        },
        series: [
          {
            data: thirdCategory
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 监听网页大小的变化
    screenAdapter() {
      const titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      this.titleFontSize = titleFontSize
      let adaterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize,
          itemHeight: titleFontSize,
          itemGap: titleFontSize / 1.5,
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            radius: titleFontSize * 6.5,
            center: ['50%', '60%']
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
.com-comtainer {
  position: relative;
}
.leftBtn,
.rightBtn {
  position: absolute;
  top: 50%;
  color: #aaa;
  font-family: cursive;
  font-weight: 700;
  font-size: 30px;
  cursor: pointer;
}
.leftBtn {
  left: 5%;
}
.rightBtn {
  right: 5% !important;
}
.cat-name {
  position: absolute;
  right: 10%;
  bottom: 10%;
  font-size: 12px;
}
.active {
  color: white;
}
</style>