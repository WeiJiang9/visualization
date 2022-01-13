<template>
  <div class="screen-container" :class="{ active: theme === 'chalk' }">
    <!-- 头部区域 -->
    <div class="screen-header">
      <div class="header-left">
        <img src="../../public/static/img/logo.jpeg" alt="" />
        <div class="pxx">
          <span>拼夕夕</span>
          <span>PINGXIXI.COM</span>
        </div>
      </div>
      <div>电商平台实时监控系统</div>
      <div class="header-right">
        <img :src="rightImg" alt="" @click="handleChangeTheme" />
        <span>{{ getDate }}</span>
      </div>
    </div>
    <!-- 主题内容区域 -->
    <div class="screen-body">
      <div class="body-left">
        <div
          class="left-top pos"
          :class="{ fullscreen: fullScreenStatus.trend }"
        >
          <trend ref="trend" />
          <div class="resize" @click="changeSize('trend')">
            <span class="iconfont" :class="getIcon('trend')"></span>
          </div>
        </div>

        <div
          class="left-bottom pos"
          :class="{ fullscreen: fullScreenStatus.seller }"
        >
          <seller ref="seller" />

          <div class="resize" @click="changeSize('seller')">
            <span class="iconfont" :class="getIcon('seller')"></span>
          </div>
        </div>
      </div>

      <div class="body-middle">
        <div
          class="middle-top pos"
          :class="{ fullscreen: fullScreenStatus.map }"
        >
          <Map ref="map" />
          <div class="resize" @click="changeSize('map')">
            <span class="iconfont" :class="getIcon('map')"></span>
          </div>
        </div>

        <div
          class="middle-bottom pos"
          :class="{ fullscreen: fullScreenStatus.rank }"
        >
          <rank ref="rank" />
          <div class="resize" @click="changeSize('rank')">
            <span class="iconfont" :class="getIcon('rank')"></span>
          </div>
        </div>
      </div>

      <div class="body-right">
        <div
          class="right-top pos"
          :class="{ fullscreen: fullScreenStatus.hot }"
        >
          <hot ref="hot" />
          <div class="resize" @click="changeSize('hot')">
            <span class="iconfont" :class="getIcon('hot')"></span>
          </div>
        </div>

        <div
          class="right-bottom pos"
          :class="{ fullscreen: fullScreenStatus.stock }"
        >
          <stock ref="stock" />
          <div class="resize" @click="changeSize('stock')">
            <span class="iconfont" :class="getIcon('stock')"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  computed: {
    ...mapState(['theme']),
    getDate() {
      let date = new Date()
      return this.fmtDate(date, 'yyyy-MM-dd')
    },
    getIcon() {
      return (name) => {
        return this.fullScreenStatus[name]
          ? 'icon-compress-alt'
          : 'icon-expand-alt'
      }
    },
    rightImg() {
      if (this.theme == 'chalk') {
        return '/static/img/qiehuan_dark.png'
      } else {
        return '/static/img/qiehuan_light.png'
      }
    }
  },
  created() {
    this.$socket.registerCallBack('fullScreen', this.recvData)
  },
  destroyed() {
    this.$socket.unRegisterCallBack('fullScreen')
  },
  methods: {
    // 监听全屏的点击
    changeSize(name) {
      const targetValue = !this.fullScreenStatus[name]
      // // nextTick
      // this.$nextTick(this.$refs[name].screenAdapter)

      // 将数据发送给服务端
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: name,
        value: targetValue
      })
    },
    // 接收后端返回的数据
    recvData(data) {
      const chartName = data.chartName
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(this.$refs[chartName].screenAdapter)
    },
    // 监听切换主题的点击
    handleChangeTheme() {
      // 修改vuex的theme
      this.$store.commit('changeTheme')
    },
    fmtDate(date, fmt) {
      let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      }
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
      return fmt
    }
  }
}
</script>

<style lang="less" scoped>
.screen-container {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
.screen-header {
  padding: 0 2%;
  height: 64px;
  font-size: 15px;
  background: url('../../public/static/img/header_border_dark.png') no-repeat;
  background-size: 98% 64px;
  background-position: center;
  // color: white;
  display: flex;
  justify-content: space-between;
}
.header-left,
.header-right {
  width: 140px;
  color: #aaa;
}
.header-left {
  height: 44px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  justify-content: center;
  img {
    margin-right: 10px;
    border-radius: 20px;
  }
  .pxx {
    display: flex;
    flex-direction: column;
    span:last-child {
      font-size: 12px;
      font-weight: normal;
    }
  }
}
.screen-header > div:nth-child(2) {
  font-size: 20px;
  align-self: center;
}
.header-left img {
  height: 40px;
  margin-top: 3px;
}
.header-right {
  margin-top: 13px;
}
.header-right img {
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
}

.screen-body {
  padding: 0 1%;
  height: 95%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.body-left {
  height: 100%;
  width: 27.6%;
  .left-top {
    height: 53%;
  }
  .left-bottom {
    height: 31%;
    margin-top: 25px;
  }
}
.body-middle {
  height: 100%;
  width: 41.5%;
  margin: 0 20px;
  .middle-top {
    height: 56%;
  }
  .middle-bottom {
    height: 28%;
    margin-top: 25px;
  }
}

.body-right {
  height: 100%;
  width: 27.6%;
  .right-top {
    height: 46%;
  }
  .right-bottom {
    height: 38%;
    margin-top: 25px;
  }
}
.pos {
  position: relative;
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  z-index: 10;
}
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
.active {
  color: #fff !important;
  background-color: #161522;
}
</style>