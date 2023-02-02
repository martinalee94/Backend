<template>
    <div>
        <b-nav tabs align="center">
            <b-nav-item active>Active</b-nav-item>
            <b-nav-item>Link</b-nav-item>
            <b-nav-item>Link with a long name </b-nav-item>
        </b-nav>
    </div>
    
</template>
<script>
export default {
    name:'Header',
    props:{
        webtoons : Array
    }
}
</script>