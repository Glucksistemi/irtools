const templates = {
    list_level: '<ol><li  v-for="item in arr" v-on:click.stop="raiseName(item.id, item.children)" :key="item.name">{{item.name}}' +
    '<list-level v-if="item.children" v-bind:arr="item.children" v-on:choose="raiseName"></list-level>' +
    '</li></ol>',
    table: '<table><tr><th v-for="field in header">{{field}}</th></tr>' +
    '<tr v-for="row in rows"><td v-for="cell in row">{{cell}}</td></tr></table>'
}