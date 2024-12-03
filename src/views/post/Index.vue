<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 最新主题 -->
          <el-tab-pane label="最新主题" name="latest">
            <article
              v-for="(item, index) in articleList"
              :key="index"
              class="media"
            >
              <div class="media-left">
                <figure class="image is-48x48">
                  <img :src="getRandomImage()" style="border-radius: 5px" />
                </figure>
              </div>
              <div class="media-content">
                <div>
                  <p class="ellipsis is-ellipsis-1">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.title"
                      placement="top"
                    >
                      <router-link
                        :to="{ name: 'post-detail', params: { id: item.id } }"
                      >
                        <span class="is-size-6">{{ item.title }}</span>
                      </router-link>
                    </el-tooltip>
                  </p>
                </div>
                <nav class="level has-text-grey is-mobile is-size-7 mt-2">
                  <div class="level-left">
                    <router-link
                      class="level-item"
                      :to="{ path: `/member/${item.username}/home` }"
                    >
                      {{ item.alias }}
                    </router-link>
                    <span class="mr-1">
                      发布于: {{ dayjs(item.createTime).format("YYYY/MM/DD") }}
                    </span>
                    <span
                      v-for="(tag, index) in item.tags"
                      :key="index"
                      class="tag is-hidden-mobile is-success is-light mr-1"
                    >
                      <router-link
                        :to="{ name: 'tag', params: { name: tag.name } }"
                      >
                        {{ "#" + tag.name }}
                      </router-link>
                    </span>
                    <span class="is-hidden-mobile">浏览: {{ item.view }}</span>
                  </div>
                </nav>
              </div>
            </article>
          </el-tab-pane>

          <!-- 热门主题 -->
          <el-tab-pane label="热门主题" name="hot">
            <article
              v-for="(item, index) in articleList"
              :key="index"
              class="media"
            >
              <div class="media-left">
                <figure class="image is-48x48">
                  <img :src="getRandomImage()" style="border-radius: 5px" />
                </figure>
              </div>
              <div class="media-content">
                <div>
                  <p class="ellipsis is-ellipsis-1">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.title"
                      placement="top"
                    >
                      <router-link
                        :to="{ name: 'post-detail', params: { id: item.id } }"
                      >
                        <span class="is-size-6">{{ item.title }}</span>
                      </router-link>
                    </el-tooltip>
                  </p>
                </div>
                <nav class="level has-text-grey is-mobile is-size-7 mt-2">
                  <div class="level-left">
                    <router-link
                      class="level-item"
                      :to="{ path: `/member/${item.username}/home` }"
                    >
                      {{ item.alias }}
                    </router-link>
                    <span class="mr-1">
                      发布于: {{ dayjs(item.createTime).format("YYYY/MM/DD") }}
                    </span>
                    <span
                      v-for="(tag, index) in item.tags"
                      :key="index"
                      class="tag is-hidden-mobile is-success is-light mr-1"
                    >
                      <router-link
                        :to="{ name: 'tag', params: { name: tag.name } }"
                      >
                        {{ "#" + tag.name }}
                      </router-link>
                    </span>
                    <span class="is-hidden-mobile">浏览: {{ item.view }}</span>
                  </div>
                </nav>
              </div>
            </article>
          </el-tab-pane>

          <!-- 关注列表 -->
          <el-tab-pane label="关注列表" name="follow">
            <div v-if="followList.length > 0">
              <article
                v-for="(user, index) in followList"
                :key="index"
                class="media"
              >
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img :src="getRandomImage()" style="border-radius: 5px" />
                  </figure>
                </div>
                <div class="media-content">
                  <router-link :to="{ path: `/member/${user.username}/home` }">
                    {{ user.alias }}
                    <span class="is-size-7 has-text-grey">
                      {{ "@" + user.username }}
                    </span>
                  </router-link>
                </div>
                <div class="media-right">
                  <button
                    class="button is-danger"
                    @click="handleUnFollow(user.userId, index)"
                  >
                    取消关注
                  </button>
                </div>
              </article>
            </div>
            <div v-else>
              <p class="has-text-centered">暂无关注</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 分页 -->
      <pagination
        v-show="page.total > 0"
        :total="page.total"
        :page.sync="page.current"
        :limit.sync="page.size"
        @pagination="init"
      />
    </el-card>
  </div>
</template>

<script>
import { getList } from "@/api/post";
import { getFollowList, unFollow } from "@/api/follow";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";

export default {
  name: "TopicList",
  components: { Pagination },
  data() {
    return {
      activeName: "latest",
      articleList: [],
      followList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        tab: "latest",
      },
    };
  },
  computed: {
    ...mapGetters(["token"]),
    isLoggedIn() {
      // 动态计算是否登录
      return this.token != null && this.token !== "";
    },
  },
  created() {
    this.init(this.page.tab);
  },
  methods: {
    init(tab) {
      if (tab === "follow" && this.isLoggedIn) {
        this.fetchFollowList();
      } else {
        getList(this.page.current, this.page.size, tab).then((response) => {
          const { data } = response;
          this.page.current = data.current;
          this.page.total = data.total;
          this.page.size = data.size;
          this.articleList = data.records;
        });
      }
    },
    handleClick(tab) {
      this.page.current = 1;
      this.init(tab.name);
    },
    getRandomImage() {
      const requireContext = require.context(
        "@/assets/image/img",
        false,
        /\.(png|jpe?g|gif)$/
      );
      const imageFiles = requireContext.keys();
      const randomIndex = Math.floor(Math.random() * imageFiles.length);
      const randomImage = requireContext(imageFiles[randomIndex]);
      return randomImage;
    },
    fetchFollowList() {
      if (this.token) {
        this.followList = [
          {
            userId: "1349290158897311745",
            username: "admin",
            alias: "管理员",
          },
        ];
        this.page.total = this.followList.length;
      }
    },
    handleUnFollow(id, index) {
      unFollow(id).then(() => {
        this.$message.success("取消关注成功");
        this.followList.splice(index, 1);
        this.page.total -= 1;
      });
    },
  },
};
</script>

<style scoped></style>