<template>
	<component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="ts" name="layout">
import { onBeforeMount, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '../stores/themeConfig';
import { Local } from '../utils/storage';
import mittBus from '../utils/mitt';
// 引入组件
import defaults from './main/defaults.vue';
import classic from './main/classic.vue';
import transverse from './main/transverse.vue';
import columns from './main/columns.vue';

const layouts: any = {
	defaults,
	classic,
	transverse,
	columns,
};

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
	if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) {
		themeConfig.value.isCollapse = false;
		mittBus.emit('layoutMobileResize', {
			layout: 'defaults',
			clientWidth,
		});
	} else {
		mittBus.emit('layoutMobileResize', {
			layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
			clientWidth,
		});
	}
};
// 页面加载前
onBeforeMount(() => {
	onLayoutResize();
	window.addEventListener('resize', onLayoutResize);
});
// 页面卸载时
onUnmounted(() => {
	window.removeEventListener('resize', onLayoutResize);
});
</script>
