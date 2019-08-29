<template>
    <div class="myGrid">
        <el-row>
            <el-col :span="24">
                <div class="rltv">
                    <div class="tree-title tree-head-first">分类名称</div>
                    <!-- <div class="tree-title tree-head-first">新增下级</div> -->
                    <el-row class="last">
                        <el-col v-for="col in mate.columns" :key="col.label" :span="col.span" class="tree-title" :class="{'text-center': col.center}">{{col.label}}</el-col>
                        <!--<el-col :span="actionSpan" class="tree-title text-center" v-if="this.mate.actions && this.mate.actions.length">分类图片</el-col>
                        <el-col :span="actionSpan" class="tree-title text-center" v-if="this.mate.actions && this.mate.actions.length">是否显示</el-col>-->
                        <el-col :span="actionSpan" class="tree-title text-center" v-if="this.mate.actions && this.mate.actions.length">操作</el-col>
                    </el-row>
                </div>
                <div class="myGridTree">
                    <el-tree :data="mate.rows" node-key="id" :props="defaultProps" v-bind="mate.options" @check-change="handleCheckChange" :render-content='renderContent'
                             @node-click="handleClick" @current-change="handleCurrentChange" ref="myTreeGrid"></el-tree>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import MyButton from './MyButton.vue';

    export default {
        components: {
            MyButton
        },
        // props: {
        //     mate: Object,
        //     required: true
        // },
        props: {
            mate: {
                type: Object,
                required: true
            },
            children:{
                type: String,
                default: 'children'
            },
            label:{
                type: String,
                default: 'label'
            }
        },
        data () {
            return {
                defaultProps: {
                    children: "children",
                    label: "label"
                    // children: this.children,
                    // label: this.label
                },
                tree: null,
                btnDisable: true,
                actionSpan: 0
            };
        },
        mounted () {
            this.tree = this.$refs.myTreeGrid;
        },
        created () {
            this.execSpan();
        },
        methods: {
            // 计算按钮宽度
            execSpan () {
                let sum = 0;
                this.mate.columns.map(col => {
                    sum += Number.parseInt(col.span);
                });
                this.actionSpan = (24 - sum);
                this.mate.actions = this.mate.actions.filter(item => !item.isHide);
                if (!this.mate.actions || !this.mate.actions.length) {
                    let last = this.mate.columns.length;
                    this.mate.columns[last - 1].span += this.actionSpan;
                }
            },
            renderContent: function (h, node) {
                // 生成按钮
                var self = this;
                let buttons = [];
                if (this.mate.actions) {
                    for (let btn of this.mate.actions) {
                        btn.text = typeof btn.prop === 'function' ? btn.prop(node.data) : btn.prop || '按钮';
                        if(btn.className == "arttuijian"){
                        	buttons.push(h(MyButton, {
	                            props: {
	                                name: node.data.recommendFlag ? "取消推荐" : "设为推荐",
	                                row: node.data,
	                                type: btn.type,
	                                className: btn.className || ''
	                            },
	                            on: {
	                                action: btn.action
	                            }
	                        }));
                        }else{
                        	buttons.push(h(MyButton, {
	                            props: {
	                                name: btn.text,
	                                row: node.data,
	                                type: btn.type,
	                                className: btn.className || ''
	                            },
	                            on: {
	                                action: btn.action
	                            }
	                        }));
                        }
                        
                    }
                }

                // 单元格渲染
                let colSpan = 0;
//              console.log(this.mate.columns);
                let cols = this.mate.columns.map((col) => {
                    let value = '--',
                        key =  col.prop;
                    if (typeof key === 'function') {
                        value = key.call(this.mate._self || null, h, node.data);
                        value = value instanceof Array ? value : [value];
                    } else if (typeof key === 'string' && node.data[key]) {
                        value = node.data[key];
                    }
                    colSpan = Number(col.span);
                    if (colSpan <= 0) colSpan = 3;
                    
                	// 分类图片(插入图片)
                	if(key == 'genderMain' && value != '--'){
                		return h(
                			'el-col',
                    		{
	                    		'props': {span: colSpan},
	                    		'class': {'text-center': col.center, 'textIndex5': true},
	                    		'domProps': { innerHTML: `<img src=${value} width=100%>` },// DOM 属性
                			},   
						);
                	};
                	
					// 是否显示(插入开关)
					if(key == 'showFlag'){
						// 打印出 这俩值看看
						//console.log( node.data[key], value)
						/**
						 * jsx 语法
						 * {} 解析变量
						 * on-事件   触发组件内部使用 `vm.$emit` 触发的事件
						 * nativeOn事件 仅用于组件，用于监听原生事件
						*/
						return (
							<el-col span={col.span} >
								<el-switch 
									value={node.data.showFlag == 1 ? true : false} 
									on-change={ () => node.data.showFlag = node.data.showFlag == 0 ? 1 : 0 } 
									nativeOnClick={(event) => {
										this.$emit("act-click", node.data)
//										event.stopPropagation()
									}}
                   				></el-switch>
							</el-col>
						)
					};


                    return h('el-col', {props: {span: colSpan}, 'class': {'text-center': col.center, 'textIndex5': true}}, value);
                });

                // 插入行按钮
                cols.push(h('el-col', {props: {span: this.actionSpan}, 'class': {'text-center': true}}, buttons));
                
                return h('span', [h('span', node.data.label), h('div', {'class': {'line-row': true}}, cols)]);
            },
            handleCheckChange (...list) {
                this.$emit('check-change', ...list);
            },
            handleClick (...list) {
                this.$emit('node-click', ...list);
            },
            handleCurrentChange (...list) {
                this.$emit('current-change', ...list);
            }
        }
    };
</script>

<style lang="scss">
    $textIn: 8px;
    $borderColor: #e6ebf5;
    $lineH: 53px;
    .myGrid {
        .tree-title {
            text-align: center;
            border-bottom: 1px solid $borderColor;
            border-right: 1px solid $borderColor;
            white-space: nowrap;
            overflow: hidden;
            background-color: #ecf1f6;
            height: $lineH;
            text-indent: $textIn;
            line-height: $lineH;
            min-width: 0;
            text-overflow: ellipsis;
            box-sizing: border-box;
            font-size: 14px;
            color: #333;
        }

        .tree-head-first {
            width: 30%;
            padding-left: 15px;
            position: absolute;
            left: 0;
            top: 0;
        }
        .el-tree-node__content {
            line-height: $lineH;
            height: $lineH;
            position: relative;
            border: 1px solid $borderColor;
            border-top: none;
            text-align: left;
            .line-row {
                text-align: center;
                position: absolute;
                left: 30%;
                top: 0;
                width: 70%;
                margin-left: -1px;
                .el-col {
                    overflow: hidden;
                    border-left: 1px solid $borderColor;
                }
            }
        }
        .myGridTree {

        }
        .line-btn {
            margin-left: 0;
            position: absolute;
            top: 10px
        }

        .textIndex5 {
            text-indent: $textIn;
        }

        .last {
            margin-left: 30%;
        }
        .rltv {
            position: relative;
            border: 1px solid #dfe6ec;
            border-bottom: 0;
        }
        .col-tree, .text-center {
            text-align: center;
        }
    }
    
    .el-tree-node__content .arttuijian{
    	display: none;
    }
    .el-tree-node__children .artadd{
    	display: none;
    }
    .el-tree-node__children .arttuijian{
    	display: inline-block;
    }
    
    .el-button + .el-button {
	    margin-right: 20px;
	    margin-left: 0px;
	}
</style>
