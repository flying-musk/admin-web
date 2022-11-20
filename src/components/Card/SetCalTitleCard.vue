<template>
  <div
    class="bg-white tracking-wider text-gray-500 text-xs rounded-md border-2"
    disabled>
    <header
      class="
        bg-gray-50
        text-gray-700
        py-2
        px-4
        text-center
        shadow
        tracking-widest
        flex
        items-center
        cursor-pointer
      "
      @click="state.isCollapse = !state.isCollapse">
      <h3 class="flex-1">{{ yrmo }}月份計算</h3>
      <el-icon>
        <ArrowUp v-show="state.isCollapse" />
        <ArrowDown v-show="!state.isCollapse" />
      </el-icon>
    </header>
    <div v-show="state.isCollapse">
      <div class="m-1 border-b">
        <div class="flex items-center justify-between p-1">
          <p class="tracking-widest">晉升清單</p>
          <small class="px-2 font-light"
            >共
            <span class="text-primary-500 font-medium">{{
              Object.keys(state.confirm.accept).length
            }}</span>
            筆</small
          >
        </div>
      </div>
      <div class="m-1 border-b">
        <div class="flex items-center justify-between p-1">
          <p class="tracking-widest">駁回清單</p>
          <small class="px-2 font-light"
            >共
            <span class="text-primary-500 font-medium">{{
              Object.keys(state.confirm.reject).length
            }}</span>
            筆</small
          >
        </div>
      </div>

      <div v-show="!isEmpty(alertData)" class="m-1">
        <div class="flex items-center justify-between p-1">
          <div class="flex items-center gap-x-1">
            <p class="tracking-widest">提醒清單</p>
            <span class="flex items-center h-[8px] w-[8px]">
              <span
                class="
                  animate-ping
                  absolute
                  inline-flex
                  h-[8px]
                  w-[8px]
                  rounded-full
                  bg-red-300
                  opacity-75
                "></span>
              <span
                class="
                  relative
                  inline-flex
                  rounded-full
                  h-[8px]
                  w-[8px]
                  bg-red-400
                "></span>
            </span>
          </div>
          <small class="px-2 font-light"
            >共
            <span class="text-primary-500 font-medium">{{
              alertData.length
            }}</span>
            筆</small
          >
        </div>

        <CardTwoCol
          class="py-1 m-1 text-xs shadow bg-gray-100"
          :item="{
            label: '會員編號',
            value: `${yrmo}`,
          }" />
        <div class="max-h-[400px] overflow-y-scroll">
          <el-tooltip
            v-for="(alert, i) in alertData"
            :key="i"
            placement="left"
            :content="`${alert.name} ${alert.phone}`">
            <CardTwoCol
              class="
                text-gray-500 text-xs
                py-1
                m-1
                cursor-default
                hover:text-white hover:bg-primary-50
              "
              :class="{ 'bg-gray-50': i % 2 !== 0 }"
              :item="{
                label: `${i + 1 >= 10 ? i + 1 : `0${i + 1}`}. ${alert.mbid}`,
                value: `${alert.pvjson[2].pv}`,
              }" />
          </el-tooltip>
        </div>
      </div>
      <el-form
        class="form p-3 mt-3"
        :model="state.model"
        hide-required-asterisk
        scroll-to-error
        ref="refForm">
        <el-button
          :loading="state.loading"
          size="default"
          type="primary"
          class="w-full"
          auto-insert-space
          @click="actions.handleSubmit">
          {{ btnText }}
        </el-button>
      </el-form>
    </div>

    <el-dialog
      v-model="state.dialogVisible"
      :title="state.confirm.title"
      :fullscreen="true"
      center>
      <el-row :gutter="12">
        <el-col :span="24" :sm="18">
          <div>
            <div class="flex items-center justify-between mb-2">
              <SubTitle title="滑動業績" />
              <small class="px-2 font-light"
                >共
                <span class="text-primary-500 font-medium">{{
                  formatData.length
                }}</span>
                筆</small
              >
            </div>
            <!-- 晉升計算清單 -->
            <el-table
              :data="formatData"
              size="small"
              max-height="550"
              ref="refTable"
              highlight-current-row>
              <el-table-column
                type="index"
                align="center"
                width="35"
                fixed="left" />
              <el-table-column prop="mbid" label="編號" width="80" />
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="phone" label="電話" width="125" />
              <el-table-column label="階級紀錄">
                <el-table-column prop="title" label="階級" />
                <el-table-column prop="class" label="等級" width="80" />
                <el-table-column
                  prop="star"
                  label="星級"
                  width="45"
                  align="right" />
              </el-table-column>
              <el-table-column label="PV 紀錄">
                <el-table-column
                  align="right"
                  v-for="item in formatData[0].pvjson"
                  :key="item.time"
                  :prop="item.time"
                  :label="item.time"
                  width="100" />
              </el-table-column>
              <el-table-column
                label="提醒"
                props="status"
                width="50"
                fixed="right">
                <template #default="{ row }">
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
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="24" :sm="6">
          <div
            v-show="!isEmpty(state.confirm.accept)"
            class="mb-6 border shadow">
            <div class="flex items-center justify-between p-2 mb-3 shadow">
              <SubTitle title="晉升清單" />
              <small class="px-2 font-light"
                >共
                <span class="text-primary-500 font-medium">{{
                  Object.keys(state.confirm.accept).length
                }}</span>
                筆</small
              >
            </div>
            <CardTwoCol
              v-for="(accept, i) in Object.keys(state.confirm.accept)"
              @click="actions.handleSetCurrent(accept)"
              class="
                cursor-pointer
                text-gray-500 text-xs
                hover:text-primary-500 hover:bg-gray-50
                rounded
                py-1
                m-1
              "
              :key="i"
              :item="{
                label: `${
                  i + 1 >= 10 ? i + 1 : `0${i + 1}`
                }. ${accept} ${actions.handleFormatTitle(
                  state.confirm.accept[accept].oldTitle
                )} `,
                value: `${actions.handleFormatTitle(
                  state.confirm.accept[accept].newTitle
                )}`,
              }" />
          </div>
          <div
            v-show="!isEmpty(state.confirm.reject)"
            class="mb-6 border shadow">
            <div class="flex items-center justify-between p-2 mb-3 shadow">
              <SubTitle title="駁回清單" />
              <small class="px-2 font-light"
                >共
                <span class="text-primary-500 font-medium">{{
                  Object.keys(state.confirm.reject).length
                }}</span>
                筆</small
              >
            </div>
            <CardTwoCol
              v-for="(reject, i) in Object.keys(state.confirm.reject)"
              :key="i"
              @click="actions.handleSetCurrent(reject)"
              class="
                cursor-pointer
                text-gray-500 text-xs
                hover:text-primary-500 hover:bg-gray-50
                rounded
                py-1
                m-1
              "
              :item="{
                label: `${
                  i + 1 >= 10 ? i + 1 : `0${i + 1}`
                }. ${reject} ${actions.handleFormatTitle(
                  state.confirm.reject[reject]?.oldTitle
                )}`,
                value: `${state.confirm.reject[reject].reason}`,
              }" />
          </div>
          <div v-show="!isEmpty(alertData)" class="mb-6 border shadow">
            <div class="flex items-center justify-between p-2 mb-3 shadow">
              <SubTitle title="提醒清單" />
              <small class="px-2 font-light"
                >共
                <span class="text-primary-500 font-medium">{{
                  alertData.length
                }}</span>
                筆</small
              >
            </div>
            <CardTwoCol
              class="py-1 m-1 text-xs shadow bg-gray-100"
              :item="{
                label: '會員編號',
                value: 'PV 提醒',
              }" />
            <CardTwoCol
              v-for="(alert, i) in alertData"
              :key="i"
              @click="actions.handleSetCurrent(alert.mbid)"
              class="
                cursor-pointer
                text-gray-500 text-xs
                hover:text-primary-500 hover:bg-gray-50
                rounded
                py-1
                m-1
              "
              :item="{
                label: `${i + 1 >= 10 ? i + 1 : `0${i + 1}`}. ${alert.mbid}`,
                value: `${alert.pvjson[2].pv}`,
              }" />
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer flex justify-end fixed bottom-0 right-0 bg-white z-10 w-full p-3 border-t-2 mt-3">
          <el-button @click="state.dialogVisible = false">下次再結算</el-button>
          <el-button type="primary" @click="actions.handleSubmit(1)">
            確認結算
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  getCurrentInstance,
  onMounted,
  watch,
} from 'vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import { SetCalTitle } from '@/api/cal_title'
import { ArrowDown } from '@element-plus/icons-vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import { isEmpty } from 'lodash-es'

