<template>
  <div
    class="lg:border bg-white rounded shadow"
    v-for="product in selected"
    :key="product.id">
    <div class="grid grid-cols-1" >
      <div class="flex gap-y-2 border-b items-center pr-2 py-1">
        <div
          class="
            tracking-widest
            text-primary-700
            flex
            text-md
            items-center
            gap-x-1
            w-full
          ">
          <small
            class="bg-primary-500 text-white rounded-r-full py-[0.5px] px-2"
            >{{ type2name[product?.type] }}</small
          >
        </div>
        <small class="min-w-fit text-gray-400">{{ product?.entry }}</small>
      </div>
      <div class="flex flex-col col-span-3">
        <div class="flex flex-col space-y-1 p-1 px-2 text-gray-600">
          <div class="flex flex-row text-sm">
            <p
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
              ">
              <span>商品品項</span>
              <span class="text-gray-400">{{ product?.package }}</span>
            </p>
          </div>

          <div class="flex flex-row text-sm">
            <p
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
              ">
              <span>出貨日期</span>
              <span class="text-gray-400">{{ product?.shipdate }}</span>
            </p>
          </div>
          <div class="flex flex-row text-sm">
            <p
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
              ">
              <span>快遞單號</span>
              <span class="text-gray-400">
                <el-tag
                  effect="plain"
                  round
                  size="small"
                  class="mr-2"
                  v-show="!!product?.express_co">
                  <p class="tracking-wides">
                    {{ product?.express_co }}
                  </p> </el-tag
                >{{ product?.trackno }}</span
              >
            </p>
          </div>

          <div class="flex flex-row text-sm">
            <p
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
              ">
              <span>PV</span>
              <span
                :class="
                  Number(product?.pv) > 0 ? 'text-primary-500' : 'text-gray-400'
                "
                >{{ Number(product?.pv || 0).toLocaleString('zh-CN') }}</span
              >
            </p>
          </div>
          <div class="flex flex-row text-sm">
            <p
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
              ">
              <span>金額</span>
              <span
                :class="
                  Number(product?.amount) > 0
                    ? 'text-primary-500'
                    : 'text-gray-400'
                "
                >{{
                  Number(product?.amount || 0).toLocaleString('zh-CN')
                }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selected: {
    type: Object,
    default: () => {},
  },
  type2name: {
    type: Object,
    default: () => {},
  },
})
</script>