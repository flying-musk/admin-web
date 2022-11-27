<template>
  <div id="special-setting" class="specialSetting h-full reactive">
    <el-row :gutter="8" class="h-full">
      <el-col
        :span="24"
        :sm="
          !isEmpty(state.dateOptions) &&
          state.selectedDate === state.dateOptions[0]
            ? 16
            : 24
        "
        :md="
          !isEmpty(state.dateOptions) &&
          state.selectedDate === state.dateOptions[0]
            ? 16
            : 24
        "
        :lg="
          !isEmpty(state.dateOptions) &&
          state.selectedDate === state.dateOptions[0]
            ? 18
            : 24
        "
        class="table-animation">
        <!-- 晉升計算清單 -->
        <div
          class="flex flex-col gap-y-3 md:bg-white md:h-full md:p-3 rounded-md">
          <header class="flex items-center justify-between">
            <div class="flex items-center gap-x-3 month-container">
              <SubTitle title="晉升計算清單" class="min-w-fit" />
              <el-radio-group
                class="month-group"
                v-model="state.selectedDate"
                @change="actions.handleChangeDate">
                <el-radio-button
                  v-for="(date, i) in state.dateOptions"
                  :key="i"
                  :label="date">
                  {{ formatMonth(date) }}
                  <span
                    class="font-normal"
                    :class="
                      state.selectedDate === date
                        ? 'text-gray-100'
                        : 'text-gray-400 hover:text-primary-500'
                    "
                    >{{ date }}（{{ state.list[date]?.length || 0 }}）</span
                  >
                </el-radio-button>
              </el-radio-group>
            </div>

            <div class="hidden md:block">
              <DeleteButton
                v-show="
                  !isEmpty(state.dateOptions) &&
                  state.selectedDate === state.dateOptions[0]
                "
                action="刪除計算"
                :msg="`確定要刪除 ${state.dateOptions[0]} 晉升計算請單嗎？`"
                @on-submit="actions.handleDelete" />
            </div>
          </header>
          {{ formatData?.pvjson }}
          <!-- 晉升計算清單 -->
          <el-table :data="formatData" size="small" v-loading="state.loading">
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
              <el-table-column
                align="right"
                width="90"
                v-for="item in formatData[0].pvjson"
                :key="item.time"
                :prop="item.time"
                :label="item.time" />
            </el-table-column>
          </el-table>
          <!-- table  -->
          <BasicTable
            :columns="state.columns"
            :table-data="formatData"
            :loading="state.loading"
            v-if="false">
            <template #class="{ row }">
              <p
                class="
                  mx-3
                  bg-opacity-20
                  rounded
                  text-center text-xs
                  leading-5
                ">
                {{ row.class }}
              </p>
            </template>
            <template #pvjson="{ row }">
              <el-table-column label="Address Info">
                <el-table-column
                  prop="pv_json1"
                  :label="row.pv_json1"
                  width="120" />
                <el-table-column prop="city" label="City" width="120" />
                <el-table-column prop="address" label="Address" />
                <el-table-column prop="zip" label="Zip" width="120" />
              </el-table-column>
            </template>
            <template #pv_json1="{ row }">
              {{ Number(row.pv_json1).toLocaleString() }}
            </template>
            <template #pv_json2="{ row }">
              {{ Number(row.pv_json2).toLocaleString() }}
            </template>
            <template #pv_json3="{ row }">
              <div :class="{ ' text-red-400': row.alert }">
                {{ Number(row.pv_json3).toLocaleString() }}
              </div>
            </template>
            <template #title="{ row }">
              <p
                class="
                  mx-3
                  bg-opacity-20
                  rounded
                  text-center text-xs
                  leading-5
                ">
                {{ row.title }}
              </p>
            </template>
            <template #status="{ row }">
              <div
                class="flex justify-center items-baseline gap-x-1"
                v-show="row.alert">
                <span class="flex items-center h-[10px] w-[10px]">
                  <span
                    class="
                      animate-ping
                      absolute
                      inline-flex
                      h-[10px]
                      w-[10px]
                      rounded-full
                      bg-red-300
                      opacity-75
                    "></span>
                  <span
                    class="
                      relative
                      inline-flex
                      rounded-full
                      h-[10px]
                      w-[10px]
                      bg-red-400
                    "></span>
                </span>
              </div>
            </template>
          </BasicTable>
        </div>
      </el-col>
      <el-col
        :span="24"
        :sm="8"
        :md="8"
        :lg="6"
        v-show="
          !isEmpty(state.dateOptions) &&
          state.selectedDate === state.dateOptions[0]
        ">
        <SetCalTitleCard
          :yrmo="formatNextMonth(state.dateOptions[0] || '')"
          @on-refresh="actions.handleGetCalTitle" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { CalTitleApiHandler } from '@/api/cal_title'
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import BasicTable from '@/components/Table/index.vue'
import DeleteButton from '@/components/Button/DeleteButton.vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import SetCalTitleCard from '@/components/Card/SetCalTitleCard.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import { uniqWith, isEqual, isEmpty } from 'lodash-es'
const { proxy } = getCurrentInstance()
const state = reactive({
  loading: false,
  showSetting: true,
  showSettingMobile: false,
  selectedDate: '',
  search: '',
  list: [],
  dateOptions: [],
  columns: [],
  tableData: [],
  nextMonth: '',
})

