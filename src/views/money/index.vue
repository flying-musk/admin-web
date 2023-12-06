<template>
  <div id="money" class="h-full reactive">
    <!-- 金流管理 -->
    <div
      class="flex flex-col gap-y-3 md:gap-y-6 md:bg-white md:h-full md:p-3 rounded-md">
      <header
        class="flex justify-between md:items-center flex-col md:flex-row gap-y-3">
        <div
          class="flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-3">
          <SubTitle title="金流管理" class="min-w-fit" />
        </div>
        <div class="flex flex-col md:flex-row md:justify-between gap-3">
          <el-select
            v-model="state.search"
            value-key="value"
            placeholder="會員編號"
            clearable
            filterable
            class="w-full md:w-fit">
            <el-option
              v-for="item in state.searchOptions"
              :key="item.memberId"
              :label="item.memberId"
              :value="item.memberId">
              <div class="flex justify-between">
                <span>{{ item.memberId }}</span>
                <span>{{ item.name }}</span>
              </div>
            </el-option>
          </el-select>
          <el-button
            type="primary"
            class="w-full md:w-fit"
            :disabled="state.search === ''"
            auto-insert-space
            @click="actions.searchClick"
            >搜尋</el-button
          >
          <div>
            <el-button
              bg
              auto-insert-space
              class="w-full md:w-fit"
              @click="actions.resetClick"
              >重置</el-button
            >
          </div>
          <small class="text-gray-500 self-end min-w-[96px] text-right">{{
            state.message
          }}</small>
        </div>
      </header>
      <el-skeleton :loading="state.loading" animated>
        <template #template>
          <div class="grid md:grid-cols-4 gap-3">
            <div
              class="bg-white rounded-lg border shadow-gray-400/20 p-3 flex justify-between items-center h-[54px]"
              v-for="(cardItem, index) in 4"
              :key="index">
              <el-skeleton-item variant="text" style="width: 20%" />
              <el-skeleton-item variant="h1" style="width: 40%" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="grid md:grid-cols-4 gap-3">
            <MoneyCard
              title="總支出"
              :value="state.totalOut"
              :decrease="true" />
            <MoneyCard title="總收入" :value="state.totalIn" :increase="true" />
            <MoneyCard
              title="總轉出"
              :value="state.totalTrans"
              :decrease="true" />
            <MoneyCard title="總結餘" :value="state.balance" :increase="true" />
          </div>
          <BasicTable
            :columns="state.columns"
            :table-data="paginatedTableData"
            :total="state.pagination.total"
            :take="state.pagination.take"
            v-model:page="state.pagination.page">
            <template #mbid="{ row }">
              <p>
                <el-link class="link" @click="actions.linkClick(row.mbid)">{{
                  row.mbid
                }}</el-link>
              </p>
            </template>
            <template #amtout="{ row }">
              <p :class="{ decrease: row.amtout > 0 }">
                {{ actions.convertNumberToCurrencyString(row.amtout) }}
              </p>
            </template>
            <template #amtin="{ row }">
              <p :class="{ increase: row.amtin > 0 }">
                {{ actions.convertNumberToCurrencyString(row.amtin) }}
              </p>
            </template>
            <template #transfer="{ row }">
              <p :class="{ decrease: row.transfer > 0 }">
                {{ actions.convertNumberToCurrencyString(row.transfer) }}
              </p>
            </template>
            <template #bal="{ row }">
              <p :class="{ increase: row.bal > 0, decrease: row.bal < 0 }">
                {{ actions.convertNumberToCurrencyString(row.bal) }}
              </p>
            </template>
            <template #operation="{ row }">
              <p>
                <el-link class="link" @click="actions.linkClick(row.operation)"
                  >查看</el-link
                >
              </p>
            </template>
          </BasicTable>
        </template>
      </el-skeleton>
      <el-dialog
        v-model="state.isDialogVisible"
        width="80vw"
        align-center
        @close="actions.dialogClose">
        <div
          v-if="state.individualMember.isDialogSimplified"
          class="text-center">
          {{ state.individualMember.message }}
        </div>
        <div
          v-else
          class="flex flex-col gap-y-3 md:gap-y-6 md:bg-white md:h-full md:p-3 rounded-md">
          <div class="grid md:grid-cols-3 gap-3">
            <MoneyCard
              title="總支出"
              :decrease="true"
              :value="state.individualMember.totalOut" />
            <MoneyCard
              title="總收入"
              :value="state.individualMember.totalIn"
              :increase="true" />
            <MoneyCard
              title="總結餘"
              :value="state.individualMember.balance"
              :increase="true" />
          </div>
          <BasicTable
            :loading="state.individualMember.loading"
            :columns="state.individualMember.columns"
            :table-data="state.individualMember.tableData">
            <template #amtout="{ row }">
              <p :class="{ decrease: row.amtout > 0 }">
                {{ actions.convertNumberToCurrencyString(row.amtout) }}
              </p>
            </template>
            <template #amtin="{ row }">
              <p :class="{ increase: row.amtin > 0 }">
                {{ actions.convertNumberToCurrencyString(row.amtin) }}
              </p>
            </template>
          </BasicTable>
          <small class="text-gray-500 self-end text-[13px]">{{
            state.individualMember.message
          }}</small>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { MoneyApiHandler } from '@/api/money'
