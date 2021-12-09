<template>
    <b-card
        border-variant="secondary"
        :header="webtoon.title"
        header-text-variant="white"
        header-bg-variant="dark"
        :img-src="webtoon.img"
        img-alt="Image"
        img-middle
        tag="article"
        style="max-width: 10rem;"
        class="sm-2"
        nobody
    >
    </b-card>
</template>
<script>
export default {
    name: 'WebtoonList',
    props:{
        webtoon: Array,
    }
}
</script>