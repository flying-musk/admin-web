<template>
  <div>
  <div
      v-show="state.loading"
      class="flex min-w-screen min-h-screen justify-center items-center">
      <!-- <el-button text loading>加載中...</el-button> -->
      <iframe src="https://embed.lottiefiles.com/animation/97930"></iframe>
    </div>
    <div class="lg:bg-white rounded lg:px-1 lg:py-2" v-show="!state.loading">
      <div class="space-y-3 detail-page">
        <div class="flex justify-between items-center border-b pb-2 pr-2">
          <h1 class="text-sm">預收訂單詳情</h1>
          <div class="space-x-3">
            <small class="font-thin">
              建立時間：{{ state.editProductModel.dateadd }}
            </small>
            <el-button bg text auto-insert-space @click="actions.handleGoBack"
              >返回列表頁</el-button
            >
          </div>
        </div>
        <div class="divide-y space-y-2">
          <div class="space-y-1">
            <SubTitle
              :title="`送單人會員編號：${state.editProductModel.mbid}`" />
            <div
              class="grid md:grid-cols-2 lg:grid-cols-3 text-xs text-gray-500">
              <CardTwoCol
                :item="{
                  label: '訂購人編號',
                  value: state.editProductModel.ordermbid,
                }" />
              <CardTwoCol
                :item="{
                  label: '推薦人編號',
                  value: state.editProductModel.rmbid,
                }" />
              <CardTwoCol
                :item="{
                  label: '安置人編號',
                  value: state.editProductModel.umbid,
                }" />
              <CardTwoCol
                :item="{
                  label: '培訓人編號',
                  value: state.editProductModel.smbid,
                }" />
              <CardTwoCol
                :item="{
                  label: '線位',
                  value: ' ',
                }">
                <el-tag
                  :type="state.editProductModel.leg == 1 ? 'danger' : 'success'"
                  effect="plain"
                  round
                  size="small"
                  v-show="!!state.editProductModel.leg">
                  <p class="tracking-widest">
                    {{ state.editProductModel.leg == 1 ? '左線' : '右線' }}
                  </p>
                </el-tag>
              </CardTwoCol>
            </div>
          </div>
          <div class="space-y-1 pt-2">
            <SubTitle title="付款資料" />
            <div
              class="grid md:grid-cols-2 lg:grid-cols-3 text-xs text-gray-500">
              <CardTwoCol
                :item="{
                  label: '付款狀態',
                  value: state.editProductModel.paystatus,
                }" />

              <CardTwoCol
                :item="{
                  label: '付款日期',
                  value: state.editProductModel.payrcvday,
                }" />

              <CardTwoCol
                :item="{
                  label: '付款詳情',
                  value: state.editProductModel.paydetail,
                }" />
              <CardTwoCol
                :item="{
                  label: '備註',
                  value: state.editProductModel.remark,
                }" />
            </div>
          </div>
        </div>
        <div class="grid lg:grid-cols-4 gap-x-3">
          <div class="col-span-3 lg:col-span-2">
            <el-form
              ref="refForm"
              :model="state.editProductModel"
              label-position="top"
              class="form hide-err-form"
              hide-required-asterisk
              status-icon
              size="small"
              :disabled="state.isDisabled"
              scroll-to-error>
              <div class="flex flex-col gap-y-3">
                <div class="space-y-1">
                  <SubTitle title="訂購人資料" />
                  <div class="pl-[1.5em] pr-1">
                    <div class="flex flex-row gap-x-3">
                      <el-form-item
                        label="訂購人名字"
                        prop="first_name"
                        class="flex-1">
                        <el-input
                          class="text"
                          v-model="state.editProductModel.first_name"
                          clearable
                          placeholder="請輸入訂購人名字" />
                      </el-form-item>
                      <el-form-item
                        label="訂購人姓氏"
                        prop="last_name"
                        class="flex-1">
                        <el-input
                          class="text"
                          v-model="state.editProductModel.last_name"
                          clearable
                          placeholder="請輸入訂購人姓氏" />
                      </el-form-item>
                    </div>

                    <div class="grid lg:grid-cols-2 gap-x-3">
                      <el-form-item
                        class="px-1"
                        label="訂購人電話"
                        prop="phone">
                        <el-input
                          class="text"
                          v-model.trim="state.editProductModel.phone"
                          prefix-icon="Phone"
                          clearable
                          @input="
                            actions.handleGetRecord(
                              state.editProductModel.phone,
                              false
                            )
                          " />
                      </el-form-item>
                      <el-form-item label="訂購人 E-mail" prop="email">
                        <el-input
                          v-model="state.editProductModel.email"
                          placeholder="ex.abc123456@gmail.com" />
                      </el-form-item>
                    </div>

                    <div
                      v-if="!isEmpty(state.memberOptions)"
                      class="flex overflow-x-auto gap-x-3">
                      <div
                        v-for="member in state.memberOptions"
                        :key="member.name"
                        class="
                          border
                          rounded
                          flex flex-col
                          p-3
                          gap-y-1
                          cursor-pointer
                          tracking-wider
                        "
                        :class="{
                          'border-primary-500':
                            state.editProductModel.mbid == member.mbid,
                        }"
                        @click="state.editProductModel.mbid = member.mbid">
                        <p>
                          {{ member.name }}
                        </p>
                        <small class="font-light">
                          {{ member.mbid }}
                        </small>
                      </div>
                    </div>

                    <div class="flex gap-x-3">
                      <el-form-item label="區域編號" class="flex-shrink">
                        <el-input
                          v-model="state.zipCode"
                          autocomplete="off"
                          @input="actions.handleZipCode"
                          placeholder="ex.12302" />
                        <p
                          v-show="hasAddress"
                          class="text-red-400 text-xs tracking-wider">
                          無此區域編號
                        </p>
                      </el-form-item>
                      <el-form-item
                        label="區域"
                        class="flex-grow"
                        v-if="!isEmpty(postcodeOptions)">
                        <el-select v-model="selectedPostcode" class="w-full">
                          <el-option
                            v-for="(item, index) in postcodeOptions"
                            :key="item + index"
                            :label="item"
                            :value="item" />
                        </el-select>
                      </el-form-item>
                    </div>

                    <el-form-item label="訂購人完整地址" prop="add2">
                      <el-input
                        v-model="state.editProductModel.add2"
                        autocomplete="off"
                        placeholder="ex.xx弄xx巷xx號" />
                    </el-form-item>
                    <div class="grid lg:grid-cols-2 gap-x-3">
                      <el-form-item label="訂購人性別" prop="sex">
                        <el-radio-group
                          v-model="state.editProductModel.sex"
                          class="flex w-full">
                          <el-radio
                            class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                            border
                            label="m"
                            @click.prevent="
                              actions.handleRadioClick('sex', 'm')
                            "
                            >男</el-radio
                          >
                          <el-radio
                            class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                            border
                            label="f"
                            @click.prevent="
                              actions.handleRadioClick('sex', 'f')
                            "
                            >女</el-radio
                          >
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="訂購人生日" prop="birth">
                        <el-date-picker
                          v-model="state.editProductModel.birth"
                          type="date"
                          placeholder="ex.1990-01-03"
                          value-format="YYYY-MM-DD"
                          style="width: 100%" />
                      </el-form-item>
                    </div>
                    <div class="grid lg:grid-cols-2 gap-x-3">
                      <el-form-item label="訂購人證照別" prop="idtype">
                        <el-radio-group
                          v-model="state.editProductModel.idtype"
                          class="flex w-full">
                          <el-radio
                            class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                            v-for="(type, i) in Object.entries(
                              variables.idtype
                            )"
                            :key="i"
                            :label="type[0]"
                            border
                            @click.prevent="
                              actions.handleRadioClick('idtype', type[0])
                            "
                            >{{ type[1] }}</el-radio
                          >
                        </el-radio-group>
                      </el-form-item>

                      <el-form-item
                        label="訂購人證號"
                        prop="idnumber"
                        v-if="!isEmpty(state.editProductModel.idtype)">
                        <el-input
                          class="text"
                          v-model="state.editProductModel.idnumber"
                          clearable
                          :disabled="!state.editProductModel.idtype" />
                      </el-form-item>
                    </div>

                    <el-form-item label="訂購人所在國家" prop="ccode">
                      <el-radio-group
                        v-model="state.editProductModel.ccode"
                        class="flex w-full">
                        <el-radio
                          class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                          v-for="(ccode, i) in Object.entries(
                            variables.ccodename
                          )"
                          :key="i"
                          :label="ccode[0]"
                          border
                          @click.prevent="
                            actions.handleRadioClick('ccode', ccode[0])
                          "
                          >{{ ccode[1] }}</el-radio
                        >
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-x-3">
                    <SubTitle title="收貨人資料" />
                    <el-checkbox
                      v-if="!state.isDisabled"
                      v-model="sameAddrHandler">
                      同訂購人</el-checkbox
                    >
                  </div>
                  <div class="pl-[1.5em] pr-1" v-show="!sameAddrHandler">
                    <div class="flex flex-row gap-x-3">
                      <el-form-item
                        label="收貨人名字"
                        prop="first_rcvname"
                        class="flex-1">
                        <el-input
                          class="text"
                          v-model="state.editProductModel.first_rcvname"
                          clearable
                          placeholder="請輸入收貨人名字" />
                      </el-form-item>
                      <el-form-item
                        label="收貨人姓氏"
                        prop="last_rcvname"
                        class="flex-1">
                        <el-input
                          class="text"
                          v-model="state.editProductModel.last_rcvname"
                          clearable
                          placeholder="請輸入收貨人姓氏" />
                      </el-form-item>
                    </div>
                    <div class="grid lg:grid-cols-2 gap-x-3">
                      <el-form-item
                        class="px-1"
                        label="收貨人電話"
                        prop="rcvphone">
                        <el-input
                          class="text"
                          v-model.trim="state.editProductModel.rcvphone"
                          prefix-icon="Phone"
                          clearable />
                      </el-form-item>

                      <el-form-item label="收貨人 E-mail" prop="rcvemail">
                        <el-input
                          v-model="state.editProductModel.rcvemail"
                          placeholder="ex.abc123456@gmail.com" />
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex gap-x-3">
                        <el-form-item label="區域編號" class="flex-shrink">
                          <el-input
                            v-model="state.zipCode2"
                            autocomplete="off"
                            @input="actions.handleZipCode2"
                            placeholder="ex.12302" />
                          <p
                            v-show="hasAddress2"
                            class="text-red-400 text-xs tracking-wider">
                            無此區域編號
                          </p>
                        </el-form-item>
                        <el-form-item
                          label="區域"
                          class="flex-grow"
                          v-if="!isEmpty(postcodeRecOptions)">
                          <el-select
                            v-model="selectedPostcodeRec"
                            class="w-full">
                            <el-option
                              v-for="(item, index) in postcodeRecOptions"
                              :key="item + index"
                              :label="item"
                              :value="item" />
                          </el-select>
                        </el-form-item>
                      </div>

                      <el-form-item label="收貨人完整地址" prop="shipadd2">
                        <el-input
                          v-model="state.editProductModel.shipadd2"
                          autocomplete="off"
                          placeholder="ex.xx弄xx巷xx號" />
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
            <footer class="flex justify-end p-2" v-show="!state.isDisabled">
              <el-button
                class="w-full lg:w-fit"
                type="primary"
                @click="actions.handlePreOrderEdit"
                >提交修改</el-button
              >
            </footer>
          </div>
          <el-tabs class="col-span-1 lg:col-span-2">
            <el-tab-pane label="訂單產品">
              <div class="pt-2 pb-4 max-w-[340px] lg:max-w-fit">
                <el-table size="small" stripe :data="state.productOptions">
                  <el-table-column
                    label="購買類型"
                    fixed="left"
                    prop="name"
                    width="120">
                    <template #default="{ row }">
                      <div class="flex items-center justify-between">
                        <p class="text-primary-500">
                          {{ row.name }}
                        </p>
                        <el-icon
                          v-show="row.isSelected"
                          color="#5971f7"
                          size="large"
                          ><SuccessFilled
                        /></el-icon>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="價格"
                    prop="amount"
                    width="60"
                    align="right">
                    <template #default="{ row }">
                      <p>
                        {{ Number(row.amount).toLocaleString() }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column label="送貨資訊">
                    <el-table-column
                      label="快遞公司"
                      prop="express_co"
                      width="100" />
                    <el-table-column
                      label="快遞單號"
                      prop="trackno"
                      width="100" />
                    <el-table-column
                      label="出貨日期"
                      prop="shipdate"
                      width="100" />
                  </el-table-column>
                  <el-table-column label="套裝組合">
                    <el-table-column
                      label="套裝名稱"
                      prop="packagesel"
                      width="100" />
                    <el-table-column label="套裝內容">
                      <el-table-column
                        v-for="packageItem in Object.keys(
                          state.productOptions[0].packages
                        )"
                        :key="packageItem"
                        :label="packageItem"
                        :prop="packageItem"
                        align="right"
                        width="70">
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="共同內容">
                      <el-table-column
                        v-for="(common_pd, i) in state.common_pd"
                        :key="i"
                        align="right"
                        width="70"
                        :label="common_pd"
                        :prop="common_pd" />
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    v-if="!state.isDisabled"
                    label="操作"
                    align="center"
                    width="100"
                    fixed="right">
                    <template #default="{ row }">
                      <button
                        v-show="!row.isSelected"
                        class="cursor-pointer hover:opacity-70 text-primary-500"
                        @click="
                          actions.handleAddSubProduct(
                            state.editProductModel.id,
                            state.editProductModel.mbid,
                            row
                          )
                        ">
                        加入訂單
                      </button>
                      <div v-show="row.isSelected">
                        <el-popover
                          placement="right"
                          width="300"
                          trigger="click"
                          :name="row.$index"
                          :ref="actions.handleGetRefPopover">
                          <template #reference>
                            <button
                              class="
                                cursor-pointer
                                hover:opacity-70
                                text-gray-500
                              "
                              @click="
                                () => {
                                  state.editShipModel = {
                                    trackno: row.trackno,
                                    express_co: row.express_co || 'UPS',
                                    shipdate: row.shipdate,
                                  }
                                }
                              ">
                              修改物流
                            </button>
                          </template>
                          <el-divider content-position="center">
                            <p>修改物流資料</p>
                          </el-divider>
                          <el-form
                            class="form"
                            label-position="top"
                            :model="state.editShipModel">
                            <el-form-item label="出貨日期" prop="shipdate">
                              <el-date-picker
                                v-model="state.editShipModel.shipdate"
                                type="date"
                                :teleported="false"
                                :clearable="
                                  !!state.editShipModel.shipdate ? false : true
                                "
                                placeholder="請選擇出貨日期"
                                value-format="YYYY-MM-DD"
                                style="width: 100%" />
                            </el-form-item>
                            <el-form-item label="快遞公司" prop="express_co">
                              <el-radio-group
                                v-model="state.editShipModel.express_co"
                                size="small">
                                <el-radio label="UPS">UPS</el-radio>
                                <el-radio label="FEDEX">FEDEX</el-radio>
                                <el-radio label="POST">POST</el-radio>
                              </el-radio-group>
                            </el-form-item>
                            <el-form-item label="快遞單號" prop="trackno">
                              <el-input
                                class="text"
                                v-model="state.editShipModel.trackno"
                                clearable
                                placeholder="請輸入 trackno" />
                            </el-form-item>
                            <el-button
                              type="primary"
                              class="w-full"
                              auto-insert-space
                              @click="
                                actions.handleEditSubProduct(
                                  state.editProductModel.id,
                                  row.sub_id
                                )
                              "
                              >修改物流</el-button
                            >
                          </el-form>
                        </el-popover>
                        /
                        <button
                          class="cursor-pointer hover:opacity-70 text-gray-500"
                          @click="
                            actions.handleDeleteSubProduct(
                              state.editProductModel.id,
                              row.sub_id
                            )
                          ">
                          取消
                        </button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="附件">
              <UploadFile
                v-model:list="state.editModelFiles"
                title="附件"
                :id="state.editProductModel.id"
                :disabled="state.isDisabled"
                @on-change="actions.handleFileUpdate"
            /></el-tab-pane>
          </el-tabs>
        </div>

        <el-dialog
          v-model="state.dialogVisible"
          :title="`新增 #${state.previewMbid} 子訂單商品`"
          center
          class="adjustDialog max-w-[500px]">
          <el-descriptions
            :column="1"
            size="small"
            border
            v-if="state.previewData">
            <el-descriptions-item
              width="150px"
              v-for="(item, i) in Object.entries(state.previewData)"
              :label="state.titleMap[item[0]]"
              :key="i">
              <div v-if="item[0] == 'pds'">
                <div
                  v-for="(pdItem, pdIndex) in Object.entries(
                    state.previewData.pds
                  )"
                  :key="pdIndex"
                  class="flex justify-between"
                  :class="{ 'bg-gray-50': pdIndex % 2 != 0 }">
                  <small class="min-w-fit text-center">
                    {{ pdItem[0] }}
                  </small>
                  <small>
                    {{ pdItem[1] }}
                  </small>
                </div>
              </div>
              <div v-else class="text-right">
                <p v-if="item[0] == 'type'">
                  {{ state.type2name[item[1]] }}
                </p>
                <p v-else>
                  {{ Number(item[1]).toLocaleString() }}
                </p>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <template #footer>
            <div class="flex justify-end px-2">
              <el-button
                bg
                text
                @click="state.dialogVisible = false"
                auto-insert-space
                >取消</el-button
              >
              <el-button
                type="primary"
                auto-insert-space
                @click="
                  actions.handleAddSubProduct(
                    state.confirmData.id,
                    state.confirmData.mbid,
                    state.confirmData.product,
                    state.confirmData.iscfm
                  )
                "
                >加入商品</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { PreOrderApiHandler } from '@/api/pre_order'
