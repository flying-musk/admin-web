<template>
  <div>
    <el-button
      type="primary"
      auto-insert-space
      @click="actions.handleDialog(true)">
      新增
    </el-button>
    <el-dialog
      v-model="state.dialogVisible"
      align-center
      class="create-dialog"
      :fullscreen="formatDialogWidth == '100%'"
      :width="formatDialogWidth"
      :close-on-click-modal="false"
      @close="actions.handleCloseDialog">
      <header
        class="
          pl-3
          pr-2
          py-2
          border-b
          flex
          justify-between
          items-center
          bg-primary-500
          text-gray-50
        ">
        <h5 class="text-sm tracking-widest font-base">新增預收單</h5>

        <el-button link circle @click="state.dialogVisible = false">
          <el-icon color="#fff"><CloseBold /></el-icon>
        </el-button>
      </header>
      <div class="step-section p-3">
        <el-steps
          :active="state.activeStep"
          finish-status="success"
          align-center>
          <el-step title="送單人" />
          <el-step title="訂購人" />
          <el-step title="訂購商品" />
          <el-step title="收款資料" />
          <el-step title="確認資料" />
        </el-steps>
      </div>
      <div
        class="p-3"
        :class="{ 'h-[460px] overflow-y-scroll': state.activeStep != 4 }">
        <!-- 送單人編號 -->
        <div v-if="state.activeStep == 0">
          <div
            class="
              flex
              items-center
              gap-x-2
              tracking-widest
              leading-10
              text-md
              px-1
              mb-3
              bg-primary-50 bg-opacity-10
              rounded
              text-gray-500
            ">
            <div
              class="
                flex
                justify-center
                items-center
                tracking-wider
                text-primary-500
              ">
              <el-icon :size="20"><InfoFilled /></el-icon>
            </div>
            <p>請輸入送單人編號</p>
          </div>
          <el-input
            v-model="state.mbid"
            prefix-icon="User"
            clearable
            placeholder="請輸入送單人編號"></el-input>
        </div>

        <!-- 訂購人 -->
        <div v-if="state.activeStep == 1">
          <div
            class="
              flex
              items-center
              gap-x-2
              tracking-widest
              leading-10
              text-md
              px-1
              mb-3
              bg-primary-50 bg-opacity-10
              rounded
              text-gray-500
            ">
            <div
              class="
                flex
                justify-center
                items-center
                tracking-wider
                text-primary-500
              ">
              <el-icon :size="20"><InfoFilled /></el-icon>
            </div>
            <p>請輸入訂購人手機查詢會員資料</p>
          </div>
          <el-input
            v-model="state.mb_phone"
            prefix-icon="User"
            clearable
            placeholder="請輸入訂購人手機"></el-input>

          <el-button class="w-full my-3" type="primary" @click="actions.handleSearchMember">查詢</el-button>
          <div
              v-if="!isEmpty(state.memberOptions)"
              class="flex flex-col gap-y-1 py-2">
              <div class="border flex justify-between px-3 rounded shadow bg-gray-50 p-1" v-if="state.memberOptions.length == 1">
                <div>
                  <p> 訂購人：</p>
                <p class="text-primary-500">
                  {{state.memberOptions[0]}}
                </p>
                </div>
              <RadioItem :selected="true" />
              </div>
              <div v-else>
                <div
                v-for="member in state.memberOptions"
                :key="member.name"
                class="
                  border
                  rounded
                  flex flex-col
                  p-1
                  gap-y-1
                  cursor-pointer
                  tracking-wider
                  hover:border-primary-500
                "
                :class="{
                  'border-primary-500 bg-primary-100 text-white  hover:bg-opacity-90':
                    state.data.order_mbid == member.mbid,
                }"
                @click="
                  () => {
                    state.data.name = member.name
                    state.data.order_mbid = member.mbid
                  }
                ">
                <p>
                  {{ member.name }}
                </p>
                <small class="font-light">
                  {{ member.mbid }}
                </small>
              </div>
              </div>

            </div>
       
        </div>

        <!-- 訂購商品 -->
        <div v-if="state.activeStep == 2">
          <div
            class="
              flex
              items-center
              gap-x-2
              tracking-widest
              leading-10
              text-md
              px-1
              mb-3
              bg-primary-50 bg-opacity-10
              rounded
              text-gray-500
            ">
            <div class="flex justify-center items-center tracking-wider">
              <el-icon :size="20"><InfoFilled /></el-icon>
            </div>
            <p>請勾選要訂購商品（至少選ㄧ個）</p>
          </div>
          <div class="grid grid-cols-1 gap-2">
            <PreOrderProductCard
              :visible="state.dialogVisible"
              v-for="product in state.productOptions"
              :key="product.name"
              :pre-order-id="state.data.pre_order_id"
              :product="product"
              :common-pd="state.common_pd"
              :list-child="state.listChild"
              @fetch-cart="actions.handleFetchCart" />
          </div>
        </div>

        <!-- 物流資料 -->
        <div v-if="state.activeStep == 3">
          <div
            class="
              flex
              items-center
              gap-x-2
              tracking-widest
              leading-10
              text-md
              px-1
              mb-3
              bg-primary-50 bg-opacity-10
              rounded
              text-gray-500
            ">
            <div class="flex justify-center items-center tracking-wider">
              <el-icon :size="20"><InfoFilled /></el-icon>
            </div>
            <p>請修改物流資料（非必填）</p>
          </div>
          <PreOrderShipCard
            v-for="product in state.listChild"
            :key="product.type"
            :pre-order-id="product.ref_id"
            :product="product"
            :format-type="state.type2name"
            @fetch-cart="actions.handleFetchCart" />
        </div>

        <!-- 收款資料 -->
        <div v-if="state.activeStep == 3">
          <div
            class="
              flex
              items-center
              gap-x-2
              tracking-widest
              leading-10
              text-md
              px-1
              mb-3
              bg-primary-50 bg-opacity-10
              rounded
              text-gray-500
            ">
            <div class="flex justify-center items-center tracking-wider">
              <el-icon :size="20"><InfoFilled /></el-icon>
            </div>
            <p>請填寫收款資料（非必填）</p>
          </div>
          <PreOrderPaymentCard
            ref="paymentCard"
            :pre-order-id="state.data.pre_order_id"
            :format-type="state.type2name"
            :list-child="state.listChild"
            @fetch-cart="actions.handleFetchCart" />
        </div>
      </div>

      <!-- 完成資料 -->
      <div v-if="state.activeStep == 4">
        <div
          class="
            flex flex-col
            gap-y-2
            my-3
            w-full
            mx-auto
            justify-center
            max-w-[200px]
            text-center
            tracking-wider
            text-gray-500
          ">
          <iframe src="https://embed.lottiefiles.com/animation/96237"></iframe>
          <h5 class="leading-6 text-lg font-extrabold">完成資料</h5>
          <small class="leading-5 text-sm text-thin">已新增預收單</small>
          <el-button type="primary" @click="actions.handlePushDetail"
            >查看詳情</el-button
          >
        </div>
        <!-- <el-result icon="success" title="完成資料" sub-title="已新增預收單">
          <template #extra>
            <el-button type="primary" @click="actions.handlePushDetail"
              >查看詳情</el-button
            >
          </template>
        </el-result> -->
      </div>

      <template #footer>
        <div class="flex justify-end px-2 pt-2" v-show="state.activeStep != 4">
          <el-button bg text @click="state.dialogVisible = false">{{
            state.activeStep == 0 ? '下次再預訂' : '關閉'
          }}</el-button>
          <!-- 送單人 -->
          <el-button
            v-show="state.activeStep == 0"
            type="primary"
            @click="actions.handleCreate">
            新增預收訂單
          </el-button>
          <!-- 訂購人 -->
          <el-button
            v-show="state.activeStep == 1"
            type="primary"
            :disabled="!state.mbid"
            @click="state.activeStep += 1">
            下一步
          </el-button>
          <!-- 訂購商品 -->
          <el-button
            v-show="state.activeStep == 2"
            type="primary"
            :disabled="state.listChild.length <= 0"
            @click="state.activeStep += 1">
            下一步
          </el-button>
          <!-- 物流資料 -->
          <el-button
            v-show="state.activeStep == 3"
            type="primary"
            @click="state.activeStep += 1">
            下一步
          </el-button>
          <!-- 收款資料 -->
          <el-button
            v-show="state.activeStep == 3"
            type="primary"
            @click="actions.handlePayment">
            確認收款資料
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import PreOrderProductCard from '@/components/Card/PreOrderProductCard.vue'
import PreOrderPaymentCard from '@/components/Card/PreOrderPaymentCard.vue'
import PreOrderShipCard from '@/components/Card/PreOrderShipCard.vue'
import SelectPos from '@/components/Select/SelectPos.vue'
import RadioItem from '@/components/Radio/RadioItem.vue'
import { ReadJson } from '@/api/read_json'
import { PreOrderApiHandler } from '@/api/pre_order'
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { pickBy, isEmpty } from 'lodash-es'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()
const store = useStore()
const paymentCard = ref(null)
const state = reactive({
  dialogVisible: false,
  mbid: null,
  mb_phone:null,
  memberOptions:[],
  selectedType: 'history',
  activeStep: 0,
  productOptions: [],
  type2name: [],
  common_pd: [],
  listChild: [],
  data: {
    pre_order_id: null,
    add: null,
    birth: null,
    ccode: null,
    dateadd: null,
    email: null,
    idnumber: null,
    idtype: null,
    leg: null,
    mbid: null,
    mbname: null,
    name: null,
    order_mbid: null,
    paydetail: null,
    payrcvdate: null,
    paystatus: null,
    phone: null,
    rcvemail: null,
    rcvname: null,
    rcvphone: null,
    remark: null,
    rmbid: null,
    sex: null,
    shipadd: null,
    smbid: null,
    umbid: null,
  },
})
const formatDialogWidth = computed(() => {
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  return width < 768 ? '100%' : '600px'
})

