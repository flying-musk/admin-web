<template>
  <div id="travelcal-setting" class="h-full reactive">
    <pre>{{ state.csv }}</pre>
    <!-- 旅游统计 -->
    <div class="flex flex-col gap-y-3 md:gap-y-6 md:bg-white md:h-full md:p-3 rounded-md">
      <header class="flex justify-center md:justify-start items-center">
        <div class="flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-3">
          <SubTitle title="旅游统计" class="min-w-fit" />
          <el-radio-group v-model="state.selectedDateType" @change="actions.handleChangeSelectedDate">
            <el-radio-button label="week">近七天</el-radio-button>
            <el-radio-button label="month">上個月</el-radio-button>
            <el-radio-button label="season">前三個月</el-radio-button>
            <el-radio-button label="custom">自訂區間</el-radio-button>
          </el-radio-group>
          <Transition name="bounce" :duration="550">
            <div v-show="state.selectedDateType === 'custom'">
              <el-date-picker v-model="state.selectedDate" type="daterange" range-separator="-" start-placeholder="起始日期"
                :editable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="結束日期"
                :disabled-date="disabledDate" @change="actions.handleFetchAll" />
            </div>
          </Transition>

          <!-- <el-button type="primary" size="large" plain @click="actions.handleFetchAll"
            :icon="state.loading ? 'Refresh' : 'Search'" auto-insert-space :disabled="state.loading">查詢</el-button> -->
        </div>
      </header>
      <el-skeleton :loading="state.loading" animated :throttle="500" class="space-y-3">
        <template #template>
          <div class="flex flex-col md:flex-row  gap-3 items-center bg-white rounded-lg shadow-md shadow-gray-400/20 p-6">
            <el-skeleton-item variant="text" class="md:mr-3" />
            <el-skeleton-item variant="h1" style="width: 10%" />
          </div>
          <div class="hidden md:flex flex-row gap-x-3 py-3">
            <div class="w-1/3 bg-white rounded-lg border shadow-gray-400/20 p-3" v-for="(cardItem, index) in 3"
              :key="index">
              <div class="block">
                <el-skeleton-item variant="text" style="width:20%" />
              </div>
              <div class="block pt-3">
                <el-skeleton-item variant="h1" style="width: 40%" />
              </div>
            </div>
          </div>
          <div class="flex flex-col md:hidden justify-center text-center bg-white rounded-lg  shadow-gray-400/20 p-3"
            v-for="(cardItem, index) in 3" :key="index">
            <div class="block">
              <el-skeleton-item variant="text" style="width:20%" />
            </div>
            <div class="block pt-3">
              <el-skeleton-item variant="h1" style="width: 40%" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="space-y-3 md:space-y-6">
            <div
              class="flex flex-col md:flex-row gap-3 items-center shadow-md  bg-white md:bg-gray-50 justify-between py-2 px-3 rounded-lg tracking-wide">
              <p class="text-primary-500 text-sm" v-text="state.count.msg"></p>
              <download-csv :name="formatFileName" :data="state.csv" class="w-fit">
                <el-button auto-insert-space icon="Download" type="primary" :disabled="!hasData">
                  下載
                </el-button>
              </download-csv>
            </div>
            <div class="grid md:grid-cols-3 gap-3">
              <div class=" col-span-1" v-for="(value, name) in  state.count.data" :key="name">
                <CardDetailMainSection :title="name" :value="value" />
              </div>
            </div>

          </div>
        </template>
      </el-skeleton>


    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { TravelcalApiHandler } from '@/api/travelcal'
import SubTitle from '@/components/Text/SubTitle.vue'
import CardDetailMainSection from '@/components/Card/CardDetailMainSection.vue'
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance()
const state = reactive({
  loading: false,
  selectedDateType: 'custom',
  selectedDate: [dayjs()
    .subtract(1, 'year')
    .format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD')
  ],
  count: {
    data: {},
    msg: ''
  },
  csv: []
})
const date_begin = computed(() => {
  return state.selectedDate.length > 1 ? state.selectedDate[0] : null
})
const date_end = computed(() => {
  return state.selectedDate.length > 1 ? state.selectedDate[1] : null
})

const formatFileName = computed(() => {
  return state.selectedDate.length > 1 ? `travel-${state.selectedDate[0]}-${state.selectedDate[1]}.csv` : 'data.csv'
})

const hasData = computed(() => {
  const values = Object.values(state.count.data);
  const filteredValues = values.filter(element => element !== "0");
  return filteredValues.length > 0
})
onMounted(() => {
  actions.handleFetchAll()
})
const disabledDate = (time) => {
  return time.getTime() < Date.parse('2018-11-01')
}

const actions = {
  handleChangeSelectedDate: (value) => {
    const dateMap = {
      week: dayjs()
        .subtract(7, 'day')
        .format('YYYY-MM-DD'),
      month: dayjs()
        .subtract(1, 'month')
        .format('YYYY-MM-DD'),
      season: dayjs()
        .subtract(3, 'month')
        .format('YYYY-MM-DD'),
      custom: dayjs()
        .subtract(1, 'year')
        .format('YYYY-MM-DD'),
    }

    state.selectedDate = [dateMap[value], dayjs().format('YYYY-MM-DD')]
    actions.handleFetchAll()
  },
  /**
   * @description TravelcalApiHandler 旅遊
   * @param {date}  date_begin   起始日期
   * @param {date}  date_end    結束日期
   */
  handleFetchAll: async () => {
    state.loading = true
    const params = {
      date_begin: date_begin.value,
      date_end: date_end.value,
    }
    const { code, data = {}, msg } = await TravelcalApiHandler(params)
    setTimeout(() => {
      state.loading = false
    }, 1500)
    if (code === 1) {
      state.count =
      {
        data,
        msg,
      }
      actions.handleDownload()
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },

  /**
   * @description TravelcalApiHandler 旅遊
   * @param {string}  action   getclsinfo
   * @param {date}  date_begin   起始日期
   * @param {date}  date_end    結束日期
   */
  handleDownload: async () => {
    const noDate = !date_begin.value || !date_end.value
    const noData = !hasData.value
    if (noDate || noData) return
    state.loading = true
    const params = {
      action: 'getclsinfo',
      date_begin: date_begin.value,
      date_end: date_end.value,
    }
    const res = await TravelcalApiHandler(params)
    setTimeout(() => {
      state.loading = false
    }, 1500)
    const data = res.split(/[\n]/)
    const header = data[1].split(',')
    const content = data.splice(2, data.length)
    const formatData = content.map(row => {
      return header.reduce((obj, key, index) => {
         row = row.replace(/\"/g, "")
        const formatContent = row.split(',')
        obj[key] = formatContent[index];
        return obj;
      }, {})
    });
    state.csv = formatData
  }
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}
</style>