import SubTitle from '@/components/Text/SubTitle.vue'
import MoneyCard from '@/components/Card/MoneyCard.vue'
import BasicTable from '@/components/Table/index.vue'
const { proxy } = getCurrentInstance()
const state = reactive({
  isDialogVisible: false,
  loading: true,
  totalIn: '0.00',
  totalOut: '0.00',
  totalTrans: '0.00',
  balance: '0.00',
  search: '',
  searchOptions: [],
  pagination: {
    total: 0,
    page: 1,
    take: 30,
  },
  message: '',
  columns: [
    {
      label: '會員編號',
      prop: 'mbid',
      align: 'left',
      sortable: true,
      formatter: true,
    },
    {
      label: '會員名稱',
      prop: 'name',
      sortable: false,
      align: 'center',
    },
    {
      label: '支出 (¥)',
      prop: 'amtout',
      align: 'right',
      sortable: true,
      formatter: true,
    },
    {
      label: '收入 (¥)',
      prop: 'amtin',
      align: 'right',
      sortable: true,
      formatter: true,
    },
    {
      label: '轉出 (¥)',
      prop: 'transfer',
      align: 'right',
      sortable: true,
      formatter: true,
    },
    {
      label: '結餘 (¥)',
      prop: 'bal',
      align: 'right',
      sortable: true,
      formatter: true,
    },
    {
      label: '操作',
      prop: 'operation',
      formatter: true,
      align: 'center',
    },
  ],
  tableData: [],
  individualMember: {
    isDialogSimplified: false,
    loading: true,
    totalIn: '0.00',
    totalOut: '0.00',
    balance: '0.00',
    message: '',
    columns: [
      { label: '日期', prop: 'commit', sortable: true, width: '100' },
      {
        label: '類型',
        prop: 'type',
        width: '100',
      },
      {
        label: '支出 (¥)',
        prop: 'amtout',
        align: 'right',
        sortable: true,
        formatter: true,
      },
      {
        label: '收入 (¥)',
        prop: 'amtin',
        align: 'right',
        sortable: true,
        formatter: true,
      },
      {
        label: '備註',
        prop: 'remark',
      },
    ],
    tableData: [],
  },
})
onMounted(() => {
  actions.handleFetchAll()
})
const paginatedTableData = computed(() => {
  const { page, take } = state.pagination
  return state.tableData.filter(
    (item, index) => index < page * take && index >= take * (page - 1)
  )
})
const actions = {
  /**
   * @description MoneyApiHandler 金流縂明細
   * @param {string}  action  all
   */
  handleFetchAll: async () => {
    state.loading = true
    const params = {
      action: 'all',
    }
    const {
      code,
      data: {
        sum: { Bal, Total_in, Total_out, Total_trans },
        detail,
      },
      msg,
    } = await MoneyApiHandler(params)
    setTimeout(() => {
      state.loading = false
    }, 500)
    if (code === 1) {
      state.totalIn = actions.convertNumberToCurrencyString(Total_in)
      state.totalOut = actions.convertNumberToCurrencyString(Total_out)
      state.totalTrans = actions.convertNumberToCurrencyString(Total_trans)
      state.balance = actions.convertNumberToCurrencyString(Bal)
      state.searchOptions = detail.map(item => {
        return {
          memberId: item.mbid,
          name: item.name,
        }
      })
      state.message = msg.replace(/\d+(?= 筆)/g, match =>
        parseInt(match).toLocaleString()
      )
      state.pagination.total = detail.length
      state.tableData = detail.map(item => {
        return {
          mbid: item.mbid,
          name: item.name,
          amtout: Number(item.amtout),
          amtin: Number(item.amtin),
          transfer: Number(item.transfer),
          bal: Number(item.bal),
          operation: item.mbid,
        }
      })
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  /**
   * @description MoneyApiHandler 金流個別會員明細
   * @param {string}  action  individual
   * @param {string}  mbid  353526
   */
  handleFetchIndividual: async memberId => {
    const params = {
      action: 'individual',
      mbid: memberId,
    }
    const { code, data, msg } = await MoneyApiHandler(params)
    const { sum, detail } = data || {}
    const { Bal, Total_in, Total_out } = sum || {}
    setTimeout(() => {
      state.individualMember.loading = false
    }, 500)
    if (code === 1) {
      state.individualMember.isDialogSimplified = data === undefined
      if (data === undefined) {
        state.individualMember.message = msg
      } else {
        state.individualMember.message = msg.replace(/\d+(?= 筆)/g, match =>
          parseInt(match).toLocaleString()
        )
        state.individualMember.totalIn =
          actions.convertNumberToCurrencyString(Total_in)
        state.individualMember.totalOut =
          actions.convertNumberToCurrencyString(Total_out)
        state.individualMember.balance =
          actions.convertNumberToCurrencyString(Bal)
        state.individualMember.tableData = detail.map(item => {
          return {
            commit: item.commit,
            type: item.type,
            amtin: Number(item.amtin),
            amtout: Number(item.amtout),
            remark: item.remark,
          }
        })
      }
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  searchClick: () => {
    state.isDialogVisible = true
    actions.handleFetchIndividual(state.search)
  },
  resetClick: () => {
    state.search = ''
  },
  linkClick: memberId => {
    state.isDialogVisible = true
    actions.handleFetchIndividual(memberId)
  },
  convertNumberToCurrencyString: number => {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(number)
  },
  dialogClose: () => {
    state.individualMember.loading = true
  },
}
</script>

<style lang="scss" scoped>
.link {
  color: $mainColor;
  font-weight: 400;
  line-height: 16px;
}
</style>