<template>
  <div id="pre-order" class="specialSetting h-full reactive">
    <el-row :gutter="8" class="h-full">
      <el-col
        :span="24"
        :sm="state.showSetting ? 16 : 24"
        :md="state.showSetting ? 16 : 24"
        :lg="state.showSetting ? 18 : 24"
        class="table-animation">
        <div class="md:hidden pb-8 w-full">
          <!-- 新增預收訂單 -->
          <SetPreOrderCard @on-refresh="actions.handlePreOrderList" />
        </div>
        <!-- 預收訂單 -->
        <div
          class="flex flex-col gap-y-3 md:bg-white md:h-full md:p-3 rounded-md">
          <header class="flex items-center justify-between">
            <div class="flex items-center gap-x-3">
              <SubTitle title="預收訂單" class="min-w-fit" />
              <el-select
                v-model="state.selectedStatus"
                value-key="value"
                placeholder="狀態"
                size="small"
                class="max-w-[120px] select-option"
                @change="actions.handlePreOrderList">
                <template #prefix>狀態</template>
                <el-option
                  v-for="status in state.statusOptions"
                  :key="status.label"
                  :label="status.label"
                  :value="status.value" />
              </el-select>
            </div>

            <div class="hidden md:block">
              <el-button
                type="primary"
                icon="Edit"
                plain
                size="small"
                @click="state.showSetting = !state.showSetting"
                >新增預收訂單</el-button
              >
            </div>
          </header>

          <!-- 預收訂單 filter -->
          <div class="flex flex-col md:flex-row md:justify-between gap-y-3">
            <div class="flex flex-col md:flex-row gap-3 items-center">
              <el-select
                v-if="false"
                v-model="state.search"
                value-key="value"
                placeholder="會員編號"
                clearable
                filterable
                class="w-full md:w-fit">
                <el-option
                  v-for="item in state.searchOptions"
                  :key="item.member_id"
                  :label="item.member_id"
                  :value="item.member_id">
                  <div class="flex justify-between">
                    <span>{{ item.member_id }}</span>
                    <span>{{ item.name }}</span>
                  </div>
                </el-option>
              </el-select>
              <div class="flex flex-col w-full md:w-fit gap-3 md:flex-row">
                <el-button
                  type="primary"
                  class="w-full md:w-fit"
                  auto-insert-space
                  >搜尋</el-button
                >
                <div>
                  <el-button
                    bg
                    auto-insert-space
                    class="w-full md:w-fit"
                    @click="actions.handleRest"
                    >重置</el-button
                  >
                </div>
              </div>
            </div>

            <small class="text-gray-500 self-end px-1"
              >共 {{ state.pagination.total }} 筆</small
            >
          </div>

          <!-- isMobile table -->
          <PosCard :list="formatTableData" class="md:hidden" />

          <!-- table  -->
          <el-table :data="formatPaginationTableData" size="small">
            <el-table-column
              type="index"
              align="center"
              width="35"
              fixed="left" />
            <el-table-column prop="mbid" label="編號" width="60" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phone" label="電話" width="100" />
            <el-table-column label="階級紀錄">
              <el-table-column prop="title" label="階級" />
              <el-table-column prop="class" label="等級" width="60" />
              <el-table-column
                prop="star"
                label="星級"
                width="45"
                align="right" />
            </el-table-column>
            <el-table-column label="PV 紀錄">
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <transition name="slide-fade" mode="out-in">
        <el-col :span="24" :sm="8" :md="8" :lg="6" v-show="state.showSetting">
          <div class="space-y-3">
            <!-- 查詢預收訂單 -->
            <GetPreOrderCard />

            <!-- 新增預收訂單 -->
            <SetPreOrderCard
              @on-refresh="actions.handlePreOrderList"
              class="hidden md:block" />
          </div>
        </el-col>
      </transition>
    </el-row>
    <ScrollToTop @click.prevent="actions.handleScrollToTop" />
  </div>
</template>

<script setup>
import { PreOrderApiHandler } from '@/api/pre_order'
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import BasicTable from '@/components/Table/index.vue'
import PosCard from '@/components/Card/PosCard.vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import GetPreOrderCard from '@/components/Card/GetPreOrderCard.vue'
import SetPreOrderCard from '@/components/Card/SetPreOrderCard.vue'
import { uniqWith, isEqual } from 'lodash-es'
const { proxy } = getCurrentInstance()
const state = reactive({
  loading: false,
  showSetting: true,
  showSettingMobile: false,
  selectedStatus: '',
  search: '',
  searchOptions: [],
  pagination: {
    show: true,
    total: 0,
    page: 1,
    take: 20,
  },
  statusOptions: [
    {
      label: '處理中',
      value: '',
    },
    {
      label: '已取消',
      value: 'cancelled',
    },
    {
      label: '已完成',
      value: 'completed',
    },
  ],
  tableData: [],
})

const formatPaginationTableData = computed(() => {
  const { page, take } = state.pagination
  if (state.search) {
    const searchData = state.tableData.filter(
      el => el.member_id === state.search
    )
    const formatData = searchData.filter(
      (item, index) => index < page * take && index >= take * (page - 1)
    )
    state.pagination.total = searchData.length
    return formatData
  }

  state.pagination.total = state.tableData.length
  return state.tableData.filter(
    (item, index) => index < page * take && index >= take * (page - 1)
  )
})

const formatTableData = computed(() => {
  if (state.search) {
    const searchData = state.tableData.filter(
      el => el.member_id === state.search
    )
    return searchData
  }
  return state.tableData
})

onMounted(() => {
  actions.handlePreOrderList()
})

const actions = {
  /**
   * @description GetPreOrder 取得預收訂單
   * @param {string}  action  listbydate
   * @param {date}  begin    開始日期
   * @param {date}  end    結束日期
   * @param {string}  cond    狀態
   */
  handlePreOrderList: async () => {
    state.loading = true
    const params = {
      action: 'listbydate',
      begin: '2022-10-16',
      end: '2022-11-16',
      // "cond":"cancelled"
    }
    const { code, data, count = 0, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      state.tableData = data
      state.pagination.total = Number(count)
      const options = data.map(item => {
        return { member_id: item.member_id, name: item.name }
      })
      state.searchOptions = uniqWith(options, isEqual)
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
    state.loading = false
  },

  handleRest: () => {
    state.search = ''
    state.selectedStatus = ''
    actions.handlePreOrderList()
  },

  handleScrollToTop: () => {
    const anchor = document.querySelector('#pre-order')
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  },
}
</script>

<style lang="scss" scoped>
.select-option :deep(.el-input__inner) {
  color: $mainColor;
}
.table-animation {
  transition: all 0.5s ease-in;
  transition-delay: 0.5s;
}
// slide-fade
.slide-fade-enter-active {
  animation: slide-in 0.5s ease-in forwards;
  -webkit-animation: slide-in 0.5s ease-in forwards;
}

.slide-fade-leave-active {
  animation: slide-out 1s ease-out forwards;
  opacity: 0;
  transition: opacity 1s;
  -webkit-animation: slide-out 1s ease-out forwards;
}

@keyframes slide-in {
  from {
    transition: opacity 1.5s;
    transform: translateX(30px);
    -webkit-transform: translateX(30px);
    -moz-transform: translateX(30px);
    -ms-transform: translateX(30px);
    -o-transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
  }
  to {
    transform: translateX(30px);
    -webkit-transform: translateX(30px);
    -moz-transform: translateX(30px);
    -ms-transform: translateX(30px);
    -o-transform: translateX(30px);
  }
}
</style>