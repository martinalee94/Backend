<template>
  <div>
    <Header :webtoons='webtoons'></Header>
    
    <div class>
      <b-card-group deck>
        <WebtoonList :webtoon='webtoons[i]' v-for="(w, i) in webtoons" :key="i"></WebtoonList>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import WebtoonList from './components/WebtoonList.vue'
import Header from './components/Header.vue'
import * as ax  from './api/index.js'
export default {
  name: 'App',
  components: {
    WebtoonList,
    Header,
  },
  data(){
    return{
      webtoons : null,
      loading : true,
    }
  },
  methods:{

  },
  mounted(){ //예를 들어, 마운트 되기 전에 디비콜하고, 변수에 바인딩해줘서 값을 가져옴
    console.log('beforeMount')
    ax.getWebtoonList()
    .then((res) =>{
      console.log(res.data)
      this.webtoons = res.data
    })
    .catch((e)=>{
      console.log(e)
    })
    .finally(()=>{
      this.loading = false;
    })
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
