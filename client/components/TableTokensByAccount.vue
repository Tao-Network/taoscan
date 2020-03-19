<template>
    <div
        v-if="loading"
        :class="(loading ? 'tao-loading tao-loading--full' : '')"/>
    <section v-else>
        <div
            v-if="total == 0"
            class="tao-empty">
            <i class="fa fa-exchange tao-empty__icon"/>
            <p class="tao-empty__description">No token found</p>
        </div>

        <p
            v-if="total > 0"
            class="tao-total-items">{{ _nFormatNumber('token', 'tokens', total) }}</p>

        <table-base
            v-if="total > 0"
            :fields="fields"
            :items="items"
            class="tao-table--tokens-by-account">

            <template
                slot="hash"
                slot-scope="props">
                <nuxt-link
                    v-if="token_type === 'trc1'"
                    :class="props.item.tokenObj ? '' : 'text-truncate'"
                    :to="{name: 'tokens-slug-trc1-holder', params: {slug: props.item.token, holder: holder}}">
                    {{ props.item.tokenObj ? props.item.tokenObj.name : props.item.token }}</nuxt-link>
                <nuxt-link
                    v-if="token_type === 'trc2'"
                    :class="props.item.tokenObj ? '' : 'text-truncate'"
                    :to="{name: 'tokens-slug-trc2-holder', params: {slug: props.item.token, holder: holder}}">
                    {{ props.item.tokenObj ? props.item.tokenObj.name : props.item.token }}</nuxt-link>
                <nuxt-link
                    v-if="token_type === 'trc3'"
                    :class="props.item.tokenObj ? '' : 'text-truncate'"
                    :to="{name: 'tokens-slug-trc3-holder', params: {slug: props.item.token, holder: holder}}">
                    {{ props.item.tokenObj ? props.item.tokenObj.name : props.item.token }}</nuxt-link>
            </template>

            <template
                slot="quantity"
                slot-scope="props">
                <span
                    v-if="token_type === 'trc1' || token_type === 'trc2'">
                    {{ formatUnit(toTokenQuantity(props.item.quantity, props.item.tokenObj.decimals),
                                  props.item.tokenObj.symbol) }}</span>
                <span
                    v-if="token_type === 'trc3'">
                    {{ props.item.tokenId }}</span>
            </template>

        </table-base>

        <b-pagination
            v-if="total > 0 && total > perPage"
            v-model="currentPage"
            :total-rows="pages * perPage"
            :per-page="perPage"
            :number-of-pages="pages"
            :limit="7"
            align="center"
            class="tao-pagination"
            @change="onChangePaginate"
        />
    </section>
</template>
<script>
import mixin from '~/plugins/mixin'
import TableBase from '~/components/TableBase'

export default {
    components: {
        TableBase
    },
    mixins: [mixin],
    props: {
        holder: {
            type: String,
            default: ''
        },
        token_type: {
            type: String,
            default: ''
        },
        page: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parent: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        fields: {
            hash: { label: 'Token' },
            quantity: { label: self.token_type === 'trc3' ? 'Token ID' : 'Quantity' }
        },
        loading: true,
        total: 0,
        items: [],
        currentPage: 1,
        perPage: 15,
        pages: 1,
        block: null
    }),
    async mounted () {
        this.getDataFromApi()
    },
    methods: {
        async getDataFromApi () {
            let self = this

            // Show loading.
            self.loading = true

            let params = {
                page: self.currentPage,
                limit: self.perPage
            }

            let query = this.serializeQuery(params)
            let { data } = await this.$axios.get(`/api/tokens/holding/${self.token_type}/${self.holder}` + '?' + query)
            self.items = data.items
            self.total = data.total
            self.pages = data.pages

            if (self.page) {
                self.page.tokensCount = self.total
            }

            // Hide loading.
            self.loading = false

            return data
        },
        onChangePaginate (page) {
            this.currentPage = page
            this.getDataFromApi()
        }
    }
}
</script>