import { ReadJson } from '@/api/read_json'
import {
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  getCurrentInstance,
} from 'vue'
import { useVariables } from '@/hooks/useVariables'
import { pickBy, isEmpty } from 'lodash-es'
import { useStore } from 'vuex'
import SubTitle from '@/components/Title/SubTitle.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import UploadFile from '@/components/Upload/UploadFile.vue'
const { proxy } = getCurrentInstance()
const { variables } = useVariables()
const store = useStore()
const router = useRouter()
const route = useRoute()
const refForm = ref(null)
const state = reactive({
  loading: false,
  editProductModel: {},
  editModelFiles: [],
  isDisabled: false,
  sameAddr: false,
  zipCode: '',
  postcode: '',
  postcode2: '',
  zipCode2: '',
  productOptions: [],
  selectedSubList: [],
  common_pd: [],
  type2name: {},
  memberOptions: [],
  editShipModel: {
    express_co: 'UPS',
    shipdate: null,
    trackno: null,
  },
  previewData: {},
  previewMbid: '',
  confirmData: {},
  dialogVisible: false,
  titleMap: {
    type: '類型',
    amount: '價格',
    pv: 'PV',
    pds: '商品內容',
  },
  refPopover: {},
})

watch(
  () => state.editProductModel.add1,
  (add1, prevAdd1) => {
    const zipCode = add1?.split(' ')[0]
    const postcode = add1?.split(zipCode)[1]
    if (!isEmpty(zipCode) && !isEmpty(postcode)) {
      state.zipCode = zipCode
      actions.handleZipCode()
      state.postcode = postcode
    }
  }
)
watch(
  () => state.editProductModel.shipadd1,
  (shipadd1, prevShipadd1) => {
    const zipCode2 = shipadd1?.split(' ')[0]
    const postcode2 = shipadd1?.split(zipCode2)[1]
    if (!isEmpty(zipCode2) && !isEmpty(postcode2)) {
      state.zipCode2 = zipCode2
      actions.handleZipCode2()
      state.postcode2 = postcode2
    }
  }
)
onMounted(() => {
  const id = route.params.id
  if (!id) {
    router.go(-1)
  } else {
    actions.handleGetProducts()
    actions.handleFetchPreOrder()
  }
})
const hasAddress = computed(() => store.getters.hasAddress)
const hasAddress2 = computed(() => store.getters.hasAddress2)
const postcodeOptions = computed(() => store.getters.postcodeOptions)
const postcodeRecOptions = computed(() => store.getters.postcodeRecOptions)
const sameAddrHandler = computed({
  get: () => state.sameAddr,
  set(v) {
    if (v) {
      state.editProductModel.first_rcvname = state.editProductModel.first_name
      state.editProductModel.last_rcvname = state.editProductModel.last_name
      state.editProductModel.rcvphone = state.editProductModel.phone
      state.editProductModel.rcvemail = state.editProductModel.email
      state.editProductModel.shipadd = state.editProductModel.add
      state.editProductModel.shipadd1 = state.editProductModel.add1
      state.editProductModel.shipadd2 = state.editProductModel.add2
      state.zipCode2 = state.editProductModel.zipCode
    }
    state.sameAddr = v
  },
})
const selectedPostcode = computed({
  get: () => state.postcode,
  set(v) {
    state.postcode = v
    state.editProductModel.add1 = `${state.zipCode} ${state.postcode}`
  },
})
const selectedPostcodeRec = computed({
  get: () => state.postcode2,
  set(v) {
    state.postcode2 = v
    state.editProductModel.shipadd1 = `${state.zipCode2} ${state.postcode2}`
  },
})
const actions = {
  /**
   * @description 取得子訂單內容
   */
  handleFetchPreOrder: async (showLoading = true) => {
    const id = route.params.id
    const params = {
      action: 'listbyid',
      id: id,
    }
    state.loading = showLoading
    const { code, data, msg } = await PreOrderApiHandler(params)
    setTimeout(() => {
      state.loading = false
    }, 500)
    if (code > 0) {
      const { name = '', rcvname, smbid, umbid, rmbid, ...rest } = data
      const first_name = name?.split(' ')[0] || ''
      const last_name = name?.split(' ')[1] || ''
      const first_rcvname = rcvname?.split(' ')[0] || ''
      const last_rcvname = rcvname?.split(' ')[1] || ''
      const smbid_name = smbid?.split(' ')[0] || ''
      const smbid_phone = smbid?.split(' ')[1] || ''
      const umbid_name = umbid?.split(' ')[0] || ''
      const umbid_phone = umbid?.split(' ')[1] || ''
      const rmbid_name = rmbid?.split(' ')[0] || ''
      const rmbid_phone = rmbid?.split(' ')[1] || ''
      const format_rmbid = `${rmbid_name} ${rmbid_phone}`
      const format_umbid = `${umbid_name} ${umbid_phone}`
      const format_smbid = `${smbid_name} ${smbid_phone}`
      const has_rmbid = !isEmpty(rmbid_name) && !isEmpty(rmbid_phone)
      const has_umbid = !isEmpty(umbid_name) && !isEmpty(umbid_phone)
      const has_smbid = !isEmpty(smbid_name) && !isEmpty(smbid_phone)
      const formatPostType = !isEmpty(rmbid_phone) ? 'phone' : 'mbid'

      state.editProductModel = {
        first_name,
        last_name,
        first_rcvname,
        last_rcvname,
        smbid: has_smbid ? format_smbid : smbid,
        smbid_name: smbid_phone ? smbid_name : null,
        smbid_phone,
        umbid: has_umbid ? format_umbid : umbid,
        umbid_name: umbid_phone ? umbid_name : null,
        umbid_phone,
        rmbid: has_rmbid ? format_rmbid : rmbid,
        rmbid_name: rmbid_phone ? rmbid_name : null,
        rmbid_phone,
        posType: formatPostType,
        ...rest,
      }
      const is_cancelled = !!state.editProductModel?.date_cancelled
      const is_completed = !!state.editProductModel?.date_completed
      state.isDisabled = is_cancelled || is_completed
      actions.handleGetSubProducts(id)
      actions.handleGetFiles(id)
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  /**
   * @description 單選/取消選中
   */
  handleRadioClick: (label, val) => {
    if (state.isDisabled) return
    val === state.editProductModel[label]
      ? (state.editProductModel[label] = '')
      : (state.editProductModel[label] = val)
  },
  /**
   * @description 取得所有商品
   */
  handleGetProducts: async () => {
    const { code, data } = await ReadJson('salepkg')
    if (code === 1) {
      const { type2name, price, packagesel, packages, BBTcommon } = data
      state.type2name = type2name
      state.common_pd = Object.keys(BBTcommon)
      const filterType = Object.keys(type2name)
        .filter(name => name != 'salesingle')
        .reduce((res, key) => ((res[key] = type2name[key]), res), {})
      const getKeys = Object.keys(filterType)
      const products = getKeys.map(key => {
        const item = {
          type: key,
          name: type2name[key],
          packages: packages[packagesel[key]],
          packagesel: packagesel[key][0],
          amount: price[key],
          ...packages[packagesel[key]],
          ...BBTcommon,
        }
        return item
      })
      state.productOptions = products
    }
  },
  /**
   * @description 取得子訂單商品
   */
  handleGetSubProducts: async (id, hasProduct = true) => {
    const params = {
      action: 'list_child',
      preorderid: id,
    }
    state.selectedSubList = []
    if (hasProduct) {
      const { code, data, msg } = await PreOrderApiHandler(params)
      state.selectedSubList = data || []
    }
    actions.handleFormatSubProductList()
  },
  /**
   * @description 調整子訂單商品格式
   */
  handleFormatSubProductList: () => {
    const selectedTypes = state.selectedSubList.map(sub => sub.type)
    const data = state.productOptions.map(option => {
      const selected = state.selectedSubList.find(
        item => item.type == option.type
      )
      option.isSelected = selectedTypes.includes(option.type)
      option.sub_id = selected?.id
      option.express_co = selected?.express_co
      option.shipdate = selected?.shipdate
      option.trackno = selected?.trackno
      return option
    })
    state.productOptions = data
  },
  /**
   * @description 取得訂單附件
   */
  handleGetFiles: async id => {
    const params = {
      action: 'list_up_files',
      preorderid: id,
    }
    const { code, data } = await PreOrderApiHandler(params)
    if (code === 1) {
      const files = data.files
      state.editModelFiles = files.map(file => {
        const type = file[1].split('.')[1]
        const prefix = `${file[1].split('_')[0]}_${file[1].split('_')[1]}_`
        const original_name = file[1].split(prefix)[1]
        return {
          type: type,
          path: file[0],
          name: file[1],
          original_name: original_name,
        }
      })
      console.log(state.editModelFiles)
    }
  },
  /**
   * @description 上傳圖片
   */
  handleFileUpdate: list => {
    state.editModelFiles = list
  },
  /**
   * @description 編輯主訂單
   */
  handlePreOrderEdit: async () => {
    const {
      id,
      ordermbid,
      dateadd,
      ttlamt,
      name,
      first_name,
      last_name,
      rcvname,
      first_rcvname,
      last_rcvname,
      add,
      add1,
      add2,
      shipadd,
      shipadd1,
      shipadd2,
      rmbid,
      rmbid_name,
      rmbid_phone,
      umbid,
      umbid_name,
      umbid_phone,
      smbid,
      smbid_name,
      smbid_phone,
      posType,
      ...rest
    } = state.editProductModel
    const format_add = [add1, add2]
    const format_shipAdd = [shipadd1, shipadd2]
    const format_rmbid = `${rmbid_name} ${rmbid_phone}`
    const format_umbid = `${umbid_name} ${umbid_phone}`
    const format_smbid = `${smbid_name} ${smbid_phone}`
    const format_name = `${first_name} ${last_name}`
    const format_rcvname = `${first_rcvname} ${last_rcvname}`
    const has_name = !isEmpty(first_name) && !isEmpty(last_name)
    const has_rcvname = !isEmpty(first_rcvname) && !isEmpty(last_rcvname)
    const has_add = !isEmpty(add1) && !isEmpty(add2)
    const has_shipadd = !isEmpty(shipadd1) && !isEmpty(shipadd2)
    const has_rmbid = !isEmpty(rmbid_name) && !isEmpty(rmbid_phone)
    const has_umbid = !isEmpty(umbid_name) && !isEmpty(umbid_phone)
    const has_smbid = !isEmpty(smbid_name) && !isEmpty(smbid_phone)
    const params = {
      action: 'edit',
      preorderid: id,
      data: pickBy({
        name: has_name ? format_name : null,
        rcvname: has_rcvname ? format_rcvname : null,
        add: has_add ? format_add : null,
        shipadd: has_shipadd ? format_shipAdd : null,
        rmbid: has_rmbid ? format_rmbid : rmbid,
        umbid: has_umbid ? format_umbid : umbid,
        smbid: has_smbid ? format_smbid : smbid,
        ...rest,
      }),
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      state.editProductModel = {}
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description 加入子訂單商品
   */
  handleAddSubProduct: async (id, mbid, product, iscfm = 0) => {
    console.log(product)
    const params = {
      action: 'add_child',
      preorderid: id,
      orderdata: {
        type: product.type,
        pds: { [product.packagesel]: 1 },
        amount: product.amount,
      },
      iscfm: iscfm,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 2) {
      if (params.iscfm == 0) {
        state.previewMbid = mbid
        state.previewData = data
        state.dialogVisible = true
        state.confirmData = { id, mbid, product, iscfm: 1 }
        return
      }
    }
    if (code === 1) {
      if (params.iscfm == 1) {
        state.dialogVisible = false
        state.previewMbid = null
        state.previewData = null
        state.confirmData = {}
      }
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description 編輯子訂單商品
   */
  handleEditSubProduct: async (id, sub_id) => {
    console.log(state.refPopover)
    const params = {
      action: 'edit_child',
      preorderid: id,
      child_id: sub_id,
      shipdate: state.editShipModel.shipdate,
      express: [state.editShipModel.express_co, state.editShipModel.trackno],
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      state.editShipModel = {
        express_co: 'UPS',
        shipdate: null,
        trackno: null,
      }
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description 刪除子訂單商品
   */
  handleDeleteSubProduct: async (id, sub_id) => {
    const params = {
      action: 'del_child',
      preorderid: id,
      child_id: sub_id,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  handleZipCode: val => {
    if (val && val.toUpperCase() !== val) {
      state.zipCode = val.toUpperCase()
    } else {
      if (state.zipCode && state.zipCode.length >= 5) {
        store.dispatch('getFormattedAddress', state.zipCode)
      }
    }
  },
  handleZipCode2: val => {
    if (val && val.toUpperCase() !== val) {
      state.zipCode2 = val.toUpperCase()
    } else {
      if (state.zipCode2 && state.zipCode2.length >= 5) {
        store.dispatch('getFormattedAddress2', state.zipCode2)
      }
    }
  },
  handleGoBack: () => {
    if (window.history.state.back) {
      router.back()
    } else {
      router.replace({ path: '/preOrder' })
    }
  },
  handleGetRefPopover: el => {
    if ((el && el.$attrs['name'] >= 0) || (el && el.$attrs['name'])) {
      state.refPopover[el.$attrs['name']] = el
    }
  },
}
</script>

<style lang="scss">
.detail-page {
  .el-form {
    --el-disabled-text-color: #252525;
    .el-input.is-disabled .el-input__inner {
      cursor: default;
    }
  }
}
</style>