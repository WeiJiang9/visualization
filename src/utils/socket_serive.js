export default class SocketService {
  constructor() {
    this.intance = null
    this.ws = null
    this.callBackMapping = {}
    this.connected = false
    this.sendRetyCount = 0
    this.connectRetyCount = 0
  }
  // 定义静态方法创建SocketService实例对象并返回该实例
  static getIntance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 定义连接服务端的方法
  connect() {
    // 判断浏览器支不支持WebSocket
    if (!window.WebSocket) {
      return console.log('不支持WebSocket')
    }
    // 连接服务器
    this.ws = new WebSocket('ws://localhost:9998')
    // 连接服务器成功
    this.ws.onopen = () => {
      console.log('连接服务端成功...')
      this.connected = true
      this.connectRetyCount = 0
    }
    // 连接服务器失败
    this.ws.onclose = () => {
      console.log('连接服务端失败')
      this.connected = false
      this.connectRetyCount++
      // 重新连接服务器
      setTimeout(() => {
        this.connect()
      }, this.connectRetyCount * 500);
    }
    // 接收到服务器返回的数据
    this.ws.onmessage = (msg) => {
      console.log('获取到数据')
      // 取出对应的数据
      const recvData = JSON.parse(msg.data)
      // 判断是否有对应的方法
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        // 判断客户端是否是获取数据事件
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
          // 判断客户端是否是fullScreen事件
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
          // 判断客户端是否是themeChange事件
        } else if (action === 'themeChange') {

        }
      }
    }
  }
  // 将对应的回调函数保存在callBackMapping中
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }
  // 取消callBackMapping中的某一个回调函数
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }
  // 发送数据给服务器
  send(data) {
    // 判断是否连接服务器成功
    if (this.connected) {
      this.sendRetyCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetyCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetyCount * 1000)
    }
  }
}