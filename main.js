const ArrayTabler = {
    el: '#container',
    data: {
        unparsed: '{"arr1":[1,2,3],"arrcontainer":{"notarr":false,"int":42,"arr2":[{"id":1,"name":"subject","value":"555"},{"id":2,"value":41,"itemNo":543},{"name":"other One","renderable_shit":"asdfree"}]},"string":"string content"}',
        parsed: {},
        arrays: null,
        selected_array: [],
        table_header: [],
        table_rows: []
    },
    methods: {
        parse: function () {
            let id = 0;
            const findArrays = function (obj) {
                let arrayNames = [];
                for (let item in obj) {
                    if(Array.isArray(obj[item])) {
                        arrayNames.push({name: item, id: id});
                        id++
                    } else {
                        if (typeof(obj[item]) == "object" && obj[item] !== null) {
                            const subarrays = findArrays(obj[item]);
                            if (subarrays !== []) {
                                arrayNames.push({
                                    name: item,
                                    children: subarrays,
                                    id: id
                                });
                                id++
                            }
                        }
                    }
                }
                return arrayNames
            };
            try {
                this.parsed = JSON.parse(this.unparsed);
            } catch (e) {
                alert("ERROR: Nothing to parse:'(");
                return
            }
            this.arrays = findArrays(this.parsed);
        },
        showTable: function (id) {
            this.table_header = [];
            this.table_rows = [];
            const getItem = function (id, subset) {
                let found;
                for (let item of subset) {
                    if (item.id === id) {
                        return [item.name]
                    }
                    if (item.children) {
                        found = getItem(id, item.children);
                        if (found) {
                            found.unshift(item.name);
                            return found
                        }
                    }
                }
                return false
            };
            const levels = getItem(id, this.arrays);
            let proper_array = this.parsed;
            for (let level of levels) {
                proper_array = proper_array[level]
            }
            for (let row of proper_array) {
                if (typeof row === 'object' && row !== null) {
                    let rowvalues = [];
                    for (let field in row) {
                        if (this.table_header.indexOf(field) == -1) {
                            this.table_header.push(field)
                        }
                        if (row[field] === null) {
                            rowvalues[this.table_header.indexOf(field)] = "null"
                        } else {
                            rowvalues[this.table_header.indexOf(field)] = row[field].toString()
                        }
                    }
                    this.table_rows.push(rowvalues)
                }
            }
            for (let tablerow of this.table_rows) {
                for (i = 0; i = this.table_header.length - tablerow.length; i++) {
                    tablerow.push('')
                }
            }
            if (this.table_header === []) {
                alert("No objects in array, sorry:'(")
            }
        }
    }
};
Vue.component('list-level', {
    props: ['arr'],
    template: templates.list_level,
    methods: {
        raiseName: function (id, children) {
            if (!children) {
                this.$emit('choose', id)
            }
        }
    }
});
Vue.component('result-table', {
    props: ['header', 'rows'],
    template: templates.table
});