const actions = {
  /**
   * @description  開啟/關閉 新增預收單彈窗
   */
  handleDialog: (dialogVisible = false) => {
    state.dialogVisible = dialogVisible
  },
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
   * @description  新增
   */
  handleCreate: async () => {
    const mbid = state.mbid
    if (!mbid) {
      proxy.$message({
        type: 'error',
        message: '請輸入送單人編號！',
      })
      return
    }
    const params = {
      action: 'new',
      mbid,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      state.activeStep += 1
      state.data = data
      actions.handleGetProducts()
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  /**
   * @description  編輯
   */
  handleEdit: async editData => {
    const preorderid = state.data.pre_order_id
    const params = {
      action: 'edit',
      preorderid,
      data: pickBy(editData),
    }
    const { code, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      state.activeStep += 1
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  /**
   * @description  取得訂單內商品
   */
  handleFetchCart: async () => {
    const params = {
      action: 'list_child',
      preorderid: state.data.pre_order_id,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      state.listChild = data
    } else {
      state.listChild = []
      if (msg.includes('not sub orders')) return
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  /**
   * @description  提交收款資料
   */
  handlePayment: () => {
    console.log(paymentCard.value.model)
    const formatData = pickBy(paymentCard.value.model)
    console.log(formatData)

    if (isEmpty(formatData)) {
      state.activeStep += 1
      return
    }
    actions.handleEdit(formatData)
  },
  handleCloseDialog: () => {
    state.activeStep = 0
    state.listChild = []
    state.mbid = null
    state.mb_phone = null
    state.data = {
    pre_order_id: null,
    add: null,
    birth: null,
    ccode: null,
    dateadd: null,
    email: null,
    idnumber: null,
    idtype: null,
    leg: null,
    mbid: null,
    mbname: null,
    name: null,
    order_mbid: null,
    paydetail: null,
    payrcvdate: null,
    paystatus: null,
    phone: null,
    rcvemail: null,
    rcvname: null,
    rcvphone: null,
    remark: null,
    rmbid: null,
    sex: null,
    shipadd: null,
    smbid: null,
    umbid: null,
  }
  },

  handlePushDetail: () => {
    const id = state.data.pre_order_id
    state.dialogVisible = false
    setTimeout(() => {
      router.push({ path: `/preOrder/${id}` })
    }, 300)
  },
    /**
   * @description 查詢會員資料
   * @param {string}  action  getPreOrderNamebyPhone
   * @param {string}  label    會員編號
   * @param {number}  phone  會員手機號
   */
  handleSearchMember: async () => {
    const params = {
      action: 'getPreOrderNamebyPhone',
      phone: state.mb_phone,
    }
    const { code, data = [], msg = '' } = await PreOrderApiHandler(params)
    if (code > 0) {
      if (msg) {
        proxy.$message({
          type: 'success',
          message: msg,
        })
      }

      if (code == 1 && data.length == 0) {
        proxy.$message({
          type: 'error',
          message: '非會員電話',
        })
        state.mb_phone = null
        return
      }
      if (code >= 1) {
        state.memberOptions = data
        if(state.memberOptions == 1){
          state.data.mbid = mb_phone
        }
        return
      }
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
}
</script>

<style lang="scss">
.step-section {
  .el-step__title {
    font-size: 12px;
  }
  :deep(.el-step__icon) {
    width: 50px;
    height: 50px;
  }
}
</style>