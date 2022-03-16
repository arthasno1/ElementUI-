<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="login">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            v-for="subitem in item.children"
                            :key="subitem.id"
                            :index="'/' + subitem.path + ''"
                            @click="saveNameState('/' + subitem.path)"
                        >
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{ subitem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 控制左侧菜单栏折叠与展开
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    login () {
      sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮控制左侧菜单折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 点击链接激活变色
    saveNameState (activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = sessionStorage.getItem('activePath')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #363d40;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #e9edf1;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        > span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #e9edf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #495163;
    line-height: 24px;
    text-align: center;
    color: white;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
