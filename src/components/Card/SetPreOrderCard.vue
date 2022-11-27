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
      <h3 class="flex-1">新增預收訂單</h3>
      <el-icon>
        <ArrowUp v-show="state.isCollapse" />
        <ArrowDown v-show="!state.isCollapse" />
      </el-icon>
    </header>
    <div v-show="state.isCollapse">
      <CreatePreOrderForm />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, h } from 'vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import CreatePreOrderForm from '@/components/Form/CreatePreOrderForm.vue'
import { SetDeduct } from '@/api/sp_epadj'
import { ArrowDown } from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance()
const refForm = ref(null)
const emit = defineEmits(['on-refresh'])
const state = reactive({
  loading: false,
  isCollapse: true,
  model: {
    action: 'new',
    mbid: '',
    order_mbid: null,
    data: {},
  },
  rules: {
    mbid: [{ required: true, message: '', trigger: 'blur' }],
    amount: [{ required: true, message: '', trigger: 'blur' }],
    isMember: [{ required: true, message: '', trigger: 'blur' }],
    remark: [{ required: true, message: '', trigger: 'blur' }],
  },
})
const btnText = computed(() => (state.loading ? '確認中...' : '確認'))

const actions = {
  /**
   * @description 新增預收訂單
   * @param {string}  action  set_single
   * @param {number}  mbid    會員編號
   * @param {number}  amount  金額
   * @param {string}  remark  備註
   * @param {number}  isMember   1(扣款) or 2(補錢)
   * @param {number}  iscfm   null(未確認) or 1(確認)
   */
  handleSubmit: (iscfm = 0) => {
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
                          data.isMember === 1 ? '要扣款的金額' : '要補錢的金額'
                        }：`
                      ),
                      h(
                        'p',
                        {
                          style: `color: ${
                            data.isMember === 1 ? 'tomato' : 'cadetblue'
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
                        data.isMember === 1
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
                actions.handleSubmit(1)
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