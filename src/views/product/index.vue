<template>
  <v-container fluid>
    <app-bar></app-bar>
    <v-row no-gutters>
      <v-col
          cols="12"
          sm="6"
          md="8"
          offset-md="2"
      >
        <v-layout row>
          <formDialog
              :dialogStatus.sync="formDialogStatus"
              :editedData="editedItem"
              :indexEdited.sync="editedIndex"
          ></formDialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>

        <v-spacer class="mt-8"></v-spacer>

        <v-toolbar dense>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>

          <v-toolbar-title>Product List</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>

          <v-btn color="primary" dark class="mb-2" @click="newItem">
            New Item
          </v-btn>
        </v-toolbar>


        <v-data-table
            :headers="headers"
            :items="getSchema"
            sort-by="calories"
            class="elevation-1"
            :options.sync="options"
            :loading="loading"
            :server-items-length="options.totalItems"
        >
          <template v-slot:item.image="{ item }">
            <div class="p-2">
              <v-img :src="item.image" :alt="item.name" width="50px"></v-img>
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
                color="primary"
                class="mx-2"
                fab
                small
                dark
                @click="editItem(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
                color="error"
                fab
                small
                dark
                @click="deleteItem(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>

import appBar from "@/components/appBar";
import formDialog from "@/components/products/productForm.vue";

export default {
  components: {
    formDialog,
    appBar
  },

  data() {
    return {
      search: '',
      dialog: false,
      formDialogStatus: false,
      dialogDelete: false,
      options: {},
      loading: true,
      searchParam: {},

      headers: [
        {text: 'Title', align: 'start', sortable: false, value: 'title'},
        {text: 'Image', sortable: false, value: 'image'},
        {text: 'Price',  value: 'price'},
        {text: 'Description', sortable: false, value: 'description'},
        {text: 'Actions', align: 'center', value: 'actions', sortable: false},
      ],

      editedIndex: -1,
      editedItem: this.unSetEditedData(),
    }
  },

  computed: {
    getSchema() {
      return this.$store.getters.getProductList;
    }
  },

  methods: {

    unSetEditedData() {
      this.editedItem = {
        id: "",
        title: "",
        description: "",
        price: "",
        image: {},
        status: 1
      };
    },
    dialogOpen() {
      this.formDialogStatus = true;
    },

    newItem() {
      this.unSetEditedData();
      this.dialogOpen();
    },

    editItem(item) {
      this.editedIndex = this.getSchema.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.formDialogStatus = true;
    },

    deleteItem(item) {
      this.editedIndex = this.getSchema.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.unSetEditedData())
        this.editedIndex = -1
      })
    },

    deleteItemConfirm() {
      let self = this;
      let item = this.editedItem;

      this.$store
          .dispatch("deleteProduct", item)
          .then(function () {
            try {
              self.dialogDelete = false
              self.$store.dispatch("fetchProductList");
            } catch (ex) {
              console.log(ex);
            }
          })
          .catch(function (error) {
            console.log(error);
            self.$store.dispatch("fetchProductList");
          });
    },

    setLimit() {
      const { sortBy, page, itemsPerPage } = this.options;
      this.searchParam.page = page;
      this.searchParam.limit = itemsPerPage;
      this.searchParam.sort = sortBy;
      this.searchParam.search = this.search;

    },

    getDataFromApi() {
      this.loading = true;
      this.setLimit();
      this.$store.dispatch("fetchProductList", this.searchParam).then(data => {
        this.loading = false;
        this.options.totalItems = data.meta.total;
      });
    }

  },

  watch: {
    options: {
      handler () {
        this.getDataFromApi()
      },
      deep: true,
    },
  }
}
</script>

<style scoped>

</style>