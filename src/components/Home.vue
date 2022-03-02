<template>
    <el-button type="info" @click="login">退出</el-button>
</template>

<script>
export default {
    name: 'Home',

    data() {
        return {}
    },

    methods: {
        login() {
            sessionStorage.clear('token')
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>
</style>
