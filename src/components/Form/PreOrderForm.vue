<template>
  <div class="mx-auto p-3">
    <el-form
      ref="refForm"
      :model="editData"
      :rules="state.rules"
      label-position="top"
      class="form hide-err-form"
      hide-required-asterisk
      status-icon
      size="small"
      scroll-to-error>
      <div>
        <div id="booking_info">
          <div
            class="
              text-gray-700 text-sm
              py-2
              tracking-wider
              flex
              gap-x-3
              items-center
            ">
            <div
              class="
                w-6
                h-6
                rounded-full
                bg-primary-500
                shadow shadow-primary-500/50
                flex
                justify-center
                items-center
                text-white
              ">
              1
            </div>
            <p>送單人資料 <small class="text-gray-500">(必填)</small></p>
          </div>

          <div class="ml-3 pl-[2em] border-l">
            <el-form-item class="px-1" label="會員編號" prop="mbid">
              <el-input
                class="text"
                v-model.trim="editData.mbid"
                prefix-icon="User"
                clearable />
            </el-form-item>
          </div>
        </div>

        <div id="pos_info">
          <div
            class="
              text-gray-700 text-sm
              py-2
              tracking-wider
              flex
              gap-x-3
              items-center
            ">
            <div
              class="
                w-6
                h-6
                rounded-full
                bg-primary-500
                shadow shadow-primary-500/50
                flex
                justify-center
                items-center
                text-white
              ">
              2
            </div>
            <div class="flex items-center gap-x-3">
              <p>點位資料 <small class="text-gray-500">(非必填)</small></p>
              <el-radio-group v-model="editData.posType">
                <el-radio label="mbid">會員編號</el-radio>
                <el-radio label="phone">非會員</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="ml-3 pl-[2em] border-l">
            <div v-if="editData.posType == 'mbid'">
              <el-form-item label="推薦人編號" prop="rmbid" class="w-full">
                <el-input v-model="editData.rmbid" />
              </el-form-item>

              <el-form-item label="安置人編號" prop="umbid" class="w-full">
                <el-input v-model="editData.umbid" />
              </el-form-item>

              <el-form-item label="培訓人編號" prop="smbid" class="w-full">
                <el-input v-model="editData.smbid" />
              </el-form-item>

              <el-form-item label="線號" prop="leg" class="w-full">
                <el-radio-group v-model="editData.leg" class="flex w-full">
                  <el-radio
                    class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                    v-for="leg in state.legOptions"
                    :key="leg.value"
                    :label="leg.value"
                    border
                    @click.prevent="actions.handleRadioClick('leg', leg.value)"
                    >{{ leg.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-else>
              <div class="flex flex-row gap-x-3">
                <el-form-item
                  label="推薦人名字"
                  prop="rmbid_name"
                  class="flex-1">
                  <el-input
                    class="text"
                    v-model="editData.rmbid_name"
                    clearable />
                </el-form-item>
                <el-form-item
                  label="推薦人電話"
                  prop="rmbid_phone"
                  class="flex-1">
                  <el-input
                    class="text"
                    v-model="editData.rmbid_phone"
                    clearable />
                </el-form-item>
              </div>

              <div class="flex flex-row gap-x-3">
                <el-form-item
                  label="安置人名字"
                  prop="umbid_name"
                  class="flex-1">
                  <el-input
                    class="text"
                    v-model="editData.umbid_name"
                    clearable />
                </el-form-item>
                <el-form-item
                  label="安置人電話"
                  prop="umbid_phone"
                  class="flex-1">
                  <el-input
                    class="text"
                    v-model="editData.umbid_phone"
                    clearable />
                </el-form-item>
              </div>

              <div class="flex flex-row gap-x-3">
                <el-form-item
                  label="培訓人名字"
                  prop="smbid_name"
                  class="flex-1">
                  <el-input
                    class="text"
                    v-model="editData.smbid_name"
                    clearable />
                </el-form-item>
                <el-form-item
                  label="培訓人電話"
                  prop="smbid_phone"
                  class="flex-1">
                  <el-input
                    class="text"
                    v-model="editData.smbid_phone"
                    clearable />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <div id="order_info">
          <div
            class="
              text-gray-700 text-sm
              py-2
              tracking-wider
              flex
              gap-x-3
              items-center
            ">
            <div
              class="
                w-6
                h-6
                rounded-full
                bg-primary-500
                shadow shadow-primary-500/50
                flex
                justify-center
                items-center
                text-white
              ">
              3
            </div>
            <p>訂購人資料 <small class="text-gray-500">(非必填)</small></p>
          </div>

          <div class="ml-3 pl-[2em] border-l">
            <div class="flex flex-row gap-x-3">
              <el-form-item label="訂購人名字" prop="first_name" class="flex-1">
                <el-input
                  class="text"
                  v-model="editData.first_name"
                  clearable
                  placeholder="請輸入訂購人名字" />
              </el-form-item>
              <el-form-item label="訂購人姓氏" prop="last_name" class="flex-1">
                <el-input
                  class="text"
                  v-model="editData.last_name"
                  clearable
                  placeholder="請輸入訂購人姓氏" />
              </el-form-item>
            </div>
            <el-form-item label="訂購人性別" prop="sex">
              <el-radio-group v-model="editData.sex" class="flex w-full">
                <el-radio
                  class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                  border
                  label="m"
                  @click.prevent="actions.handleRadioClick('sex', 'm')"
                  >男</el-radio
                >
                <el-radio
                  class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                  border
                  label="f"
                  @click.prevent="actions.handleRadioClick('sex', 'f')"
                  >女</el-radio
                >
              </el-radio-group>
            </el-form-item>

            <el-form-item label="訂購人所在國家" prop="ccode">
              <el-radio-group v-model="editData.ccode" class="flex w-full">
                <el-radio
                  class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                  v-for="(ccode, i) in Object.entries(variables.ccodename)"
                  :key="i"
                  :label="ccode[0]"
                  border
                  @click.prevent="actions.handleRadioClick('ccode', ccode[0])"
                  >{{ ccode[1] }}</el-radio
                >
              </el-radio-group>
            </el-form-item>

            <el-form-item class="px-1" label="訂購人電話" prop="phone">
              <el-input
                class="text"
                v-model.trim="editData.phone"
                prefix-icon="Phone"
                clearable
                @input="actions.handleGetRecord(editData.phone, false)" />
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
                  'border-primary-500': editData.mbid == member.mbid,
                }"
                @click="editData.mbid = member.mbid">
                <p>
                  {{ member.name }}
                </p>
                <small class="font-light">
                  {{ member.mbid }}
                </small>
              </div>
            </div>

            <el-form-item label="訂購人證照別" prop="idtype">
              <el-radio-group v-model="editData.idtype" class="flex w-full">
                <el-radio
                  class="min-w-full sm:min-w-[85px] my-1 lg:my-0"
                  v-for="(type, i) in Object.entries(variables.idtype)"
                  :key="i"
                  :label="type[0]"
                  border
                  @click.prevent="actions.handleRadioClick('idtype', type[0])"
                  >{{ type[1] }}</el-radio
                >
              </el-radio-group>
            </el-form-item>

            <el-form-item label="訂購人證號" prop="idnumber" v-if="!isEmpty(editData.idtype)">
              <el-input
                class="text"
                v-model="editData.idnumber"
                clearable
                :disabled="!editData.idtype" />
            </el-form-item>

            <el-form-item label="訂購人生日" prop="birth">
              <el-date-picker
                v-model="editData.birth"
                type="date"
                placeholder="ex.1990-01-03"
                value-format="YYYY-MM-DD"
                style="width: 100%" />
            </el-form-item>

            <el-form-item label="訂購人 E-mail" prop="rcvemail">
              <el-input
                v-model="editData.rcvemail"
                placeholder="ex.abc123456@gmail.com" />
            </el-form-item>
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
                v-model="editData.add2"
                autocomplete="off"
                placeholder="ex.xx弄xx巷xx號" />
            </el-form-item>
          </div>
        </div>

        <div id="rcv_info">
          <div
            class="
              text-gray-700 text-sm
              py-2
              tracking-wider
              flex
              gap-x-3
              items-center
            ">
            <div
              class="
                w-6
                h-6
                rounded-full
                bg-primary-500
                shadow shadow-primary-500/50
                flex
                justify-center
                items-center
                text-white
              ">
              4
            </div>
            <div class="flex items-center gap-x-3">
              <p>收貨人資料 <small class="text-gray-500">(非必填)</small></p>

              <el-checkbox v-model="sameAddrHandler"> 同訂購人</el-checkbox>
            </div>
          </div>

          <div class="ml-3 pl-[2em] border-l">
            <div class="flex flex-row gap-x-3">
              <el-form-item
                label="收貨人名字"
                prop="first_rcvname"
                class="flex-1">
                <el-input
                  class="text"
                  v-model="editData.first_rcvname"
                  clearable
                  placeholder="請輸入收貨人名字" />
              </el-form-item>
              <el-form-item
                label="收貨人姓氏"
                prop="last_rcvname"
                class="flex-1">
                <el-input
                  class="text"
                  v-model="editData.last_rcvname"
                  clearable
                  placeholder="請輸入收貨人姓氏" />
              </el-form-item>
            </div>
            <el-form-item class="px-1" label="收貨人電話" prop="rcvphone">
              <el-input
                class="text"
                v-model.trim="editData.rcvphone"
                prefix-icon="Phone"
                clearable />
            </el-form-item>

            <el-form-item label="收貨人 E-mail" prop="email">
              <el-input
                v-model="editData.email"
                placeholder="ex.abc123456@gmail.com" />
            </el-form-item>
            <div v-if="!sameAddrHandler">
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
                <el-select v-model="selectedPostcodeRec" class="w-full">
                  <el-option
                    v-for="(item, index) in postcodeRecOptions"
                    :key="item + index"
                    :label="item"
                    :value="item" />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="收貨人完整地址" prop="rcvadd2">
              <el-input
                v-model="editData.rcvadd2"
                autocomplete="off"
                placeholder="ex.xx弄xx巷xx號" />
            </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { PreOrderApiHandler } from '@/api/pre_order'
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useVariables } from '@/hooks/useVariables'
import { isEmpty } from 'lodash-es'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import { useStore } from 'vuex'

