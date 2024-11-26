<template>
  <footer class="footer">
    <div class="container" >
        <span>简洁、实用、美观</span>
        <span style="float: right">
          <router-link :to="{path:'/admin/login'}">
            管理员登录
          </router-link>
          |
          <a href="/?lang=zh_CN">中文</a> |
          <a href="/?lang=en_US">English</a>
        </span>
    </div>
    <back-top></back-top>
  </footer>
</template>

<script>
import BackTop from "@/components/Backtop/BackTop";

export default {
  name: "Footer",
  components: {
    BackTop
  }
};
</script>

<style scoped>

.footer {
  margin-top: 120px;
  height: 120px;
  background: gainsboro;
}

</style>
