<template>
  <div id="tax-setting" class="taxSetting h-full reactive">
    <!-- 稅務表格 -->
    <div class="flex flex-col gap-y-3 md:bg-white md:h-full md:p-3 rounded-md">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-x-3">
          <SubTitle title="稅務表格" class="min-w-fit" />
          <el-select
            v-model="state.selectedDate"
            value-key="value"
            placeholder="月份"
            size="small"
            class="max-w-[120px] select-date"
            @change="actions.handleFetchAll">
            <template #prefix>月份</template>
            <el-option
              v-for="date in state.dateOptions"
              :key="date"
              :label="`${date}`"
              :value="date" />
          </el-select>
        </div>
      </header>

      <!-- 稅務表格 filter -->
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
              :label="`${item.member_id}｜${item.name}`"
              :value="item.member_id">
              <div class="flex justify-between">
                <span>{{ item.member_id }}</span>
                <span>{{ item.name }}</span>
              </div>
            </el-option>
          </el-select>
          <div class="flex flex-col w-full md:w-fit gap-3 md:flex-row">
            <el-button type="primary" class="w-full md:w-fit" auto-insert-space
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
      <TaxCard
        class="md:hidden"
        :list="formatTableData"
        :loading="state.loading"
        @verify-tax="actions.handleVerifyTax"
        @on-download="actions.handleDownload" />

      <!-- table  -->
      <BasicTable
        :columns="state.columns"
        :table-data="formatPaginationTableData"
        :loading="state.loading"
        :total="state.pagination.total"
        :take="state.pagination.take"
        v-model:page="state.pagination.page"
        class="hidden md:block">
        <template #member="{ row }">
          <div class="text-xs leading-5 flex items-center gap-x-1 w-full">
            <div
              v-for="(value, key) in row.member"
              :key="key"
              class="flex  items-center">
                <div class="flex flex-col px-2">
                  <span class="tracking-widest font-thin"
                  >{{ actions.handleFormatMemberLabel(key) }}
                  </span
                >
                <span>{{ value || '-' }}</span>
                </div>
            </div>
          </div>
        </template>
        <template #name="{ row }">
          <div
            class="
              cursor-pointer
              hover:opacity-70
              text-primary-500
              flex
              items-center
              gap-x-1
              w-fit
            "
            @click="actions.handleDownload(row)">
            <p>{{ row.name }}</p>
            <el-icon><Download /></el-icon>
          </div>
        </template>
        <template #status="{ row }">
          <el-tag
            effect="plain"
            round
            size="small"
            :type="row.statusType"
            >{{ row.status }}</el-tag
          >
        </template>
        <template #action="{ row }">
          <button
            v-show="!row.name.includes('verified')"
            class="cursor-pointer hover:opacity-70 text-primary-500"
            @click="
              actions.handleVerifyTax({
                file: row.name,
                type: 'verify',
              })
            ">
            通過
          </button>
          <button
            v-show="row.name.includes('verified')"
            class="cursor-pointer hover:opacity-70 text-gray-500"
            @click="
              actions.handleVerifyTax({
                file: row.name,
                type: 'revoke',
              })
            ">
            撤銷
          </button>
        </template>
      </BasicTable>
    </div>
    <ScrollToTop @click.prevent="actions.handleScrollToTop" />
  </div>
</template>

