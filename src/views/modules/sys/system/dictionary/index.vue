<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @addWord="addWord"></list>
        <word v-if="wordVisible" ref="wordCompon" @wordList="wordList"></word>
    </div>
</template>

<script>
    import list from "./list"
    import word from "./word"
    export default {
        data () {
            return {
                mainVisible:true,
                wordVisible:false
            }
        },
        components:{
            list,
            word
        },
        methods:{
            addWord(row){
                this.wordVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.wordCompon.init(row);
                })
            },
            wordList(){
                this.wordVisible = false;
                this.mainVisible = true;
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            }

        }
    }
</script>

<style>
</style>