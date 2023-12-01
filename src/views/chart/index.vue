<template>
	<div class="chart-scrollbar layout-padding">
		<div class="chart-warp layout-padding-auto layout-padding-view">
			<div class="chart-warp-top">
				<ChartHead />
			</div>
			<div class="chart-warp-bottom">
				<!-- 左边 -->
				<div class="big-data-down-left">
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">本月渠道工单数</div>
							<div class="flex-content">
								<div class="sky-dd">
									<div class="sky-dl" v-for="(v, k) in state.skyList" :key="k" :class="{ 'sky-dl-first': k === 1 }">
										<div>{{ v.v1 }}</div>
										<div>{{ v.v2 }}</div>
										<div>{{ v.v3 }}</div>
										<div class="tip">{{ v.v5 }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">用户交易偏好</div>
							<div class="flex-content flex-content-overflow">
								<div class="d-states">
									<div class="d-states-item">
										<SvgIcon name="ele-Odometer" class="i-bg1" />
										<div class="d-states-flex">
											<div class="d-states-item-label">零食</div>
											<div class="d-states-item-value">99</div>
										</div>
									</div>
									<div class="d-states-item">
										<SvgIcon name="ele-FirstAidKit" class="i-bg2" />
										<div class="d-states-flex">
											<div class="d-states-item-label">干货</div>
											<div class="d-states-item-value">10</div>
										</div>
									</div>
									<div class="d-states-item">
										<SvgIcon name="ele-VideoPlay" class="i-bg1" />
										<div class="d-states-flex">
											<div class="d-states-item-label">酒水</div>
											<div class="d-states-item-value">20</div>
										</div>
									</div>
									<div class="d-states-item">
										<SvgIcon name="ele-VideoPlay" class="i-bg2" />
										<div class="d-states-flex">
											<div class="d-states-item-label">家居</div>
											<div class="d-states-item-value">10</div>
										</div>
									</div>
									<div class="d-states-item">
										<SvgIcon name="ele-FirstAidKit" class="i-bg3" />
										<div class="d-states-flex">
											<div class="d-states-item-label">肉类</div>
											<div class="d-states-item-value">40</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">热门店铺</div>
							<div class="flex-content">
								<div style="height: 100%" ref="chartsWarningRef"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- 中间 -->
				<div class="big-data-down-center">
					<div class="big-data-down-center-one">
						<div class="big-data-down-center-one-content">
							<div style="height: 100%" ref="chartsCenterOneRef"></div>
						</div>
					</div>
					<div class="big-data-down-center-two">
						<div class="flex-warp-item-box">
							<div class="flex-title">
								<span>活跃用户数</span>
								<span class="flex-title-small">最近7天</span>
							</div>
							<div class="flex-content">
								<div></div>
								<div class="flex-content-right">
									<div style="height: 100%" ref="chartsMonitorRef"></div>
								</div>
								<div></div>
							</div>
						</div>
					</div>
				</div>

				<!-- 右边 -->
				<div class="big-data-down-right">
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">
								<span>销售额与新增会员趋势</span>
							</div>
							<div class="flex-content">
								<div style="height: 100%" ref="chartsSevenDaysRef"></div>
							</div>
						</div>
					</div>
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">本月目标完成进度</div>
							<div class="flex-content">
								<div class="progress">
									<div class="progress-item">
										<span>本月已过时间</span>
										<div class="progress-box">
											<el-progress :percentage="61" color="#43bdf0"></el-progress>
										</div>
									</div>
									<div class="progress-item">
										<span>销售目标进度</span>
										<div class="progress-box">
											<el-progress :percentage="78" color="#43bdf0"></el-progress>
										</div>
									</div>
									<div class="progress-item">
										<span>订单目标进度</span>
										<div class="progress-box">
											<el-progress :percentage="100" color="#5CB300"></el-progress>
										</div>
									</div>
									<div class="progress-item">
										<span>粉丝目标进度</span>
										<div class="progress-box">
											<el-progress :percentage="54" color="#F23030"></el-progress>
										</div>
									</div>
									<div class="progress-item">
										<span>会员目标进度</span>
										<div class="progress-box">
											<el-progress :percentage="151" color="#5CB300"></el-progress>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">
								<span>交易金额分布</span>
							</div>
							<div class="flex-content">
								<div style="height: 100%" ref="chartsInvestmentRef"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="chartIndex">
import { defineAsyncComponent, reactive, onMounted, watch, nextTick, onActivated, ref } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { skyList, dBtnList, chartData4List } from '/@/views/chart/chart';

// 引入组件
const ChartHead = defineAsyncComponent(() => import('/@/views/chart/head.vue'));

// 定义变量内容
const chartsCenterOneRef = ref();
const chartsSevenDaysRef = ref();
const chartsWarningRef = ref();
const chartsMonitorRef = ref();
const chartsInvestmentRef = ref();
const storesTagsViewRoutes = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive({
	skyList,
	dBtnList,
	chartData4List,
	myCharts: [] as EmptyArrayType,
});

// 初始化中间图表1
const initChartsCenterOne = () => {
	const myChart = echarts.init(chartsCenterOneRef.value);
	const option = {
		grid: {
			top: 15,
			right: 15,
			bottom: 20,
			left: 30,
		},
		tooltip: {},
		series: [
			{
				type: 'wordCloud',
				sizeRange: [12, 40],
				rotationRange: [0, 0],
				rotationStep: 45,
				gridSize: Math.random() * 20 + 5,
				shape: 'roundRect',
				width: '100%',
				height: '100%',
				textStyle: {
					fontFamily: 'sans-serif',
					fontWeight: 'bold',
					color: function () {
						return `rgb(${[Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',')})`;
					},
				},
				data: [
					{ name: 'Mate 50 Pro', value: 520 },
					{ name: 'Mate 50 RS', value: 520 },
					{ name: 'Mate X3', value: 500 },
					{ name: 'Mate 60 Pro', value: 420 },
					{ name: 'Mate 60', value: 520 },
					{ name: 'HUAWEI P60 Art', value: 2.64 },
					{ name: '华为P60 Pro', value: 4.03 },
					{ name: 'P50E', value: 24.95 },
					{ name: '华为畅享系列', value: 260 },
					{ name: 'HUAWEI Mate系列', value: 5.27 },
					{ name: 'HarmonyOS 4', value: 5.8 },
					{ name: 'HUAWEI Mate X3 典藏版', value: 3.09 },
					{ name: 'HUAWEI Mate 50E', value: 300 },
					{ name: 'HUAWEI P50 Pocket', value: 150 },
					{ name: 'HUAWEI nova 11 Pro', value: 2.55 },
					{ name: '华为畅享 60 Pro', value: 3.88 },
					{ name: 'HUAWEI P50 Pocket 艺术定制版', value: 8.04 },
					{ name: 'HUAWEI WATCH 4', value: 5.87 },
					{ name: '华为Vision智慧屏 Z65 电竞版', value: 6.97 },
					{ name: '华为凌霄子母路由 Q6', value: 60 },
					{ name: '华为路由 AX2 Pro', value: 500 },
					{ name: 'HUAWEI MatePad 2023', value: 50 },
					{ name: '华为智能门锁', value: 3.25 },
					{ name: 'HUAWEI WATCH 4 Pro', value: 9.93 },
					{ name: 'HUAWEI MatePad 10.8', value: 720 },
				],
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 初始化近7天产品追溯扫码统计
const initChartsSevenDays = () => {
	const myChart = echarts.init(chartsSevenDaysRef.value);
	const option = {
		grid: {
			top: 15,
			right: 15,
			bottom: 20,
			left: 30,
		},
		tooltip: {
			trigger: 'axis',
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: '销售额',
				type: 'line',
				stack: '总量',
				data: [12, 32, 33, 34, 90, 99, 120],
			},
			{
				name: '新增会员',
				type: 'line',
				stack: '总量',
				data: [22, 82, 91, 91, 90, 130, 140],
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 初始化近30天预警总数
const initChartsWarning = () => {
	const myChart = echarts.init(chartsWarningRef.value);
	const option = {
		grid: {
			top: 50,
			right: 20,
			bottom: 30,
			left: 30,
		},
		tooltip: {
			trigger: 'item',
		},
		series: [
			{
				name: '面积模式',
				type: 'pie',
				radius: [20, 50],
				center: ['50%', '50%'],
				roseType: 'area',
				itemStyle: {
					borderRadius: 8,
				},
				data: [
					{ value: 14, name: '一号店铺' },
					{ value: 27, name: '二号店铺' },
					{ value: 14, name: '三号店铺' },
					{ value: 20, name: '四号店铺' },
					{ value: 32, name: '五号店铺' },
				],
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 初始化当前设备监测
const initChartsMonitor = () => {
	const myChart = echarts.init(chartsMonitorRef.value);
	const option = {
		grid: {
			top: 15,
			right: 15,
			bottom: 20,
			left: 30,
		},
		tooltip: {
			trigger: 'axis',
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				itemStyle: {
					color: '#289df5',
					borderColor: '#289df5',
					areaStyle: {
						type: 'default',
						opacity: 0.1,
					},
				},
				data: [70, 100, 90, 98, 50, 60, 90, 92],
				type: 'line',
				areaStyle: {},
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 初始化近7天投入品记录
const initChartsInvestment = () => {
	const myChart = echarts.init(chartsInvestmentRef.value);
	const option = {
		grid: {
			top: 15,
			right: 15,
			bottom: 20,
			left: 30,
		},
		tooltip: {
			trigger: 'axis',
		},
		xAxis: {
			type: 'category',
			data: ['0-20', '20-50', '50-100', '100-300', '300-500', '500以上'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: [80, 60, 55, 50, 45, 65],
				type: 'bar',
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			state.myCharts[i].resize();
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
	initChartsCenterOne();
	initChartsSevenDays();
	initChartsWarning();
	initChartsMonitor();
	initChartsInvestment();
	initEchartsResize();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
</script>

<style scoped lang="scss">
@import './chart.scss';
</style>