<script setup>
import { FileApiHandler } from '@/api/file'
import { TexApiHandler } from '@/api/tax'
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import BasicTable from '@/components/Table/index.vue'
import TaxCard from '@/components/Card/TaxCard.vue'
import SubTitle from '@/components/Text/SubTitle.vue'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import SetDeductCard from '@/components/Card/SetDeductCard.vue'
import { uniqWith, isEqual } from 'lodash-es'
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance()
const state = reactive({
  loading: false,
  showSetting: true,
  showSettingMobile: false,
  selectedDate: dayjs().format('YYYYMM'),
  dateOptions: [
    dayjs().format('YYYYMM'),
    dayjs().subtract(1, 'month').format('YYYYMM'),
    dayjs().subtract(2, 'month').format('YYYYMM'),
    dayjs().subtract(3, 'month').format('YYYYMM'),
    dayjs().subtract(4, 'month').format('YYYYMM'),
    dayjs().subtract(5, 'month').format('YYYYMM'),
  ],
  search: '',
  searchOptions: [],
  pagination: {
    show: true,
    total: 0,
    page: 1,
    take: 20,
  },
  columns: [
    { label: '時間', prop: 'filetime', width: '130', sortable: true },
    {
      label: '會員資料',
      prop: 'member',
      sortable: true,
      formatter: true,
    },
    { label: '文件名稱', prop: 'name', sortable: true, formatter: true,
    width: '280',
  },
    {
      label: '狀態',
      prop: 'status',
      formatter: true,
      width: '100',
      align: 'center',
    },
    {
      label: '操作',
      prop: 'action',
      formatter: true,
      width: '100',
      align: 'center',
    },
  ],
  tableData: [],
})

const formatPaginationTableData = computed(() => {
  const { page, take } = state.pagination
  if (state.search) {
    const searchData = state.tableData.filter(
      el => el.member.mbid === state.search
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
      el => el.member.mbid === state.search
    )
    return searchData
  }
  return state.tableData
})

onMounted(() => {
  actions.handleFetchAll()
})

const actions = {
  /**
   * @description TexApiHandler 取得年月 稅務清單
   * @param {string}  action  list_all
   * @param {number}  yrmo    年月 202301
   * @param {number}  mbid    會員編號
   */
  handleFetchAll: async () => {
    state.loading = true
    const params = {
      action: 'list_all',
      yrmo: state.selectedDate,
    }
    const { code, data = [], count = 0, msg } = await TexApiHandler(params)
    setTimeout(() => {
      state.loading = false
    }, 500)
    if (code === 1) {
      state.tableData = data
      state.tableData.forEach(element => {
        const timeStamp = element.filetime * 1000
        element.status = actions.handleFormatStatus(element.name)
        element.statusType = actions.handleFormatStatusType(element.name)
        element.filetime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
      })
      state.pagination.total = Number(count)
      const members = data.map(item => item.member).flat()
      const options = members.map(item => {
        return { member_id: item.mbid, name: item.name }
      })
      state.searchOptions = uniqWith(options, isEqual) || []
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },

  handleRest: () => {
    state.search = ''
    state.selectedDate = dayjs().format('YYYYMM')
    actions.handleFetchAll()
  },
  /**
   * @description TexApiHandler 通過/撤銷 審核
   * @param {string}  action  set_verified
   * @param {string}  file  文件名稱 xxx.pdf
   * @param {string}  type   verify(通過) or revoke(撤銷)
   */
  handleVerifyTax: async params => {
    const { file, type, action = 'set_verified' } = params
    const { code, data, msg } = await TexApiHandler({ file, type, action })
    if (code === 1) {
      actions.handleFetchAll()
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },

  handleScrollToTop: () => {
    const anchor = document.querySelector('#tax-setting')
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  },

  handleFormatMemberLabel: label => {
    const formatLabelMap = {
      mbid: '編號',
      name: '姓名',
      taxno: '稅號',
      phone: '電話',
      email: '信箱',
    }
    return formatLabelMap[label]
  },

  handleFormatStatus: name => {
    const isVerified = name.includes('verified')
    return isVerified ? '已驗證' : '未驗證'
  },
  handleFormatStatusType: name => {
    const isVerified = name.includes('verified')
    return isVerified ? 'success' : 'info'
  },
  /**
   * @description 下載檔案
   */
  handleDownload: async file => {
    const params = {
      file: file.name,
      path: file.path,
    }
    try {
      const res = await FileApiHandler(params)
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.name)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
      proxy.$message({
        type: 'error',
        message: '下載發生錯誤，請稍後再試',
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.select-date :deep(.el-input__inner) {
  color: $mainColor;
}
</style>