onMounted(() => {
  actions.handleGetCalTitle()
})

const formatMonth = computed(() => date => {
  const maxDay = 10
  const value = date.toString().split('-')
  const year = Number(value[0])
  const month = Number(value[1])
  const day = Number(value[2])
  const calculatorMonth = maxDay > day ? month - 1 : month
  // return `${year}-${calculatorMonth}`
  return `${calculatorMonth}月`
})

const formatNextMonth = computed(() => date => {
  const maxDay = 10
  const value = date?.toString().split('-')
  const year = Number(value[0])
  const month = Number(value[1])
  const day = Number(value[2])
  const calculatorMonth = maxDay > day ? month - 1 : month
  if (calculatorMonth === 12) {
    return `${year + 1}-01`
  } else {
    return `${year}-${calculatorMonth + 1}`
  }
})

const formatData = computed(() => {
  const format = state.tableData?.map(tableData => {
    const { title, pvjson, ...rest } = tableData
    const formatPvs = actions.handleFormatPvs(pvjson)
    return {
      title: actions.handleFormatTitle(title),
      alert: actions.handleFormatAlert(pvjson),
      pvjson: actions.handleFormatPvJson(pvjson),
      ...formatPvs,
      ...rest,
    }
  })
  return format
})

const actions = {
  /**
   * @description handleGetCalTitle 取得晉升計算清單
   * @param {string}  action  get_promo_rec
   */
  handleGetCalTitle: async () => {
    state.loading = true
    const params = {
      action: 'get_promo_rec',
    }
    const { code, data, msg } = await CalTitleApiHandler(params)
    if (code === 1) {
      state.dateOptions = Object.keys(data)
      state.list = data
      state.tableData = data[state.dateOptions[0]]
      state.selectedDate = state.dateOptions[0]
      const pv_keys =
        state.tableData?.length > 0
          ? Object.keys(state.tableData[0].pvjson)
          : []
      state.columns = [
        {
          label: '會員編號',
          prop: 'mbid',
          sortable: true,
          width: '90',
        },
        { label: '姓名', prop: 'name', sortable: true, width: '140' },
        {
          label: '電話',
          prop: 'phone',
          width: '100',
        },
        {
          label: 'class',
          prop: 'class',
          formatter: true,
          width: '80',
        },
        {
          label: '星級',
          prop: 'star',
          width: '80',
        },
        { label: '階級', prop: 'title', width: '70' },
        { label: '階級', prop: 'pvjson', width: '70' },
        // {
        //   label: pv_keys[0] || '',
        //   prop: 'pv_json1',
        //   align: 'right',
        //   width: '100',
        //   formatter: true,
        // },
        // {
        //   label: pv_keys[1] || '',
        //   prop: 'pv_json2',
        //   align: 'right',
        //   width: '100',
        //   formatter: true,
        // },
        // {
        //   label: pv_keys[2] || '',
        //   prop: 'pv_json3',
        //   align: 'right',
        //   width: '100',
        //   formatter: true,
        //   fixed: 'right',
        // },
        {
          label: '狀態',
          prop: 'status',
          align: 'center',
          formatter: true,
          fixed: 'right',
        },
      ]
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
    state.loading = false
  },

  handleFormatTitle: title => {
    const titleMap = {
      dir: '主任',
      sdir: '高級主任',
      mgr: '經理',
      smgr: '高級經理',
      chm: '總裁',
      schm: '一星總監',
      sschm: '二星總監',
      ssschm: '三星總監',
      fschm: '满天星總監',
    }
    return titleMap[title]
  },

  handleFormatAlert: pvJson => {
    const keys = Object.keys(pvJson)
    const value = 10000
    const success = pvJson[keys[0]] > value && pvJson[keys[1]] > value
    const alert = success && pvJson[keys[2]] < value
    return alert
  },

  handleFormatPvJson: pvJson => {
    const keys = Object.keys(pvJson)
    const format = keys.map(key => {
      return {
        time: key,
        pv: pvJson[key],
      }
    })
    return format
  },
  handleFormatPvs: pvJson => {
    const keys = Object.keys(pvJson)
    const formatPvs = keys.map(key => {
      return Number(pvJson[key]).toLocaleString()
    })
    const format = {
      [keys[0]]: formatPvs[0],
      [keys[1]]: formatPvs[1],
      [keys[2]]: formatPvs[2],
    }
    return format
  },
  handleFormatDate: date => {},

  handleDelete: async () => {
    state.loading = true
    const params = {
      action: 'del_promo_rec',
      countdate: state.selectedDate,
    }
    const { code, data, msg } = await CalTitleApiHandler(params)
    proxy.$message({
      type: 'error',
      message: msg,
    })
    state.loading = false
    if (code === 1) {
      setTimeout(() => {
        actions.handleGetCalTitle()
      }, 300)
    }
  },
  handleChangeDate: date => {
    state.tableData = state.list[date]
  },

  handleRest: () => {
    state.search = ''
    state.selectedDate = state.dateOptions[0]
    actions.handleGetCalTitle()
  },

  handleScrollToTop: () => {
    const anchor = document.querySelector('#special-setting')
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  },
}
</script>

<style lang="scss">
.month-container {
  overflow: hidden;
}
.month-group.el-radio-group {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: scroll;
  margin-right: 12px;
  padding-bottom: 3px;
}
</style>

<style lang="scss" scoped>
.select-date :deep(.el-input__inner) {
  color: $mainColor;
}
.table-animation {
  // transition: all 0.5s ease-in;
  // transition-delay: 0.5s;
}
// slide-fade
.slide-fade-enter-active {
  animation: slide-in 0.5s ease-in forwards;
  -webkit-animation: slide-in 0.5s ease-in forwards;
}

.slide-fade-leave-active {
  animation: slide-out 1s ease-out forwards;
  // transition: opacity 1s;
  -webkit-animation: slide-out 1s ease-out forwards;
}

@keyframes slide-in {
  from {
    // transition: opacity 1.5s;
    transform: translateX(30px);
    -webkit-transform: translateX(30px);
    -moz-transform: translateX(30px);
    -ms-transform: translateX(30px);
    -o-transform: translateX(30px);
    // opacity: 0;
  }
  to {
    transform: translateX(0);
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    // opacity: 1;
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