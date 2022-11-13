<template>
  <div
    id="special-setting"
    class="specialSetting h-full reactive"
   >
    <el-row :gutter="8" class="h-full">
      <el-col
        :span="24"
        :sm="state.showSetting ? 16 : 24"
        :md="state.showSetting ? 16 : 24"
        :lg="state.showSetting ? 18 : 24"
        class="table-animation">
        <div class="md:hidden pb-8 w-full">
          <!-- 設定單筆扣補 -->
          <SetDeductCard @on-refresh="actions.handleGetDeductList" />
        </div>
        <!-- 扣補記錄 -->
        <div
          class="flex flex-col gap-y-3 md:bg-white md:h-full md:p-3 rounded-md">
          <header class="flex items-center justify-between">
            <div class="flex items-center gap-x-3">
              <SubTitle title="扣補記錄" class="min-w-fit" />
              <el-select
                v-model="state.selectedDate"
                value-key="value"
                placeholder="天數"
                size="small"
                class="max-w-[100px] select-date"
                @change="actions.handleGetDeductList">
                <template #prefix>最近</template>
                <el-option
                  v-for="i in 31"
                  :key="i"
                  :label="`${i} 天`"
                  :value="i" />
              </el-select>
            </div>

            <div class="hidden md:block">
              <el-button
                type="primary"
                icon="Edit"
                plain
                size="small"
                @click="state.showSetting = !state.showSetting"
                >單筆扣補</el-button
              >
            </div>
          </header>

          <!-- 扣補記錄 filter -->
          <div class="flex flex-col md:flex-row md:justify-between gap-y-3">
            <div class="flex flex-col md:flex-row gap-3 items-center">
              <el-select
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
          <BasicTable
            :columns="state.columns"
            :table-data="formatPaginationTableData"
            :loading="state.loading"
            :total="state.pagination.total"
            :take="state.pagination.take"
            v-model:page="state.pagination.page"
            class="hidden md:block">
            <template #pos="{ row }">
              <p
                class="mx-3 bg-opacity-20 rounded text-center text-xs leading-5"
                :class="{
                  'bg-slate-300 text-gray-500': row.pos === '原點位',
                  'bg-primary-50  text-primary-500': row.pos !== '原點位',
                }">
                {{ row.pos }}
              </p>
            </template>
            <template #amt_in="{ row }">
              <p :class="{ increase: row.amt_in > 0 }">
                {{
                  Number(row.amt_in).toLocaleString('zh-CN', {
                    minimumFractionDigits: 2,
                  })
                }}
              </p>
            </template>
            <template #amt_out="{ row }">
              <p :class="{ decrease: row.amt_out > 0 }">
                {{
                  Number(row.amt_out).toLocaleString('zh-CN', {
                    minimumFractionDigits: 2,
                  })
                }}
              </p>
            </template>
          </BasicTable>
        </div>
      </el-col>

      <transition name="slide-fade" mode="out-in">
        <el-col :span="24" :sm="8" :md="8" :lg="6" v-show="state.showSetting">
          <!-- 設定單筆扣補 -->
          <SetDeductCard
            @on-refresh="actions.handleGetDeductList"
            class="hidden md:block" />
        </el-col>
      </transition>
    </el-row>
    <ScrollToTop @click.prevent="actions.handleScrollToTop" />
  </div>
</template>

