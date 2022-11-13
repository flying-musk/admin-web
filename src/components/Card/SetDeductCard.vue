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
      <h3 class="flex-1">設定單筆扣補</h3>
      <el-icon>
        <ArrowUp v-show="state.isCollapse" />
        <ArrowDown v-show="!state.isCollapse" />
      </el-icon>
    </header>
    <div v-show="state.isCollapse">
      <el-form
        class="form p-3 mt-3"
        :model="state.model"
        :rules="state.rules"
        size="small"
        label-width="70"
        label-position="left"
        hide-required-asterisk
        scroll-to-error
        ref="refForm">
        <el-form-item label="會員編號" prop="mbid">
          <el-input
            class="text"
            v-model="state.model.mbid"
            prefix-icon="User"
            clearable
            placeholder="請輸入會員編號" />
        </el-form-item>
        <el-form-item label="修正類型" prop="dtype">
          <el-radio-group v-model="state.model.dtype" size="small">
            <el-radio :label="1">扣款</el-radio>
            <el-radio :label="2">補錢</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="扣捕金額" prop="amount">
          <el-input
            class="text"
            v-number
            v-model="state.model.amount"
            prefix-icon="Coin"
            clearable
            placeholder="請輸入扣捕金額" />
        </el-form-item>

        <el-form-item label="備註" prop="remark">
          <el-input
            v-model="state.model.remark"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="請輸入備註"
            resize="none"
            type="textarea" />
        </el-form-item>

        <el-button
          :loading="state.loading"
          size="default"
          type="primary"
          class="w-full"
          auto-insert-space
          @click="actions.handleSetDeduct">
          {{ btnText }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, h } from 'vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import { SetDeduct } from '@/api/sp_epadj'
import { ArrowDown } from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance()
const refForm = ref(null)
const emit = defineEmits(['on-refresh'])
const state = reactive({
  loading: false,
  isCollapse: true,
  model: {
    action: 'set_single',
    mbid: '',
    amount: null,
    remark: '',
    dtype: 1,
    iscfm: 0,
  },
  // model: {
  //   action: 'set_single',
  //   mbid: '108907',
  //   amount: 10003,
  //   remark:
  //     'qweqweiqopwiep iwopeiqopweiqopwei pipoqweiopqwiepqwie pqwei qpowe iqpowe iqpowie pqwioqpiepqwei oqpwei ',
  //   dtype: 1,
  //   iscfm: 0,
  // },
  rules: {
    mbid: [{ required: true, message: '', trigger: 'blur' }],
    amount: [{ required: true, message: '', trigger: 'blur' }],
    dtype: [{ required: true, message: '', trigger: 'blur' }],
    remark: [{ required: true, message: '', trigger: 'blur' }],
  },
})
const btnText = computed(() => (state.loading ? '確認中...' : '確認'))

const actions = {
  /**
   * @description 設定單筆扣補
   * @param {string}  action  set_single
   * @param {number}  mbid    會員編號
   * @param {number}  amount  金額
   * @param {string}  remark  備註
   * @param {number}  dtype   1(扣款) or 2(補錢)
   * @param {number}  iscfm   null(未確認) or 1(確認)
   */
  handleSetDeduct: (iscfm = 0) => {
    refForm.value.validate(async valid => {
      if (valid) {
        state.model.iscfm = iscfm
        state.loading = true
        const { code, data, msg } = await SetDeduct(state.model)
        if (code > 0) {
          if (iscfm === 1) {
            proxy.$message({
              dangerouslyUseHTMLString: true,
              type: 'success',
              message: msg,
            })
            refForm.value.resetFields()
            emit('on-refresh')
          } else {
            proxy
              .$messageBox({
                title: msg,
                message: h(
                  'div',
                  { class: 'space-y-2 tracking-wide text-gray-500 text-xs' },
                  [
                    h('p', { class: 'heigh-light text-md' }, data.mbinfo),
                    h(
                      'div',
                      {
                        class: 'flex justify-between gap-x-12',
                      },
                      [
                        h('p', { class: 'min-w-fit' }, null, '備註：'),
                        h('p', { class: 'font-light' }, data.remark),
                      ]
                    ),
                    h(
                      'div',
                      {
                        class:
                          'flex justify-between pt-1 border-t-2  border-dashed',
                      },
                      [
                        h('p', null, '目前餘額：'),
                        h(
                          'p',
                          null,
                          Number(data.bal).toLocaleString('zh-CN', {
                            minimumFractionDigits: 2,
                          })
                        ),
                      ]
                    ),
                    h('div', { class: 'flex justify-between pb-1 border-b' }, [
                      h(
                        'p',
                        null,
                        `${
                          data.dtype === 1 ? '要扣款的金額' : '要補錢的金額'
                        }：`
                      ),
                      h(
                        'p',
                        {
                          style: `color: ${
                            data.dtype === 1 ? 'tomato' : 'cadetblue'
                          }`,
                        },
                        Number(data.amount).toLocaleString('zh-CN', {
                          minimumFractionDigits: 2,
                        })
                      ),
                    ]),
                    h('div', { class: 'flex justify-between' }, [
                      h('p', null, '小計：'),
                      h(
                        'p',
                        null,
                        data.dtype === 1
                          ? (
                              Number(data.bal) - Number(data.amount)
                            ).toLocaleString('zh-CN', {
                              minimumFractionDigits: 2,
                            })
                          : (
                              Number(data.bal) + Number(data.amount)
                            ).toLocaleString('zh-CN', {
                              minimumFractionDigits: 2,
                            })
                      ),
                    ]),
                  ]
                ),
                showCancelButton: true,
              })
              .then(() => {
                actions.handleSetDeduct(1)
              })
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
}
</script>