const { proxy } = getCurrentInstance()
const props = defineProps({
  yrmo: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['on-refresh'])
const refForm = ref(null)
const refTable = ref(null)
const state = reactive({
  loading: false,
  isCollapse: true,
  dialogVisible: false,
  model: {
    action: 'cal_yrmo',
    yrmo: '',
    iscfm: 0,
  },
  confirm: {
    title: '',
    lists: [],
    promo: {},
    accept: {},
    reject: [],
  },
})
const btnText = computed(() => (state.loading ? '試算中...' : '查看試算詳情'))
const formatData = computed(() => {
  const format = state.confirm.lists?.map(tableData => {
    const { title, pvs, ...rest } = tableData
    const formatPvs = actions.handleFormatPvs(pvs)
    return {
      title: actions.handleFormatTitle(title),
      alert: actions.handleFormatAlert(pvs),
      pvjson: actions.handleFormatPvJson(pvs),
      ...formatPvs,
      ...rest,
    }
  })
  return format
})
const alertData = computed(() => {
  return formatData.value?.filter(item => item.alert)
})

watch(
  () => props.yrmo,
  (yrmo, prevYrmo) => {
    setTimeout(() => {
      actions.handleSubmit(0, false)
    }, 500)
  }
)

const actions = {
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
    return titleMap[title] || ''
  },
  handleFormatAlert: pvJson => {
    const keys = Object.keys(pvJson)
    const value = 5000
    const success = pvJson[keys[0]] > value && pvJson[keys[1]] > value
    const alert = success && pvJson[keys[2]] < value
    return alert
  },
  handleFormatPvJson: pvJson => {
    const keys = Object.keys(pvJson)
    const format = keys.map(key => {
      return {
        time: key,
        pv: Number(pvJson[key]).toLocaleString(),
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
  /**
   * @description 月份計算
   * @param {string}  action  cal_yrmo
   * @param {number}  yrmo    月份
   * @param {number}  iscfm   null(未確認) or 1(確認)
   */
  handleSubmit: (iscfm = 0, dialogVisible = true) => {
    refForm.value.validate(async valid => {
      if (valid) {
        state.model.yrmo = props.yrmo
        state.model.iscfm = iscfm
        state.loading = true
        const { code, data, msg } = await SetCalTitle(state.model)
        if (code > 0) {
          if (iscfm === 1) {
            proxy.$message({
              type: 'success',
              message: msg,
            })
            refForm.value.resetFields()
            emit('on-refresh')
            state.dialogVisible = false
          } else {
            const { promo, lists } = data
            const { accept, reject, ...rest } = promo
            state.confirm = {
              title: msg,
              accept,
              reject,
              promo: rest,
              lists,
            }
            state.dialogVisible = dialogVisible
          }
        } else {
          proxy.$message({
            type: 'error',
            message: msg,
          })
        }
        setTimeout(() => {
          state.loading = false
        }, 500)
      }
    })
  },
  handleSetCurrent: id => {
    console.log('handleSetCurrent')
    console.log(id)
    const row = formatData.value.find(item => item.mbid == id)
    const rowIndex = formatData.value.findIndex(item => item.mbid == id)
    console.log(row)
    refTable.value.setCurrentRow(row)
    actions.scrollToRow(rowIndex)
  },
  handleListFormat: list => {},

  scrollToRow(index) {
    console.log(refTable.value)
    const tbody = refTable.value
    const row = tbody.querySelectorAll('tr')[index]
    row.scrollIntoView()
  },
}
</script>