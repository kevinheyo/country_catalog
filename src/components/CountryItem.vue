<script>
import {h} from 'vue'

const isObject = d => typeof d === 'object' && (d !== null)

export default {
  name: "CountryItem",

  props: {
    content: {
      required: true,
      type: [Object, Array, String]
    }
  },

  render() {
    const vm = this
    const content = vm.content

    if (content === null) {
      return h('p', '')
    }

    if (typeof content === 'string' || typeof content === 'number') {
      return h('p', content)

    }

    if (Array.isArray(content)) {
      return h('ul', content.map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
          return h('li', item)
        } else if (isObject(item)) {
          return vm.renderObject(item)
        }
      }))
    }

    if (isObject(content)) {
      return vm.renderObject(content)
    }

    return h('p', 'ERROR')
  },

  methods: {
    renderObject(obj) {
      const keys = Object.keys(obj)

      return h('ul', keys.map((key) => {
          return h('li', `${key}: ${obj[key]}`)
        })
      )
    }
  }
}
</script>

<style scoped>

</style>