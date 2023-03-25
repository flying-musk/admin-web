<template>
  <div id="travelcal-setting" class="h-full reactive">
    <!-- 旅游统计 -->
    <div class="flex flex-col gap-y-3 md:gap-y-6 md:bg-white md:h-full md:p-3 rounded-md">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-x-3">
          <SubTitle title="旅游统计" class="min-w-fit" />
          <el-date-picker v-model="state.selectedDate" type="daterange" range-separator="-" start-placeholder="起始日期"
            format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="結束日期" :disabled-date="disabledDate"
            size="small" @change="actions.handleFetchAll" />
        </div>
      </header>
      <div class=" space-y-3 md:space-y-6">
        <div class="flex gap-3 items-center border bg-primary-700  justify-between py-2 px-3 rounded-lg tracking-wide">
          <p class="text-gray-50 text-sm" v-text="state.count.msg"></p>
          <download-csv :name="formatFileName" :data="state.csv" v-if="hasData" class="w-fit">
            <el-button auto-insert-space>
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
    }, 500)
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
    }, 500)
    console.log(typeof res)
    const data = res.split(/[\n]/)
    const header = data[1].split(',')
    const content = data.splice(2, data.length)
    const formatData = content.map(row => {
      return header.reduce((obj, key, index) => {
        const formatContent = content[index].split(',')
        obj[key] = formatContent[index];
        return obj;
      }, {})
    });
    console.log(data)
    state.csv = formatData
  }
}
</script>