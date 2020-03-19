<template>
    <section>
        <table-token-tx-trc2/>
    </section>
</template>

<script>
import TableTokenTxTrc21 from '~/components/TableTokenTxTrc21'

export default {
    components: {
        TableTokenTxTrc21
    },
    head () {
        return {
            title: 'Token TRC2 Transfers'
        }
    },
    async mounted () {
        // Init breadcrumbs data.
        this.$store.commit('breadcrumb/setItems', { name: 'tokentxs-trc2', to: { name: 'tokentxs-trc2' } })
    }
}
</script>

<style scoped>

</style>
