<script setup lang="tsx">
import { useDragDrop } from '@123fang-dnd/core'
import { auxiliaryLinePlugin } from '@123fang-dnd/plugin-auxiliary-line'
import { mouseFollowPlugin } from '@123fang-dnd/plugin-mouse-follow'
import { computed, ref } from 'vue'
import { IframeContainer } from '../../IframeContainer'

const iframeInstRef = ref()
const iframeElRef = ref()
const context = useDragDrop({
  frames: [
    computed(() => iframeInstRef.value?.$el),
    iframeElRef,
  ],
})

context.use(mouseFollowPlugin({
  canDraggable: event => !!event.target?.classList.contains('materiel-item') || !!event.target?.classList.contains('node'),
}))
context.use(auxiliaryLinePlugin({
  // showAuxiliaryLine: event => !!event.target?.classList.contains('node'),
  showAuxiliaryLine: 'node'
}))
</script>

<template>
  <div class="container">
    <div class="left-panel">
      <div class="materiel-item">
        物料1
      </div>
      <div class="materiel-item">
        物料2
      </div>
      <div class="materiel-item">
        物料3
      </div>
      <div class="materiel-item">
        物料4
      </div>
      <div class="materiel-item">
        物料5
      </div>
    </div>
    <div class="canvas-panel">
      <IframeContainer ref="iframeInstRef" :show-title="true">
        <div
          :style="{ display: 'flex', gap: '10px', padding: '8px', border: '1px solid #ccc', userSelect: 'none', marginTop: '18px' }"
          class="node">
          <span :style="{ color: 'red', border: '1px solid #ccc' }" class="node">node1</span>
          <div :style="{ display: 'flex', gap: '30px', color: 'skyblue', padding: '8px', border: '1px solid #ccc' }"
            class="node">
            <span :style="{ color: 'blue', border: '1px solid #ccc' }" class="node">node3-1</span>
            <span :style="{ color: 'pink', border: '1px solid #ccc', padding: '12px' }" class="node"> <span>node3-2</span> </span>
          </div>
        </div>
        <div
          :style="{ display: 'flex', gap: '30px', padding: '8px', border: '1px solid #ccc', userSelect: 'none', marginTop: '18px' }"
          class="node">
          <span :style="{ color: 'red', border: '1px solid #ccc' }" class="node">node1</span>
          <span :style="{ color: 'pink', border: '1px solid #ccc' }" class="node">node2</span>
          <span :style="{ color: 'skyblue', border: '1px solid #ccc' }" class="node">node3</span>
        </div>
        <div
          :style="{ display: 'flex', gap: '10px', padding: '8px', border: '1px solid #ccc', userSelect: 'none', marginTop: '18px' }"
          class="node">
          <div :style="{ display: 'flex', gap: '20px', color: 'skyblue', padding: '8px', border: '1px solid #ccc' }"
            class="node">
            <div :style="{ display: 'flex', gap: '30px', color: 'skyblue', padding: '8px', border: '1px solid #ccc' }"
              class="node">
              <span :style="{ color: 'pink', border: '1px solid #ccc' }" class="node">node1</span>
              <span :style="{ color: 'pink', border: '1px solid #ccc' }" class="node">node2</span>
            </div>
          </div>
          <div :style="{ display: 'flex', gap: '20px', color: 'skyblue', padding: '8px', border: '1px solid #ccc' }"
            class="node">
            <div :style="{ display: 'flex', gap: '30px', color: 'skyblue', padding: '8px', border: '1px solid #ccc' }"
              class="node">
              <span :style="{ color: 'yellow', border: '1px solid #ccc' }" class="node">node1</span>
              <span :style="{ color: 'blue', border: '1px solid #ccc' }" class="node">node2</span>
            </div>
          </div>
        </div>
      </IframeContainer>
      <!-- <iframe ref="iframeElRef" src="./frame.html" /> -->
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  margin: 100px 0 0 0;
  padding: 20px;
}

.left-panel {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  gap: 10px;
  height: 200px;
  user-select: none;
}

.materiel-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border: 1px solid #ccc;
}

.node {
  display: inline-block;
  line-height: 100%;
}
</style>