<script setup>
import { GetDeductList } from '@/api/sp_epadj'
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import BasicTable from '@/components/Table/index.vue'
import PosCard from '@/components/Card/PosCard.vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import SetDeductCard from '@/components/Card/SetDeductCard.vue'
import { uniqWith, isEqual } from 'lodash-es'
const { proxy } = getCurrentInstance()
const state = reactive({
  loading: false,
  showSetting: true,
  showSettingMobile: false,
  selectedDate: 14,
  search: '',
  searchOptions: [],
  pagination: {
    show: true,
    total: 0,
    page: 1,
    take: 20,
  },
  columns: [
    {
      label: '會員編號',
      prop: 'member_id',
      align: 'right',
      fixed: 'left',
      width: '70',
    },
    {
      label: '點位',
      prop: 'pos',
      formatter: true,
      align: 'center',
      width: '100',
    },
    { label: '姓名', prop: 'name', sortable: true, width: '70' },
    {
      label: '補款',
      prop: 'amt_in',
      align: 'right',
      formatter: true,
      sortable: true,
      width: '80',
    },
    {
      label: '扣款',
      prop: 'amt_out',
      align: 'right',
      formatter: true,
      sortable: true,
      width: '80',
    },
    { label: '扣補編號', prop: 'ep_id', align: 'right', width: '70' },
    { label: '時間', prop: 'commit', width: '85', sortable: true },
    { label: '備註', prop: 'remark' },
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
  actions.handleGetDeductList()
})

const actions = {
  /**
   * @description GetDeductList 取得最近 n 天的 扣補調整清單
   * @param {string}  action  deduct_list
   * @param {number}  days    天數
   */
  handleGetDeductList: async () => {
    state.loading = true
    const params = {
      action: 'deduct_list',
      days: state.selectedDate,
    }
    const { code, data, count = 0, msg } = await GetDeductList(params)
    if (code === 1) {
      const fake = [
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '333.00',
          amt_out: '0.00',
          commit: '2022-11-12 15:11:37',
          remark: '12332',
          ep_id: 7713,
        },
        {
          member_id: 108902,
          pos: 'B',
          name: 'Test',
          amt_in: '0.00',
          amt_out: '10003.00',
          commit: '2022-11-12 15:08:59',
          remark:
            'qweqweiqopwiep iwopeiqopweiqopwei pipoqweiopqwiepqwie pqwei qpowe iqpowe iqpowie pqwioqpiepqwei oqpwei ',
          ep_id: 7712,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '10003.00',
          commit: '2022-11-12 14:39:36',
          remark:
            'qweqweiqopwiep iwopeiqopweiqopwei pipoqweiopqwiepqwie pqwei qpowe iqpowe iqpowie pqwioqpiepqwei oqpwei ',
          ep_id: 7711,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '10003.00',
          commit: '2022-11-11 05:35:47',
          remark:
            'qweqweiqopwiep iwopeiqopweiqopwei pipoqweiopqwiepqwie pqwei qpowe iqpowe iqpowie pqwioqpiepqwei oqpwei ',
          ep_id: 7710,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '132312.00',
          amt_out: '0.00',
          commit: '2022-11-11 03:22:58',
          remark:
            'qweqweiqopwiep iwopeiqopweiqopwei pipoqweiopqwiepqwie pqwei qpowe iqpowe iqpowie pqwioqpiepqwei oqpwei ',
          ep_id: 7709,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '100.00',
          commit: '2022-11-11 03:09:41',
          remark:
            'qweqweiqopwiep iwopeiqopweiqopwei pipoqweiopqwiepqwie pqwei qpowe iqpowe iqpowie pqwioqpiepqwei oqpwei ',
          ep_id: 7708,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '100.00',
          commit: '2022-11-11 02:11:03',
          remark: 'some text !!!!',
          ep_id: 7707,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '100.00',
          commit: '2022-11-11 02:07:41',
          remark: 'some text !!!!',
          ep_id: 7706,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '100.00',
          commit: '2022-11-11 01:45:13',
          remark: 'some text !!!!',
          ep_id: 7705,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '100.00',
          commit: '2022-11-11 01:40:58',
          remark: 'some text !!!!',
          ep_id: 7704,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '100.00',
          commit: '2022-11-11 01:38:09',
          remark: 'some text !!!!',
          ep_id: 7703,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '123123.00',
          commit: '2022-11-10 15:21:47',
          remark: 'eqweqwe',
          ep_id: 7702,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '3213.00',
          commit: '2022-11-10 15:21:21',
          remark:
            'qwe qweqweqw wqek qwopekwq wqkeoqw keqwqwe kqwop ekqowe kwqo ekqwpoe kqwpekqwo ekpqw keqpwoek oqwpkeqwpo keqwpoekqopek qwopek qowpekqwpkepoqwkeoqwpekqopwekqpowekpoqwekpqowekpoqwkepoqwekpqowkepoqwkeopqwkepoekqpowekpqwekowqekpqekopqekpqwe',
          ep_id: 7701,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '123.00',
          amt_out: '0.00',
          commit: '2022-11-10 09:29:25',
          remark: '32123',
          ep_id: 7700,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '12312.00',
          commit: '2022-11-10 09:29:07',
          remark: '3123',
          ep_id: 7699,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '12313.00',
          commit: '2022-11-10 09:26:19',
          remark: '12313',
          ep_id: 7698,
        },
        {
          member_id: 108907,
          pos: '原點位',
          name: 'Jing Li',
          amt_in: '0.00',
          amt_out: '3123.00',
          commit: '2022-11-10 09:17:07',
          remark: '123',
          ep_id: 7697,
        },
        {
          member_id: 108906,
          pos: 'A',
          name: 'Test',
          amt_in: '0.00',
          amt_out: '100.00',
          commit: '2022-11-08 03:54:45',
          remark: 'some text !!!!',
          ep_id: 7696,
        },
      ]
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
    state.selectedDate = 14
    actions.handleGetDeductList()
  },

  handleScrollToTop: () => {
    const anchor = document.querySelector('#special-setting')
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  },
}
</script>

<style lang="scss" scoped>
.select-date :deep(.el-input__inner) {
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