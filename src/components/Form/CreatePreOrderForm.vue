<template>
  <div>
    <el-form
      class="form p-2 mt-2"
      :model="state.model"
      :rules="state.rules"
      label-width="70"
      label-position="top"
      size="small"
      hide-required-asterisk
      scroll-to-error
      ref="refForm">
      <p class="p-1 mb-2 border-b text-gray-500 font-light">送單人資料</p>
      <el-form-item class="px-1" label="會員編號" prop="mbid">
        <el-input
          class="text"
          v-model.trim="state.model.mbid"
          prefix-icon="User"
          clearable
          placeholder="請輸入送單人的會員編號" />
      </el-form-item>
      <p class="p-1 mb-2 border-b text-gray-500 font-light">訂購人資料</p>
      <div class="px-1">
        <div class="space-y-1">
          <el-radio-group v-model="state.member" size="small">
            <el-radio label="mbid">會員編號</el-radio>
            <el-radio label="phone">會員手機</el-radio>
          </el-radio-group>

          <el-form-item prop="order_mbid" v-show="state.member == 'mbid'">
            <el-input
              class="text w-full"
              v-model.trim="state.model.order_mbid"
              prefix-icon="User"
              clearable
              placeholder="請輸入訂購人會員編號" />
          </el-form-item>

          <el-form-item prop="phone" v-show="state.member == 'phone'">
            <el-input
              class="text"
              v-model.trim="state.model.phone"
              prefix-icon="Phone"
              clearable
              @input="actions.handleGetRecord(state.model.phone)"
              placeholder="請輸入訂購人會員手機" />
          </el-form-item>
          <div v-show="state.member == 'phone'">
            <div
              v-if="!isEmpty(state.memberOptions)"
              class="flex flex-col gap-y-1 py-2">
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
                    state.model.order_mbid == member.mbid,
                }"
                @click="
                  () => {
                    state.model.name = member.name
                    state.model.order_mbid = member.mbid
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

        <div class="flex justify-end py-3">
          <div
            class="
              inline-flex
              items-center
              gap-x-1
              cursor-pointer
              text-primary-500
              hover:opacity-70
            "
            @click="state.dialogVisible = true">
            <small> 訂購人非會員 </small>
            <el-icon :size="16"><QuestionFilled /></el-icon>
          </div>
        </div>
      </div>
      <el-button
        :loading="state.loading"
        size="small"
        type="primary"
        class="w-full"
        auto-insert-space
        @click="actions.handleSubmit">
        {{ btnText }}
      </el-button>
    </el-form>

    <el-dialog
      v-model="state.dialogVisible"
      :fullscreen="true"
      center
      class="previewDialog">
      <header class="bg-primary-500 pt-8 pb-4" id="pre-order-form">
        <h2 class="text-xl text-white text-center tracking-widest">
          新增預收訂單
        </h2>
      </header>
      <div class="lg:max-w-[50%] mx-auto mt-3 mb-8 p-3">
        <el-form
          :model="state.model"
          :rules="state.rules"
          label-width="100"
          label-position="top"
          class="form"
          hide-required-asterisk
          status-icon
          scroll-to-error>
          <div class="space-y-3 p-1">
            <div id="booking_info">
              <div
                class="
                  border-l-4
                  pl-3
                  border-primary-500
                  text-gray-700 text-md
                  mb-2
                  tracking-wider
                  font-medium
                ">
                <p>送單人資料 <small class="text-gray-500">(必填)</small></p>
              </div>

              <div class="pl-3">
                <el-form-item class="px-1" label="會員編號" prop="mbid">
                  <el-input
                    class="text"
                    v-model.trim="state.model.mbid"
                    prefix-icon="User"
                    clearable
                    placeholder="請輸入送單人的會員編號" />
                </el-form-item>
              </div>
            </div>

            <div id="order_info">
              <div
                class="
                  border-l-4
                  pl-3
                  border-primary-500
                  text-gray-700 text-md
                  mb-2
                  mt-8
                  tracking-wider
                  font-medium
                ">
                <p>訂購人資料 <small class="text-gray-500">(非必填)</small></p>
              </div>

              <div class="pl-4">
                <div class="flex flex-row gap-x-3">
                  <el-form-item label="訂購人姓名" prop="first_name">
                    <el-input
                      class="text w-full"
                      v-model="state.model.first_name"
                      clearable
                      placeholder="請輸入訂購人名字" />
                  </el-form-item>
                  <el-form-item label-width="0" prop="last_name" class="self-end">
                    <el-input
                      class="text w-full"
                      v-model="state.model.last_name"
                      clearable
                      placeholder="請輸入訂購人姓氏" />
                  </el-form-item>
                </div>
                <el-form-item label="訂購人性別" prop="sex">
                  <el-radio-group v-model="state.model.sex" class="flex w-full">
                    <el-radio
                      class="min-w-full sm:min-w-[55px] my-1 lg:my-0"
                      border
                      label="m"
                      @click.prevent="actions.handleRadioClick('m')"
                      >男</el-radio
                    >
                    <el-radio
                      class="min-w-full sm:min-w-[55px] my-1 lg:my-0"
                      border
                      label="f"
                      @click.prevent="actions.handleRadioClick('f')"
                      >女</el-radio
                    >
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="訂購人所在國家" prop="ccode">
                  <el-radio-group
                    v-model="state.model.ccode"
                    class="flex w-full">
                    <el-radio
                      class="min-w-full sm:min-w-[55px] my-1 lg:my-0"
                      v-for="(ccode, i) in Object.entries(variables.ccodename)"
                      :key="i"
                      :label="ccode[0]"
                      border
                      >{{ ccode[1] }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>

                <el-form-item class="px-1" label="訂購人電話" prop="phone">
                  <el-input
                    class="text"
                    v-model.trim="state.model.phone"
                    prefix-icon="Phone"
                    clearable
                    @input="actions.handleGetRecord(state.model.phone)"
                    placeholder="請輸入訂購人的電話" />
                </el-form-item>

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
                      'border-primary-500': state.model.mbid == member.mbid,
                    }"
                    @click="state.model.mbid = member.mbid">
                    <p>
                      {{ member.name }}
                    </p>
                    <small class="font-light">
                      {{ member.mbid }}
                    </small>
                  </div>
                </div>

                <el-form-item label="訂購人證照別" prop="idtype">
                  <el-radio-group
                    v-model="state.model.idtype"
                    class="flex w-full">
                    <el-radio
                      class="min-w-full sm:min-w-[55px] my-1 lg:my-0"
                      v-for="(type, i) in Object.entries(variables.idtype)"
                      :key="i"
                      :label="type[0]"
                      border
                      >{{ type[1] }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="訂購人證號" prop="idnumber">
                  <el-input
                    class="text"
                    v-model="state.model.idnumber"
                    clearable
                    :disabled="!state.model.idtype"
                    placeholder="請輸入訂購人證號" />
                </el-form-item>

                <el-form-item label="訂購人生日" prop="birth">
                  <el-date-picker
                    v-model="state.model.birth"
                    type="date"
                    placeholder="請選擇西元出生日期"
                    value-format="YYYY-MM-DD"
                    style="width: 100%" />
                </el-form-item>

                <el-form-item label="訂購人 E-mail" prop="email">
                  <el-input
                    v-model="state.model.email"
                    placeholder="請輸入 E-mail" />
                </el-form-item>
                <el-form-item :label="`address1`" prop="add1">
                  <el-input
                    v-model="state.model.add1"
                    type="textarea"
                    autosize
                    :placeholder="`address1`" />
                </el-form-item>
                <el-form-item :label="`zipcode`">
                  <el-input
                    v-model="state.zipCode"
                    autocomplete="off"
                    :placeholder="`zipcodePlaceholder`" />
                  <p v-show="hasAddress" class="error-code-text">
                    Error! No the code
                  </p>
                </el-form-item>
                <el-form-item v-if="postcodeOptions.length" :label="`address2`">
                  <el-select v-model="selectedPostcode">
                    <el-option
                      v-for="(item, index) in postcodeOptions"
                      :key="item + index"
                      :label="item"
                      :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="`address2`" prop="add2">
                  <el-input
                    v-model="state.model.add2"
                    autocomplete="off"
                    :disabled="true"
                    :placeholder="`address2`" />
                </el-form-item>
                <el-form-item label="訂購人地址" prop="add">
                  <el-input v-model="state.model.add" placeholder="地址" />
                </el-form-item>

                <div
                  class="flex w-full flex-col justify-evenly lg:flex-row gap-3">
                  <el-form-item label="推薦人編號" prop="rmbid" class="w-full">
                    <el-input
                      v-model="state.model.rmbid"
                      placeholder="請輸入編號或姓名加手機" />
                  </el-form-item>

                  <el-form-item label="安置人編號" prop="umbid" class="w-full">
                    <el-input
                      v-model="state.model.umbid"
                      placeholder="請輸入編號或姓名加手機" />
                  </el-form-item>

                  <el-form-item label="培訓人編號" prop="smbid" class="w-full">
                    <el-input
                      v-model="state.model.smbid"
                      placeholder="請輸入編號或姓名加手機" />
                  </el-form-item>
                </div>

                <el-form-item label="線號" prop="leg">
                  <el-radio-group v-model="state.model.leg" class="flex w-full">
                    <el-radio
                      class="min-w-full sm:min-w-[55px] my-1 lg:my-0"
                      v-for="leg in state.legOptions"
                      :key="leg.value"
                      :label="leg.value"
                      border
                      >{{ leg.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>

            <div id="rcv_info">
              <div
                class="
                  border-l-4
                  pl-3
                  border-primary-500
                  text-gray-700 text-md
                  mb-2
                  mt-8
                  tracking-wider
                  font-medium
                ">
                <p>收貨人資料 <small class="text-gray-500">(非必填)</small></p>
              </div>

              <div class="pl-3">
                <el-form-item class="px-1" label="收貨人姓名" prop="rcvname">
                  <el-input
                    class="text"
                    v-model.trim="state.model.rcvname"
                    prefix-icon="User"
                    clearable
                    placeholder="請輸入收貨人姓名" />
                </el-form-item>
                <el-form-item class="px-1" label="收貨人電話" prop="rcvphone">
                  <el-input
                    class="text"
                    v-model.trim="state.model.rcvphone"
                    prefix-icon="Phone"
                    clearable
                    placeholder="請輸入收貨人電話" />
                </el-form-item>

                <el-form-item label="收貨人 E-mail" prop="email">
                  <el-input
                    v-model="state.model.email"
                    placeholder="請輸入收貨人 E-mail" />
                </el-form-item>
                <el-form-item label="收貨人地址">
                  <el-checkbox v-model="sameAddrHandler">
                    同訂購人
                  </el-checkbox>
                </el-form-item>
                <div v-if="!sameAddrHandler">
                  <el-form-item label="收貨人地址" prop="shipadd1">
                    <el-input
                      v-model="state.model.shipadd1"
                      type="textarea"
                      autosize
                      placeholder="收貨人地址" />
                  </el-form-item>
                  <el-form-item label="zipcode">
                    <el-input
                      v-model="state.zipCode2"
                      autocomplete="off"
                      placeholder="zipcode" />
                    <p v-show="hasAddress2" class="error-code-text">
                      Error! No the code
                    </p>
                  </el-form-item>
                  <el-form-item
                    v-if="postcodeRecOptions.length"
                    :label="`address2`">
                    <el-select v-model="selectedPostcodeRec">
                      <el-option
                        v-for="(item, index) in postcodeRecOptions"
                        :key="item + index"
                        :label="item"
                        :value="item" />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="`address2`" prop="shipadd2">
                    <el-input
                      v-model="state.model.shipadd2"
                      autocomplete="off"
                      :disabled="true"
                      :placeholder="`address2`" />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <span
          class="
            dialog-footer
            flex
            justify-center
            fixed
            bottom-0
            right-0
            bg-white
            z-10
            w-full
            p-3
            border-t-2
            mt-3
          ">
          <div class="flex lg:w-[50%] justify-end px-3">
            <el-button @click="state.dialogVisible = false" bg text
              >下次再預訂</el-button
            >
            <el-button type="primary" @click="actions.handleSubmit">
              確認預訂
            </el-button>
          </div>
        </span>
      </template>
      <ScrollToTop @click.prevent="actions.handleScrollToTop" />
    </el-dialog>
  </div>
</template>
<script setup>
import { PreOrderApiHandler } from '@/api/pre_order'
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useVariables } from '@/hooks/useVariables'
import { isEmpty } from 'lodash-es'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import { useStore } from 'vuex'
import { stringifyStyle } from '@vue/shared'
const store = useStore()
const { proxy } = getCurrentInstance()
const { variables } = useVariables()
const refForm = ref(null)
const emit = defineEmits(['on-refresh'])
const state = reactive({
  loading: false,
  dialogVisible: false,
  idtypeOptions: variables?.idtype || [],
  memberOptions: [],
  legOptions: [
    {
      label: '左 1',
      value: '1',
    },
    {
      label: '右 2',
      value: '2',
    },
  ],
  model: {
    action: 'new',
    mbid: '',
    order_mbid: '',
    sex: null,
    phone: null,
    shipadd1: null,
    shipadd2: null,
  },
  rules: {
    mbid: [{ required: true, message: '', trigger: 'blur' }],
  },
  member: 'mbid',
  zipCode: '',
  zipCode2: '',
  sameAddr: '',
})
// const formattedAddress = computed(() => store.getters.formattedAddress)
// const formattedAddress2 = computed(() => store.getters.formattedAddress2)
const hasAddress = computed(() => store.getters.hasAddress)
const hasAddress2 = computed(() => store.getters.hasAddress2)
const postcodeOptions = computed(() => store.getters.postcodeOptions)
const postcodeRecOptions = computed(() => store.getters.postcodeRecOptions)
const btnText = computed(() => (state.loading ? '確認中...' : '確認'))
const sameAddrHandler = computed({
  get: () => state.sameAddr,
  set(v) {
    if (v) {
      state.model.first_rcvname = state.model.first_name
      state.model.last_rcvname = state.model.last_name
      state.model.rcvphone = state.model.phone
      state.model.rcvemail = state.model.email
      state.model.shipadd = state.model.add
      state.model.shipadd1 = state.model.add1
      state.model.shipadd2 = state.model.add2
      state.zipCode2 =  state.model.zipCode
    }
    state.sameAddr = v
  },
})

const actions = {
  handleRadioClick: val => {
    val === state.model.sex ? (state.model.sex = '') : (state.model.sex = val)
  },
  /**
   * @description 新增預收訂單
   * @param {string}  action  new
   * @param {number}  mbid    送單人會員編號
   * @param {number}  order_mbid  訂購人會員編號
   */
  handleSubmit: () => {
    refForm.value.validate(async valid => {
      if (valid) {
        state.loading = true
        const { action, mbid, order_mbid, first_name, last_name, ...rest } = state.model
        const params = {
          action,
          mbid,
          order_mbid,
          data: {
            name:`${first_name} ${last_name}`,
            ...rest
          },
        }
        const { code, data, msg } = await PreOrderApiHandler(params)
        if (code > 0) {
          proxy.$message({
            type: 'success',
            message: msg,
          })
          if (state.dialogVisible) {
            state.dialogVisible = false
          }
          refForm.value.resetFields()
          state.memberOptions = null
          state.model = null
          emit('on-refresh')
        } else {
          proxy.$message({
            type: 'error',
            message: msg,
          })
        }
        state.loading = false
      }
    })
  },
  /**
   * @description 查詢會員資料
   * @param {string}  action  getPreOrderNamebyPhone
   * @param {string}  label    會員編號
   * @param {number}  phone  會員手機號
   */
  handleGetRecord: async phone => {
    if (phone?.length < 10) return
    const params = {
      action: 'getPreOrderNamebyPhone',
      phone: phone,
    }
    const { code, data,count = 0, msg = '' } = await PreOrderApiHandler(params)
    if (code > 0) {
      if (msg) {
        proxy.$message({
          type: 'success',
          message: msg,
        })
      }

      if (code == 1 && count == 0) {
        console.log('dsd')
        proxy.$message({
          type: 'error',
          message: '非會員電話',
        })
        state.model.phone = null
        return
      }
      if (code == 2) {
        state.memberOptions = data
        return
      }
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  handleScrollToTop: () => {
    const anchor = document.querySelector('#pre-order-form')
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  },
}
</script>