const store = useStore()
const { proxy } = getCurrentInstance()
const { variables } = useVariables()
const refForm = ref(null)
const props = defineProps({
  editData: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['on-refresh', 'update:editData'])
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
  postcode: '',
  postcode2: '',
  zipCode2: '',
  selectedPostcodeRec: '',
  sameAddr: '',
  posType: 'mbid',
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
      props.editData.add2 = ''
      props.editData.shipadd1 = ''
      props.editData.shipadd2 = ''
      state.zipCode2 = null
    }
    state.sameAddr = v
  },
})
const selectedPostcode = computed({
  get: () => state.postcode,
  set(v) {
    state.postcode = v
    props.editData.add1 = `${state.zipCode} ${state.postcode}`
  },
})
const selectedPostcodeRec = computed({
  get: () => state.postcode2,
  set(v) {
    state.postcode2 = v
    props.editData.add2 = `${state.zipCode2} ${state.postcode2}`
  },
})

const actions = {
  handleRadioClick: (label, val) => {
    val === props.editData[label]
      ? (props.editData[label] = '')
      : (props.editData[label] = val)
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
        const {
          action,
          mbid,
          order_mbid,
          first_name,
          last_name,
          first_rcvname,
          last_rcvname,
          ...rest
        } = state.model
        const params = {
          action,
          mbid,
          order_mbid,
          data: {
            name: `${first_name} ${last_name}`,
            rcvname: `${first_rcvname} ${last_rcvname}`,
            ...rest,
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
  handleGetRecord: async (phone, showMsg = true) => {
    if (phone?.length < 10) return
    const params = {
      action: 'getPreOrderNamebyPhone',
      phone: phone,
    }
    const { code, data, count = 0, msg = '' } = await PreOrderApiHandler(params)
    if (code > 0) {
      if (msg) {
        proxy.$message({
          type: 'success',
          message: msg,
        })
      }

      if (code == 1 && count == 0) {
        if (!showMsg) return
        proxy.$message({
          type: 'error',
          message: '非會員電話',
        })
        props.editData.phone = null
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
}
/**
 * @description 表單驗證
 */
 const handleValidForm = () => {
  return refForm.value.validate((valid) => {
    return valid
  })
}

defineExpose({ handleValidForm })

</script>
